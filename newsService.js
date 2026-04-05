/**
 * newsService.js
 * 
 * Este servicio centraliza toda la interacción con la API de Supabase.
 * Se encarga de la persistencia de datos (Base de Datos) y la subida de
 * imágenes (Storage) para el sistema de noticias de NutriEnzo.
 */

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// Configuración: Extraemos las credenciales del archivo .env a través de Vite.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://igsthytnejgwigdkgsqs.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_bERmdwOJboSWq-jheWwtUw_GIfp699p';

// Inicialización del cliente de Supabase para toda la aplicación
export const supabase = createClient(supabaseUrl, supabaseKey);

export const newsService = {
  
  /**
   * Obtiene todos los artículos de la tabla 'news_articles'.
   * Los ordena cronológicamente (más recientes primero).
   * @returns {Promise<Array>} Lista de noticias o array vacío en caso de error.
   */
  async getAll() {
    const { data, error } = await supabase
      .from('news_articles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error al obtener noticias:', error);
      return [];
    }
    return data;
  },

  /**
   * Guarda o actualiza un artículo de noticias.
   * Si se proporciona un archivo (file), se sube primero al Bucket de Supabase Storage.
   * @param {Object} newsItem Datos del artículo (título, categoría, etc.).
   * @param {File|null} file Imagen seleccionada por el usuario (opcional).
   */
  async save(newsItem, file = null) {
    let imageUrl = newsItem.image;

    // Lógica de Subida de Imagen al Bucket 'news-images'
    if (file) {
      // Generamos un nombre único usando timestamp para evitar colisiones
      const fileName = `${Date.now()}-${file.name}`;
      const { data: storageData, error: storageError } = await supabase.storage
        .from('news-images')
        .upload(fileName, file);

      if (storageError) {
        console.error('Error al subir imagen al Storage:', storageError);
      } else {
        // Obtenemos la URL pública real para guardarla en la base de datos
        const { data: publicUrlData } = supabase.storage
          .from('news-images')
          .getPublicUrl(fileName);
        imageUrl = publicUrlData.publicUrl;
      }
    }

    // Estructura de datos para enviar a la tabla 'news_articles'
    const payload = {
      title: newsItem.title,
      category: newsItem.category,
      content: newsItem.content,
      image_url: imageUrl,
      updated_at: new Date().toISOString()
    };

    if (newsItem.id) {
      // Caso: Edición de una noticia existente (UPDATE)
      const { error } = await supabase
        .from('news_articles')
        .update(payload)
        .eq('id', newsItem.id);
      if (error) console.error('Error al actualizar la noticia:', error);
    } else {
      // Caso: Creación de una noticia nueva (INSERT)
      const { error } = await supabase
        .from('news_articles')
        .insert([{ ...payload, created_at: new Date().toISOString() }]);
      if (error) console.error('Error al insertar la noticia:', error);
    }
  },

  /**
   * Elimina permanentemente un registro de la base de datos por su ID.
   * @param {string|number} id Identificador único de la noticia.
   */
  async delete(id) {
    const { error } = await supabase
      .from('news_articles')
      .delete()
      .eq('id', id);
    if (error) console.error('Error al eliminar la noticia:', error);
  },

  /**
   * Registra un nuevo correo electrónico en la lista de suscriptores.
   * @param {string} email Correo electrónico a suscribir.
   * @throws {Error} Si el correo ya existe o hay un fallo de red.
   */
  async subscribe(email) {
    const { error } = await supabase
      .from('newsletter_subscribers')
      .insert([{ email }]);
    
    if (error) {
      // El código '23505' corresponde a una violación de restricción única (ya existe correo)
      if (error.code === '23505') { 
        throw new Error('Este correo ya está suscrito.');
      }
      throw error;
    }
  }
};
