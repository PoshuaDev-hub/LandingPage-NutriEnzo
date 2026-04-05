/**
 * newsService.js
 * Integración con Supabase para la gestión de noticias y suscriptores.
 */

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// Configuración - Usamos variables de entorno de Vite o valores por defecto
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://igsthytnejgwigdkgsqs.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_bERmdwOJboSWq-jheWwtUw_GIfp699p';

export const supabase = createClient(supabaseUrl, supabaseKey);

export const newsService = {
  // Obtener todas las noticias desde la base de datos
  async getAll() {
    const { data, error } = await supabase
      .from('news_articles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching news:', error);
      return [];
    }
    return data;
  },

  // Guardar una nueva noticia o editar una existente
  async save(newsItem, file = null) {
    let imageUrl = newsItem.image;

    // Si hay un archivo (foto subida), lo guardamos en el Storage
    if (file) {
      const fileName = `${Date.now()}-${file.name}`;
      const { data: storageData, error: storageError } = await supabase.storage
        .from('news-images')
        .upload(fileName, file);

      if (storageError) {
        console.error('Error uploading image:', storageError);
      } else {
        // Obtener URL pública de la imagen
        const { data: publicUrlData } = supabase.storage
          .from('news-images')
          .getPublicUrl(fileName);
        imageUrl = publicUrlData.publicUrl;
      }
    }

    const payload = {
      title: newsItem.title,
      category: newsItem.category,
      content: newsItem.content,
      image_url: imageUrl,
      updated_at: new Date().toISOString()
    };

    if (newsItem.id) {
      // Editar existente
      const { error } = await supabase
        .from('news_articles')
        .update(payload)
        .eq('id', newsItem.id);
      if (error) console.error('Error updating news:', error);
    } else {
      // Crear nueva
      const { error } = await supabase
        .from('news_articles')
        .insert([{ ...payload, created_at: new Date().toISOString() }]);
      if (error) console.error('Error inserting news:', error);
    }
  },

  // Eliminar una noticia
  async delete(id) {
    const { error } = await supabase
      .from('news_articles')
      .delete()
      .eq('id', id);
    if (error) console.error('Error deleting news:', error);
  },

  // Suscribir a un nuevo usuario al newsletter
  async subscribe(email) {
    const { error } = await supabase
      .from('newsletter_subscribers')
      .insert([{ email }]);
    
    if (error) {
      if (error.code === '23505') { // Código de error para duplicado (Unique violation)
        throw new Error('Este correo ya está suscrito.');
      }
      throw error;
    }
  }
};
