# Estrategia del Sistema de Diseño: The Kinetic Performance Lab

## 1. Visión General y Norte Creativo
El "Kinetic Performance Lab" es un sistema de diseño de alta gama adaptado para la nutrición deportiva de élite. Va más allá de la estética genérica de "bienestar" para entrar en un espacio de **Hiper-Rendimiento Editorial**. Este sistema se define por su profundidad arquitectónica, energía de alto contraste y precisión técnica.

**Norte Creativo: El Catalizador de Precisión**
El diseño debe sentirse como un instrumento de alto rendimiento: autoritario pero aireado. Logramos esto rompiendo la cuadrícula tradicional con una asimetría intencional, donde imágenes profesionales de alta calidad se superponen a elementos de la interfaz de usuario "flotantes". Esto crea una sensación de movimiento cinético, imitando el viaje del atleta.

---

## 2. Colores: Profundidad Tonal y Acentos de Alto Voltaje
Este sistema utiliza una base de "Tecnología Profunda" para permitir que los acentos vibrantes resalten con el máximo brillo percibido.

### Referencia de la Paleta de Colores
- **Fondo (`#0e0e0e`):** La base absoluta. Un carbón profundo que proporciona una profundidad infinita.
- **Primario / Acento Lima (`#f3ffca` y `#cafd00`):** Se utiliza para métricas de rendimiento, destacados de alto valor e indicadores de progreso.
- **Terciario / Magenta-Púrpura (`#e575ff`):** Reservado exclusivamente para Llamadas a la Acción (CTAs) orientadas a la conversión. Esto crea un color "disparador" psicológico distinto del verde lima informativo.

### La Regla de "Sin Líneas"
**Instrucción Explícita:** No usar bordes sólidos de 1px para separar secciones. La estructura debe definirse a través de cambios de color de fondo.
- Una sección sobre `surface` puede transicionar a una sección `surface-container-low` (`#131313`) para denotar un cambio de tema.
- Usar márgenes amplios (Escala de Espaciado `20` o `24`) para permitir que el fondo proporcione el límite.

### Glassmorfismo y Texturas Distintivas
Para lograr una sensación premium y personalizada:
- **Elementos Flotantes de Cristal:** Usar `surface-variant` (`#262626`) al 60% de opacidad con un `backdrop-filter: blur(20px)`. Esto crea una capa "esmerilada" que se siente integrada en la fotografía profesional detrás de ella.
- **Alma Tonal:** Aplicar un gradiente radial sutil en los CTAs del Hero desde `tertiary` (`#e575ff`) hasta `tertiary-container` (`#dd5efc`) en un ángulo de 45 grados. Esto añade "peso" y pulido profesional del que carecen los códigos hex planos.

---

## 3. Tipografía: Autoridad Editorial
Usamos una combinación de alto contraste: **Space Grotesk** para la autoridad estructural e **Inter** para la claridad técnica.

- **Display y Títulos (Space Grotesk):** Estos son los elementos de "gancho". Usar `display-lg` (3.5rem) con un espaciado entre letras ajustado (-0.02em) para los títulos principales. La naturaleza geométrica de Space Grotesk refleja la precisión de la ciencia nutricional.
- **Cuerpo y Etiquetas (Inter):** Todos los datos técnicos, listas de ingredientes y descripciones usan Inter. Es el "caballo de batalla" que garantiza una alta legibilidad contra la superficie oscura (`surface`).
- **Intención Tipográfica:** Usar `primary` (`#f3ffca`) para etiquetas de alto nivel (como "NUTRICIONISTA UDD") para atraer la mirada, mientras se mantiene el texto del cuerpo en `secondary` (`#e5e2e1`) para una lectura cómoda de larga duración.

---

## 4. Elevación y Profundidad: Capas Tonales
Las sombras paralelas tradicionales están prohibidas. Creamos profundidad a través del **Principio de Capas**.

- **Pila de Superficie:** Colocar una tarjeta `surface-container-highest` (`#262626`) sobre una sección `surface-container-low` (`#131313`). El cambio en el valor hexadecimal crea un "levantamiento" natural sin el desorden de las sombras.
- **Sombras Ambientales:** Si un elemento debe "flotar" (ej: una tarjeta de cita flotante), usar un color de sombra teñido con el tono primario: `rgba(243, 255, 0, 0.05)` con un desenfoque de 40px. Esto imita el brillo de un monitor de gimnasio de alta gama.
- **El "Borde Fantasma":** Para la contención de tarjetas, usar el token `outline-variant` al **15% de opacidad**. Esto crea una "sugerencia" de límite que solo es visible tras una inspección enfocada, manteniendo una estética minimalista.

---

## 5. Componentes

### Botones
- **CTA Primario (El Disparador de Conversión):** Usa `tertiary`. Forma de píldora (Redondeo `full`). Estos deben destacar como la acción más importante.
- **Secundario (La Acción Informativa):** Usa `primary-container` (`#cafd00`) con texto `on-primary-container`. Se utiliza para "Saber Más" o "Ver Programa".
- **Fantasma (La Opción Sutil):** Borde fantasma `outline-variant` con texto `on-surface`.

### Tarjetas
Las tarjetas nunca deben tener divisores.
- **Estructura:** Usar `surface-container` con Redondeo `xl` (0.75rem).
- **Separación:** El contenido dentro de las tarjetas se separa por `spacing-5` (1.7rem) de espacio en blanco.
- **Elementos Circulares:** Incorporar máscaras de imagen circulares para el retrato del nutricionista o macros de ingredientes para romper la monotonía "cuadrada" de las tarjetas.

### Campos de Entrada (Inputs)
- **Estado Predeterminado:** Fondo `surface-container-high` con un sutil "Borde Fantasma".
- **Estado de Foco:** El borde transiciona a `primary` (`#f3ffca`) al 100% de opacidad con un suave brillo exterior.
- **Estado de Error:** Usar texto `error_dim` (`#d53d18`) con un borde `error`.

### Chips de Rendimiento
- Chips pequeños y redondeados (`full`) usados para etiquetas como "Alto en Proteínas" o "Rendimiento". Usar `surface-bright` con texto `on-surface-variant`.

---

## 6. Qué Hacer y Qué No Hacer

### Qué Hacer (Do's)
- **SÍ** usa la colocación asimétrica de imágenes. Permite que una foto de alta resolución de un atleta "rompa" el borde superior de una tarjeta.
- **SÍ** usa el verde lima `primary` para puntos de datos (ej: "98% Tasa de Éxito") para que vibren contra el negro.
- **SÍ** apóyate en el espacio en blanco. Si crees que hay suficiente espacio, añade un nivel más de la escala de espaciado.

### Qué No Hacer (Don'ts)
- **NO** uses blanco al 100% (`#ffffff`) para texto largo del cuerpo; causa fatiga visual en fondos oscuros. Usa `secondary` (`#e5e2e1`).
- **NO** uses "Sombras Paralelas" estándar. Se ven sucias en fondos de carbón profundo. Usa capas tonales o brillos ambientales.
- **NO** uses esquinas afiladas. La nutrición deportiva trata sobre el cuerpo; usa la escala de redondeo de `lg` a `xl` para que la interfaz se sienta ergonómica y humana.