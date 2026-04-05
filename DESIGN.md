# Design System Strategy: The Kinetic Performance Lab

## 1. Overview & Creative North Star
The "Kinetic Performance Lab" is a high-end design system tailored for elite sports nutrition. It moves beyond the generic "wellness" aesthetic into a space of **Hyper-Performance Editorial**. This system is defined by its architectural depth, high-contrast energy, and technical precision.

**Creative North Star: The Precision Catalyst**
The layout should feel like a high-performance instrument—authoritative yet breathable. We achieve this by breaking the traditional container grid with intentional asymmetry, where high-quality professional imagery overlaps "floating" UI elements. This creates a sense of kinetic movement, mimicking the athlete's journey.

---

## 2. Colors: Tonal Depth & High-Voltage Accents
This system utilizes a "Deep Tech" foundation to allow vibrant accents to pop with maximum perceived luminance.

### Color Palette Reference
- **Background (`#0e0e0e`):** The absolute foundation. A deep charcoal that provides infinite depth.
- **Primary / Lime Accent (`#f3ffca` & `#cafd00`):** Used for performance metrics, high-value highlights, and progress indicators.
- **Tertiary / Magenta-Purple (`#e575ff`):** Reserved exclusively for conversion-driven Calls to Action (CTAs). This creates a psychological "trigger" color distinct from the informational lime green.

### The "No-Line" Rule
**Explicit Instruction:** Do not use 1px solid borders to separate sections. Structure must be defined through background color shifts.
- A section resting on `surface` might transition into a `surface-container-low` (`#131313`) section to denote a change in topic.
- Use wide gutters (Spacing Scale `20` or `24`) to let the background provide the boundary.

### Glassmorphism & Signature Textures
To achieve a premium, custom feel:
- **Glass Floating Elements:** Use `surface-variant` (`#262626`) at 60% opacity with a `backdrop-filter: blur(20px)`. This creates a "frosted" layer that feels integrated into the professional photography behind it.
- **Tonal Soul:** Apply a subtle radial gradient on Hero CTAs from `tertiary` (`#e575ff`) to `tertiary-container` (`#dd5efc`) at a 45-degree angle. This adds "weight" and professional polish that flat hex codes lack.

---

## 3. Typography: Editorial Authority
We use a high-contrast pairing: **Space Grotesk** for structural authority and **Inter** for technical clarity.

- **Display & Headlines (Space Grotesk):** These are your "hook" elements. Use `display-lg` (3.5rem) with tight letter-spacing (-0.02em) for hero headlines. The geometric nature of Space Grotesk mirrors the precision of nutritional science.
- **Body & Labels (Inter):** All technical data, ingredient lists, and descriptions use Inter. It is the "workhorse" that ensures high readability against the dark `surface`.
- **Typographic Intent:** Use `primary` (`#f3ffca`) for high-level labels (like "NUTRITIONIST UDD") to draw the eye, while keeping body text in `secondary` (`#e5e2e1`) for comfortable long-form reading.

---

## 4. Elevation & Depth: Tonal Layering
Traditional drop shadows are forbidden. We create depth through the **Layering Principle**.

- **Surface Stack:** Place a `surface-container-highest` (`#262626`) card on top of a `surface-container-low` (`#131313`) section. The shift in hex value creates a natural "lift" without the clutter of shadows.
- **Ambient Shadows:** If an element must "float" (e.g., a floating appointment card), use a shadow color tinted with the primary hue: `rgba(243, 255, 202, 0.05)` with a 40px blur. This mimics the glow of a high-end gym monitor.
- **The "Ghost Border":** For card containment, use the `outline-variant` token at **15% opacity**. This creates a "suggestion" of a boundary that is only visible upon focused inspection, maintaining a minimalist aesthetic.

---

## 5. Components

### Buttons
- **Primary CTA (The Conversion Trigger):** Uses `tertiary`. Pill-shaped (Roundedness `full`). These must stand out as the most important action.
- **Secondary (The Information Action):** Uses `primary-container` (`#cafd00`) with `on-primary-container` text. Used for "Learn More" or "View Program."
- **Ghost (The Subtle Choice):** `outline-variant` ghost border with `on-surface` text.

### Cards
Cards must never have dividers.
- **Structure:** Use `surface-container` with Roundedness `xl` (0.75rem).
- **Separation:** Content inside cards is separated by `spacing-5` (1.7rem) of whitespace.
- **Circular Elements:** Incorporate circular image masks for the nutritionist's portrait or ingredient macros to break the "square" monotony of cards.

### Input Fields
- **Default State:** `surface-container-high` background with a subtle "Ghost Border."
- **Focus State:** Border transitions to 100% opacity `primary` (`#f3ffca`) with a soft outer glow.
- **Error State:** Use `error_dim` (`#d53d18`) text with an `error` border.

### Performance Chips
- Small, `full` rounded chips used for tags like "High Protein" or "Performance." Use `surface-bright` with `on-surface-variant` text.

---

## 6. Do's and Don'ts

### Do
- **Do** use asymmetric image placement. Allow a high-res photo of an athlete to "break" the top edge of a card.
- **Do** use `primary` lime green for data points (e.g., "98% Success Rate") to make them vibrate against the black.
- **Do** lean into white space. If you think there is enough space, add one more level from the spacing scale.

### Don't
- **Don't** use 100% white (`#ffffff`) for long body text; it causes "halation" (eye strain) on dark backgrounds. Use `secondary` (`#e5e2e1`).
- **Don't** use standard "Drop Shadows." They look muddy on deep charcoal backgrounds. Use tonal layering or ambient glows.
- **Don't** use sharp corners. Sports nutrition is about the body; use the `lg` to `xl` roundedness scale to keep the UI feeling ergonomic and human.