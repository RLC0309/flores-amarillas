# 🌻 Flores Amarillas para Azuleta 💛 (Edición Especial Plantas vs Zombies)

Un proyecto web interactivo, romántico y animado diseñado para sorprender a **Azuleta** en el **Día de las Flores Amarillas** (21 de Septiembre).

Incluye:
- **Girasol de Plants vs. Zombies (GIF oficial)** bailando continuamente y hablando con frases de amor.
- Canción oficial **"Zombies on Your Lawn"** de **Laura Shigihara** que suena al entrar a la página.
- **Soles dorados y pequeños girasoles interactivos** que suman puntos de amor.
- **Lluvia de pétalos y hojas cayendo** en el cielo nocturno con 5 segundos de animación cinematográfica al abrir la sorpresa.
- **Mecánica de juego PvZ:** El botón de "Razones de amor" se desbloquea al juntar **500 Soles** con una fanfarria triunfal y confeti.
- **Tarjeta romántica personalizada para Azuleta & Miau (RLC)** con fecha del **21 de Septiembre de 2026**.
- **Soporte automático para tu foto de pareja**.
- 100% responsivo para celulares y listo para compartir por WhatsApp.

---

## 🚀 Cómo Probarlo en Tu Computadora

1. Abre la carpeta del proyecto:
   `c:\Users\ricardo.izaguirre\Documents\flores amarillas test`
2. Haz doble clic sobre el archivo **`index.html`**. Se abrirá en tu navegador favorito.
3. ¡Haz clic en **"¡Toca para abrir tu sorpresa!"** y disfruta la magia!

---

## 📸 Cómo Poner la Foto (Súper Fácil, Sin Tocar Código)

1. Elige una foto bonita de ustedes dos.
2. Cópiala en esta misma carpeta (`flores amarillas test`).
3. Renómbrala exactamente a: **`foto.jpg`**.
4. ¡Listo! El código la detecta automáticamente y la muestra ajustada dentro del marco Polaroid. *(Si no hay foto, muestra el diseño de cámara por defecto).*

---

## ✏️ Dónde y Cómo Cambiar los Textos

### 1. En [index.html](file:///c:/Users/ricardo.izaguirre/Documents/flores%20amarillas%20test/index.html):

- **Nombre en la pantalla de bienvenida (Línea ~76):**
  ```html
  <h1 class="intro-title">¡Un regalo especial para Azuleta! 💛</h1>
  ```

- **Fecha (Línea ~86 y Línea ~137):**
  ```html
  <p class="intro-date">21 de Septiembre de 2026 • Día de las Flores Amarillas</p>
  <div class="card-ribbon">🌻 21 de Septiembre de 2026 🌻</div>
  ```

- **Título de la Carta (Línea ~141):**
  ```html
  <h2 class="card-main-title">Para mi hermosa Azuleta 💛</h2>
  ```

- **Mensaje de amor de la carta (Líneas ~150-165):**
  ```html
  <p>¡Feliz día de las Flores Amarillas, mi querida Azuletaaa! 🌻💛</p>
  <p>Así como este girasol siempre busca la luz del sol para sonreír...</p>
  ```

- **Firma (Línea ~205):**
  ```html
  <span class="signature-name">De: MIAU (RLC) 🐱💛</span>
  ```

- **Lista de razones de amor en el modal secreto (Líneas ~225-240):**
  ```html
  <ul class="reasons-list" id="reasons-list">
    <li>✨ <strong>Tu sonrisa, mi Azuletaaa:</strong> Es capaz de iluminar hasta el día más nublado.</li>
    <li>🌻 <strong>Tu compañía:</strong> Cada momento a tu lado hace que la vida sea más bonita.</li>
    ...
  </ul>
  ```

---

### 2. En [script.js](file:///c:/Users/ricardo.izaguirre/Documents/flores%20amarillas%20test/script.js):

- **Frases que dice el girasol al tocarlo o pedirle sol (Líneas ~45-53):**
  ```javascript
  const sunflowerPhrases = [
    "¡Feliz día, mi hermosa Azuleta! 🌻💛",
    "¡Eres el sol de Miau! ☀️🐱",
    "¡Te amo con todo mi ser, Azuletaaa! 💛",
    "¡MIAU siempre protegerá tu jardín! 🧟‍♂️🌱",
    "¡Tu sonrisa ilumina mi mundo! ✨",
    "¡Juntos por siempre, mi amor! 💖",
    "¡Flores amarillas hoy y siempre para ti! 🌼"
  ];
  ```

---

## 🌐 Cómo Publicarlo GRATIS para Enviárselo por WhatsApp

### Opción 1: Netlify Drop (La más rápida - En 30 segundos sin configurar nada)
1. Entra a [app.netlify.com/drop](https://app.netlify.com/drop).
2. Arrastra la carpeta completa `flores amarillas test` hacia el recuadro que dice *"Drag and drop your site folder here"*.
3. En 5 segundos se publicará y te dará un enlace para enviárselo por WhatsApp.

### Opción 2: GitHub Pages
1. Crea un nuevo repositorio en [github.com](https://github.com) llamado `flores-amarillas` (Público).
2. Sube los archivos (`index.html`, `style.css`, `script.js`, `sunflower-pvz.gif`, `audio/`).
3. En **Settings > Pages**, elige la rama `main` y guarda.
4. ¡Te dará tu enlace web gratuito en 1 minuto!
