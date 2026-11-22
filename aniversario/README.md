# Heydi & Italo • Bodas de Papel • Three Cheers for 365 Days 🖤🌹⚡

Página interactiva de 1er Aniversario de Matrimonio (**Bodas de Papel**) para **Italo** de parte de su esposa **Heydi**.
Inspirada en el álbum ***Three Cheers for Sweet Revenge*** de **My Chemical Romance**, la cultura **Punk / Manchester de La Oroya**, la canción ***By Your Side* de Motorama** (iniciando directamente en la parte cantada: 13s), y una dinámica interactiva de recolección para conmemorar **365 días de matrimonio** (desde el **22 de noviembre de 2025**).

---

## 📂 Estructura de Archivos

```
aniversario/
├── index.html              # Estructura semántica (Intro, Escenario y Modal Demolition Lovers)
├── style.css               # Estilos MCR (Rojo carmesí, carbón, tipografía gótica y vinilo)
├── script.js               # Mecánica interactiva, Web Audio API y contador 0 a 365 días
├── README.md               # Esta guía
├── audio/
│   └── by-your-side.mp3    # Canción de Motorama integrada (Dialogues, 2016)
└── img/
    ├── mcr-cover.jpg       # Portada Three Cheers for Sweet Revenge
    ├── mcr-live.jpg        # Foto conceptual Demolition Lovers
    ├── foto-boda.jpg       # Foto oficial de la boda (22.11.2025 en La Oroya)
    ├── foto-compromiso.jpg # Foto del compromiso con el anillo
    ├── foto-oroya-mirador.jpg # Mirador de La Oroya
    ├── foto-oroya-chimenea.jpg# Vista emblemática de la chimenea
    └── foto-punk.jpg       # Foto rockera de Heydi & Italo con casacas de cuero
```

---

## 🎮 Mecánica Interactiva: The 365 Days Collection

1. **Pantalla 1 (The Revenge Gate):**
   - Presentación estilo portada de MCR con la fecha de matrimonio (22 de noviembre de 2025).
   - Al pulsar *"Entrar a Nuestro Aniversario"*, arranca la música de **Motorama** y se abre el escenario.
2. **Pantalla 2 (The 365 Days Stage):**
   - **Púas de Guitarra Punk 🎸:** Otorgan **+15 Días**.
   - **Rosas Rojas Carmesí 🌹:** Otorgan **+25 Días**.
   - **Cassettes de Motorama 📼:** Otorgan **+50 Días**.
   - **Tocadiscos Central:** Al hacer clic en el disco con la foto de Heydi & Italo, suena un acorde de bajo/guitarra distorsionada, rota frases de amor y expulsa púas.
3. **Recompensa a los 365 Días:**
   - La pantalla permanece limpia y sin estorbos durante la lectura de la carta.
   - Al llegar a los **365 días**: se dispara un solo de guitarra de victoria, se inicia la **lluvia continua de pétalos carmesí** y se abre el baúl secreto con la carta y la galería VIP.

---

## 🚀 ¿Cómo Probar la Página Localmente?

Puedes abrir directamente el archivo `index.html` en cualquier navegador moderno:
```powershell
# En Windows:
Start-Process "aniversario\index.html"
```
O levantando un servidor web local con Node:
```powershell
npx serve aniversario
```

---

## 🌐 ¿Cómo Publicar la Página en Internet?

1. **Netlify Drop (1 minuto, sin código):**
   - Entra a [app.netlify.com/drop](https://app.netlify.com/drop).
   - Arrastra la carpeta `aniversario` completa.
   - ¡Listo! Te dará un enlace público para enviárselo a Italo.
2. **GitHub Pages:**
   - Sube la carpeta a un repositorio de GitHub y activa GitHub Pages en *Settings > Pages*.
