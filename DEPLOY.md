# Guía de Despliegue — Vercel 🚀

NutriEnzo está configurado para un despliegue rápido y sin fricciones en **Vercel**. Al ser un proyecto basado en **Vite**, el proceso es casi automático.

## 1. Conectar con GitHub

- Sube tu proyecto a un repositorio privado o público en GitHub.
- Ve a [Vercel](https://vercel.com/) y crea un nuevo proyecto.
- Selecciona el repositorio de **NutriEnzo**.

## 2. Configuración de Variables de Entorno

En el panel de configuración de Vercel (**Settings > Environment Variables**), debes añadir las mismas claves que tienes en tu `.env` local:

- **`VITE_SUPABASE_URL`**: La URL de tu proyecto de Supabase.
- **`VITE_SUPABASE_ANON_KEY`**: La Anon Key (Public) de Supabase.
- **`VITE_ADMIN_SECRET_KEY`**: La clave secreta para el login (Ej: `NUTRI_ENZO_2024`).

## 3. Comandos de Build

Vercel detectará automáticamente que es un proyecto **Vite**, pero por si acaso, estos son los comandos:

- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

## 4. ¡Listo para Producción!

Una vez configurado, cada vez que hagas un `git push` a tu rama principal, Vercel desplegará automáticamente la nueva versión.

---

### Recordatorio Final:
Asegúrate de que en el dashboard de Supabase:
1. Las tablas `news_articles` y `newsletter_subscribers` estén creadas.
2. El bucket `news-images` en **Storage** sea público para que las imágenes se vean correctamente.
