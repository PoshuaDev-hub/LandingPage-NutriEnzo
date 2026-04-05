# Estrategia del Sistema de Diseño: El Laboratorio de Rendimiento Kinético

## 1. Visión General y Norte Creativo
El "Laboratorio de Rendimiento Kinético" es un sistema de diseño de alta gama adaptado para la nutrición deportiva de élite. Se aleja de la estética genérica de "bienestar" para entrar en un espacio de **Editorial de Hiper-Rendimiento**. Este sistema se define por su profundidad arquitectónica, energía de alto contraste y precisión técnica.

**Norte Creativo: El Catalizador de Precisión**
El diseño debe sentirse como un instrumento de alto rendimiento: autoritario pero con aire. Logramos esto rompiendo la cuadrícula tradicional con una asimetría intencional, donde imágenes profesionales de alta calidad se superponen a elementos de la interfaz "flotantes". Esto crea una sensación de movimiento kinético, imitando el viaje del atleta.

---

## 2. Colores: Profundidad Tonal y Acentos de Alto Voltaje
Este sistema utiliza una base de "Tecnología Profunda" (Deep Tech) para permitir que los acentos vibrantes resalten con la máxima luminancia percibida.

### Referencia de la Paleta de Colores
- **Fondo (`#0e0e0e`):** La base absoluta. Un carbón profundo que proporciona una profundidad infinita.
- **Primario / Acento Lima (`#f3ffca` y `#cafd00`):** Usado para métricas de rendimiento, resaltados de alto valor e indicadores de progreso.
- **Terciario / Magenta-Púrpura (`#e575ff`):** Reservado exclusivamente para Llamados a la Acción (CTAs) orientados a la conversión. Esto crea un "disparador" psicológico de color distinto del verde lima informativo.

### La Regla de "No Líneas"
**Instrucción Explícita:** No utilizar bordes sólidos de 1px para separar secciones. La estructura debe definirse a través de cambios en el color de fondo.
- Una sección sobre `surface` puede transicionar a una sección `surface-container-low` (`#131313`) para denotar un cambio de tema.
- Usar márgenes amplios (Escala de Espaciado `20` o `24`) para dejar que el fondo proporcione el límite.

### Glassmorphism y Texturas de Firma
Para lograr una sensación premium y personalizada:
- **Elementos Flotantes de Cristal:** Usar `surface-variant` (`#262626`) al 60% de opacidad con un `backdrop-filter: blur(20px)`. Esto crea una capa "esmerilada" que se siente integrada en la fotografía profesional detrás de ella.
- **Alma Tonal:** Aplicar un degradado radial sutil en los CTAs del Hero desde `tertiary` (`#e575ff`) hasta `tertiary-container` (`#dd5efc`) en un ángulo de 45 grados. Esto añade "peso" y un acabado profesional que los códigos hex planos carecen.

---

## 3. Tipografía: Autoridad Editorial
Utilizamos un emparejamiento de alto contraste: **Space Grotesk** para la autoridad estructural e **Inter** para la claridad técnica.

- **Pantalla y Títulos (Space Grotesk):** Estos son tus elementos "gancho". Usa `display-lg` (3.5rem) con un espaciado entre letras ajustado (-0.02em) para los títulos principales. La naturaleza geométrica de Space Grotesk refleja la precisión de la ciencia nutricional.
- **Cuerpo y Etiquetas (Inter):** Todos los datos técnicos, listas de ingredientes y descripciones usan Inter. Es el "caballo de batalla" que asegura una alta legibilidad contra la superficie oscura.
- **Intención Tipográfica:** Usar `primary` (`#f3ffca`) para etiquetas de alto nivel (como "NUTRITIONIST UDD") para atraer la mirada, mientras se mantiene el texto del cuerpo en `secondary` (`#e5e2e1`) para una lectura cómoda de largo formato.

---

## 4. Elevación y Profundidad: Capas Tonales
Los sombreados tradicionales están prohibidos. Creamos profundidad a través del **Principio de Capas**.

- **Pila de Superficies:** Colocar una tarjeta `surface-container-highest` (`#262626`) sobre una sección `surface-container-low` (`#131313`). El cambio en el valor hexadecimal crea una "elevación" natural sin el desorden de las sombras.
- **Sombras Ambientales:** Si un elemento debe "flotar" (ej: una tarjeta de cita flotante), usar un color de sombra teñido con el tono primario: `rgba(243, 255, 202, 0.05)` con un desenfoque de 40px. Esto imita el brillo de un monitor de gimnasio de alta gama.
- **El "Borde Fantasma":** Para la contención de tarjetas, usar el token `outline-variant` al **15% de opacidad**. Esto crea una "sugerencia" de límite que solo es visible tras una inspección enfocada, manteniendo una estética minimalista.

---

## 5. Componentes

### Botones
- **CTA Primario (El Disparador de Conversión):** Usa `tertiary`. Forma de píldora (Redondez `full`). Estos deben destacar como la acción más importante.
- **Secundario (La Acción Informativa):** Usa `primary-container` (`#cafd00`) con texto `on-primary-container`. Usado para "Saber más" o "Ver Programa".
- **Fantasma (La Opción Sutil):** Borde fantasma `outline-variant` con texto `on-surface`.

### Tarjetas
Las tarjetas nunca deben tener divisores.
- **Estructura:** Usar `surface-container` con Redondez `xl` (0.75rem).
- **Separación:** El contenido dentro de las tarjetas se separa por `spacing-5` (1.7rem) de espacio en blanco.
- **Elementos Circulares:** Incorporar máscaras de imagen circulares para el retrato del nutricionista o macros de ingredientes para romper la monotonía "cuadrada" de las tarjetas.

### Campos de Entrada
- **Estado por Defecto:** Fondo `surface-container-high` con un sutil "Borde Fantasma".
- **Estado de Foco:** El borde transiciona a `primary` (`#f3ffca`) al 100% de opacidad con un suave brillo exterior.
- **Estado de Error:** Usar texto `error_dim` (`#d53d18`) con un borde de `error`.

### Chips de Rendimiento
- Chips pequeños con redondez `full` usados para etiquetas como "Alto en Proteínas" o "Rendimiento". Usar `surface-bright` con texto `on-surface-variant`.

---

## 6. Qué hacer y Qué no hacer

### Qué hacer
- **Hacer** uso de la colocación asimétrica de imágenes. Permitir que una foto de alta resolución de un atleta "rompa" el borde superior de una tarjeta.
- **Hacer** uso del verde lima `primary` para puntos de datos (ej: "98% Tasa de Éxito") para que vibren contra el negro.
- **Hacer** énfasis en el espacio en blanco. Si crees que hay suficiente espacio, añade un nivel más de la escala de espaciado.

### Qué no hacer
- **No** usar blanco 100% (`#ffffff`) para texto largo del cuerpo; causa fatiga visual en fondos oscuros. Usar `secondary` (`#e5e2e1`).
- **No** usar "Sombras Paralelas" estándar. Se ven sucias en fondos de carbón profundo. Usar capas tonales o brillos ambientales.
- **No** usar esquinas afiladas. La nutrición deportiva trata sobre el cuerpo; usa la escala de redondez `lg` a `xl` para que la interfaz se sienta ergonómica y humana.