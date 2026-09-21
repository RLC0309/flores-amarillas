/**
 * FLORES AMARILLAS - EDICIÓN ESPECIAL PLANTS VS ZOMBIES 🌻💛
 * Lógica de Animaciones, Canvas de Pétalos, Soles Interactivos y Música
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elementos del DOM
  const introScreen = document.getElementById('intro-screen');
  const gardenScreen = document.getElementById('garden-screen');
  const btnStart = document.getElementById('btn-start');
  const bgMusic = document.getElementById('bg-music');
  const musicBtn = document.getElementById('music-btn');
  const musicIcon = document.getElementById('music-icon');
  const sunScoreEl = document.getElementById('sun-score');
  const sunflowerStage = document.getElementById('sunflower-stage');
  const sunflowerChar = document.getElementById('sunflower-character');
  const speechBubble = document.getElementById('speech-bubble');
  const spawnSunBtn = document.getElementById('spawn-sun-btn');
  const btnFlowerRain = document.getElementById('btn-flower-rain');
  const btnSecretLetter = document.getElementById('btn-secret-letter');
  const secretLockIcon = document.getElementById('secret-lock-icon');
  const secretBtnText = document.getElementById('secret-btn-text');
  const secretCostBadge = document.getElementById('secret-cost-badge');
  const sunProgressBar = document.getElementById('sun-progress-bar');
  const unlockedBanner = document.getElementById('unlocked-banner');
  const secretModal = document.getElementById('secret-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalLoveBtn = document.getElementById('modal-love-btn');
  const bloomingLoader = document.getElementById('blooming-loader');
  const mainContentWrapper = document.getElementById('main-content-wrapper');
  const canvas = document.getElementById('particle-canvas');
  const ctx = canvas.getContext('2d');

  // Estado del juego / regalo
  let sunScore = 50;
  const UNLOCK_GOAL = 500;
  let isSecretUnlocked = false;
  let isMusicPlaying = false;
  let audioContext = null;

  /* =========================================================================
     [PERSONALIZACIÓN]: AQUÍ PUEDES CAMBIAR LAS FRASES DEL GIRASOL
     Cada vez que toques al girasol o pidas sol, dirá una de estas frases:
     ========================================================================= */
  const sunflowerPhrases = [
    "¡Feliz día, mi hermosa Azuleta! 🌻💛",
    "¡Eres el sol de Miau! ☀️🐱",
    "¡Te amo con todo mi ser, Azuletaaa! 💛",
    "\"No dejaré que seas fría, yo podría calentarte...\" 🎶💛",
    "¡MIAU siempre protegerá tu jardín! 🧟‍♂️🌱",
    "¡Tu sonrisa ilumina mi mundo! ✨",
    "¡Juntos por siempre, mi amor! 💖",
    "¡Flores amarillas hoy y siempre para ti! 🌼"
  ];
  let phraseIndex = 0;

  // =========================================================================
  // SISTEMA DE SONIDOS SINTETIZADOS (Web Audio API)
  // =========================================================================
  function initAudioContext() {
    if (!audioContext) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        audioContext = new AudioCtx();
      }
    }
  }

  // Sonido de fanfarria triunfal al alcanzar 500 soles
  function playUnlockFanfareSound() {
    try {
      initAudioContext();
      if (!audioContext) return;
      if (audioContext.state === 'suspended') audioContext.resume();

      const now = audioContext.currentTime;
      const fanfare = [
        { freq: 523.25, time: 0, dur: 0.18 },    // C5
        { freq: 659.25, time: 0.16, dur: 0.18 },  // E5
        { freq: 783.99, time: 0.32, dur: 0.22 },  // G5
        { freq: 1046.50, time: 0.52, dur: 0.9 }   // C6
      ];

      fanfare.forEach(note => {
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(note.freq, now + note.time);

        gain.gain.setValueAtTime(0.28, now + note.time);
        gain.gain.exponentialRampToValueAtTime(0.001, now + note.time + note.dur);

        osc.connect(gain);
        gain.connect(audioContext.destination);

        osc.start(now + note.time);
        osc.stop(now + note.time + note.dur + 0.05);
      });
    } catch (e) {
      console.warn("Fanfare sound error:", e);
    }
  }

  // Sonido de recolección de Sol al estilo PvZ (campanita mágica y alegre)
  function playSunCollectSound() {
    try {
      initAudioContext();
      if (!audioContext) return;
      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }

      const now = audioContext.currentTime;
      
      // Dos notas brillantes y alegres
      const notes = [659.25, 880.00]; // E5, A5
      notes.forEach((freq, idx) => {
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0.18, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.35);

        osc.connect(gain);
        gain.connect(audioContext.destination);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.38);
      });
    } catch (e) {
      console.warn("Audio context not allowed yet:", e);
    }
  }

  // =========================================================================
  // CONTROL DE MÚSICA (REPRODUCCIÓN INMEDIATA AL ENTRAR)
  // =========================================================================
  function startMusic() {
    bgMusic.volume = 0.65;
    const playPromise = bgMusic.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        isMusicPlaying = true;
        musicBtn.classList.add('playing');
        musicIcon.textContent = '🌻';
      }).catch(err => {
        console.log("Autoplay restringido por política del navegador. Esperando primera interacción:", err);
        isMusicPlaying = false;
        musicBtn.classList.remove('playing');
        musicIcon.textContent = '🎵';

        // Al primer toque, clic o interacción en cualquier parte de la pantalla, suena inmediatamente
        const startOnFirstGesture = () => {
          if (!isMusicPlaying && bgMusic.paused) {
            bgMusic.play().then(() => {
              isMusicPlaying = true;
              musicBtn.classList.add('playing');
              musicIcon.textContent = '🌻';
            }).catch(e => console.log(e));
          }
          window.removeEventListener('pointerdown', startOnFirstGesture, true);
          window.removeEventListener('touchstart', startOnFirstGesture, true);
          window.removeEventListener('click', startOnFirstGesture, true);
        };

        window.addEventListener('pointerdown', startOnFirstGesture, { capture: true, once: true });
        window.addEventListener('touchstart', startOnFirstGesture, { capture: true, once: true });
        window.addEventListener('click', startOnFirstGesture, { capture: true, once: true });
      });
    }
  }

  // Intentar reproducir apenas cargue la página
  startMusic();

  function toggleMusic() {
    if (bgMusic.paused) {
      bgMusic.play().then(() => {
        isMusicPlaying = true;
        musicBtn.classList.add('playing');
        musicIcon.textContent = '🌻';
      });
    } else {
      bgMusic.pause();
      isMusicPlaying = false;
      musicBtn.classList.remove('playing');
      musicIcon.textContent = '🎵';
    }
  }

  musicBtn.addEventListener('click', toggleMusic);

  // =========================================================================
  // TRANSICIÓN DE PANTALLAS (5 SEGUNDOS DE LLUVIA MÁGICA DE PÉTALOS Y FLORECIMIENTO)
  // =========================================================================
  btnStart.addEventListener('click', () => {
    // Iniciar música tras interacción directa del usuario si aún no sonaba
    startMusic();
    initAudioContext();

    // 1. Desvanecer la pantalla de bienvenida
    introScreen.style.opacity = '0';
    setTimeout(() => {
      introScreen.classList.remove('active');
      gardenScreen.classList.add('active');
      setTimeout(() => {
        gardenScreen.style.opacity = '1';
      }, 50);

      // 2. Durante 5 segundos: lluvia mágica de pétalos y hojas cayendo
      // Ola 1 (Inmediata)
      burstPetals(window.innerWidth / 2, window.innerHeight * 0.3, 35);
      
      // Ola 2 (a los 1.3s)
      setTimeout(() => {
        burstPetals(window.innerWidth * 0.25, window.innerHeight * 0.2, 30);
        burstPetals(window.innerWidth * 0.75, window.innerHeight * 0.2, 30);
      }, 1300);

      // Ola 3 (a los 2.6s)
      setTimeout(() => {
        burstPetals(window.innerWidth / 2, window.innerHeight * 0.25, 40);
        spawnFloatingSun(window.innerWidth * 0.3, window.innerHeight * 0.35);
      }, 2600);

      // Ola 4 (a los 3.8s)
      setTimeout(() => {
        burstPetals(window.innerWidth * 0.2, window.innerHeight * 0.3, 25);
        burstPetals(window.innerWidth * 0.8, window.innerHeight * 0.3, 25);
        spawnFloatingMiniSunflower(window.innerWidth * 0.5, window.innerHeight * 0.25);
      }, 3800);

      // 3. A los 5 segundos exactos: revelar el girasol y la carta con animación mágica
      setTimeout(() => {
        if (bloomingLoader) {
          bloomingLoader.classList.add('fade-out');
        }

        setTimeout(() => {
          if (bloomingLoader) {
            bloomingLoader.style.display = 'none';
          }

          // Revelar el escenario del girasol y la carta de amor
          if (mainContentWrapper) {
            mainContentWrapper.classList.remove('waiting-bloom');
            mainContentWrapper.classList.add('revealed');
          }

          // Disparar animación de florecimiento del girasol
          sunflowerChar.classList.remove('blooming');
          void sunflowerChar.offsetWidth; // forzar reflujo
          sunflowerChar.classList.add('blooming');

          // Sonido de bienvenida y explosión final de pétalos y soles
          playSunCollectSound();
          burstPetals(window.innerWidth / 2, window.innerHeight * 0.4, 45);
          spawnFloatingSun(window.innerWidth * 0.28, window.innerHeight * 0.38);
          spawnFloatingSun(window.innerWidth * 0.72, window.innerHeight * 0.38);
          spawnFloatingMiniSunflower(window.innerWidth * 0.2, window.innerHeight * 0.3);
          spawnFloatingMiniSunflower(window.innerWidth * 0.8, window.innerHeight * 0.3);
        }, 500);

      }, 5000); // 5 segundos de espera para que se disfrute la lluvia de hojas/pétalos

    }, 700);
  });

  // =========================================================================
  // CANVAS DE PARTÍCULAS: PÉTALOS AMARILLOS Y HOJITAS DE JARDÍN
  // =========================================================================
  let width, height;
  let particles = [];
  let continuousLeavesActive = false; // Se activará únicamente al completar los 500 girasoles

  function resizeCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  class PetalParticle {
    constructor(x, y, isBurst = false) {
      this.x = x !== undefined ? x : Math.random() * width;
      this.y = y !== undefined ? y : (isBurst ? y : -20);
      this.size = Math.random() * 12 + 8;
      this.speedY = isBurst ? (Math.random() - 0.5) * 8 : Math.random() * 1.5 + 1.2;
      this.speedX = isBurst ? (Math.random() - 0.5) * 8 : Math.random() * 1.5 - 0.75;
      this.angle = Math.random() * Math.PI * 2;
      this.angularSpeed = (Math.random() - 0.5) * 0.05;
      this.opacity = Math.random() * 0.5 + 0.5;
      // Paleta combinada de pétalos amarillos y hojitas de jardín
      const leafPalette = ['#FFD200', '#FFCA28', '#FFEE58', '#9CCC65', '#8BC34A', '#AED581', '#C0CA33', '#FFA000'];
      this.color = leafPalette[Math.floor(Math.random() * leafPalette.length)];
      this.isBurst = isBurst;
      this.life = isBurst ? 100 : Infinity;
      this.dead = false;
    }

    update() {
      if (this.isBurst) {
        this.speedX *= 0.95;
        this.speedY += 0.1; // gravedad
        this.life--;
      } else {
        this.x += Math.sin(this.angle) * 1.2 + this.speedX;
        this.y += this.speedY;
      }

      this.angle += this.angularSpeed;

      // Reaparecer arriba si cae de la pantalla SOLO si continuousLeavesActive es true
      if (!this.isBurst) {
        if (this.y > height + 20) {
          if (continuousLeavesActive) {
            this.y = -20;
            this.x = Math.random() * width;
          } else {
            this.dead = true;
          }
        }
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);
      ctx.globalAlpha = this.opacity * (this.isBurst ? Math.max(0, this.life / 100) : 1);

      // Dibujar forma de pétalo / hoja
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.moveTo(0, -this.size);
      ctx.quadraticCurveTo(this.size * 0.6, 0, 0, this.size);
      ctx.quadraticCurveTo(-this.size * 0.6, 0, 0, -this.size);
      ctx.fill();

      // Brillo del pétalo / hoja
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.beginPath();
      ctx.ellipse(0, -this.size * 0.3, this.size * 0.15, this.size * 0.35, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }
  }

  // Activa la lluvia continua de hojas y pétalos al llegar a 500 soles (girasoles)
  function startContinuousLeavesRain() {
    continuousLeavesActive = true;
    for (let i = 0; i < 65; i++) {
      const p = new PetalParticle(Math.random() * width, Math.random() * -height);
      particles.push(p);
    }
  }

  function burstPetals(originX, originY, count = 25) {
    for (let i = 0; i < count; i++) {
      particles.push(new PetalParticle(originX, originY, true));
    }
  }

  function animateCanvas() {
    ctx.clearRect(0, 0, width, height);

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.update();
      p.draw();

      if ((p.isBurst && p.life <= 0) || p.dead) {
        particles.splice(i, 1);
      }
    }

    requestAnimationFrame(animateCanvas);
  }
  animateCanvas();

  // =========================================================================
  // SISTEMA DE SOLES DORADOS INTERACTIVOS (PvZ)
  // =========================================================================
  const sunSvgContent = `
    <svg viewBox="0 0 100 100" style="width:100%; height:100%; overflow:visible;">
      <defs>
        <radialGradient id="sunRayGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#FFEE58"/>
          <stop offset="70%" stop-color="#FDD835"/>
          <stop offset="100%" stop-color="#F57F17"/>
        </radialGradient>
      </defs>
      <!-- Rayos del Sol -->
      <g stroke="#F57F17" stroke-width="5" stroke-linecap="round">
        <line x1="50" y1="4" x2="50" y2="18"/>
        <line x1="50" y1="82" x2="50" y2="96"/>
        <line x1="4" y1="50" x2="18" y2="50"/>
        <line x1="82" y1="50" x2="96" y2="50"/>
        <line x1="17" y1="17" x2="27" y2="27"/>
        <line x1="73" y1="73" x2="83" y2="83"/>
        <line x1="17" y1="83" x2="27" y2="73"/>
        <line x1="73" y1="27" x2="83" y2="17"/>
      </g>
      <!-- Núcleo brillante -->
      <circle cx="50" cy="50" r="32" fill="url(#sunRayGrad)" stroke="#E65100" stroke-width="3"/>
      <!-- Ojos sonrientes -->
      <ellipse cx="41" cy="45" rx="4" ry="6" fill="#2E1B00"/>
      <ellipse cx="59" cy="45" rx="4" ry="6" fill="#2E1B00"/>
      <circle cx="39.5" cy="43" r="1.5" fill="#FFF"/>
      <circle cx="57.5" cy="43" r="1.5" fill="#FFF"/>
      <!-- Sonrisa -->
      <path d="M 43 56 Q 50 64 57 56" fill="none" stroke="#BF360C" stroke-width="3" stroke-linecap="round"/>
      <!-- Mejillas sonrojadas -->
      <circle cx="36" cy="53" r="3.5" fill="#FF7043" opacity="0.6"/>
      <circle cx="64" cy="53" r="3.5" fill="#FF7043" opacity="0.6"/>
    </svg>
  `;

  function spawnFloatingSun(customX, customY) {
    const sunEl = document.createElement('div');
    sunEl.className = 'floating-sun-item';
    sunEl.innerHTML = sunSvgContent;

    const startX = customX !== undefined ? customX : Math.random() * (window.innerWidth - 120) + 60;
    const startY = customY !== undefined ? customY : Math.random() * (window.innerHeight * 0.5) + 80;

    sunEl.style.left = `${startX}px`;
    sunEl.style.top = `${startY}px`;

    // Recoger el sol al hacer clic / tocar
    sunEl.addEventListener('click', (e) => {
      e.stopPropagation();
      collectSun(sunEl, startX, startY);
    });

    document.body.appendChild(sunEl);

    // Desaparece automáticamente después de 12 segundos si no se recoge
    setTimeout(() => {
      if (sunEl.parentElement) {
        sunEl.style.transition = 'opacity 0.8s, transform 0.8s';
        sunEl.style.opacity = '0';
        sunEl.style.transform = 'scale(0.3)';
        setTimeout(() => sunEl.remove(), 800);
      }
    }, 12000);
  }

  // =========================================================================
  // SISTEMA DE PUNTOS Y DESBLOQUEO DE 500 SOLES
  // =========================================================================
  function addSunScore(amount) {
    sunScore += amount;
    sunScoreEl.textContent = sunScore;

    // Actualizar la barra de progreso
    if (sunProgressBar) {
      const percent = Math.min(100, Math.round((sunScore / UNLOCK_GOAL) * 100));
      sunProgressBar.style.width = `${percent}%`;
    }

    if (!isSecretUnlocked) {
      if (secretCostBadge) {
        secretCostBadge.textContent = `${sunScore}/${UNLOCK_GOAL} ☀️`;
      }

      // ¡ALCANZÓ LA META DE 500 SOLES!
      if (sunScore >= UNLOCK_GOAL) {
        isSecretUnlocked = true;
        playUnlockFanfareSound();

        // Desbloquear botón con brillo y animación
        btnSecretLetter.classList.remove('locked');
        btnSecretLetter.classList.add('unlocked');
        if (secretLockIcon) secretLockIcon.textContent = '🔓';
        if (secretBtnText) secretBtnText.textContent = '¡Razones de amor!';
        if (secretCostBadge) secretCostBadge.textContent = '¡DESBLOQUEADO! ✨';

        // Iniciar la lluvia continua de hojas y pétalos como recompensa especial de los 500 girasoles
        startContinuousLeavesRain();

        // Celebración masiva de soles y pétalos
        burstPetals(window.innerWidth / 2, window.innerHeight / 2, 60);
        spawnFloatingSun(window.innerWidth * 0.25, window.innerHeight * 0.35);
        spawnFloatingSun(window.innerWidth * 0.75, window.innerHeight * 0.35);
        spawnFloatingMiniSunflower(window.innerWidth * 0.5, window.innerHeight * 0.3);

        showFeedbackText("🎉 ¡500 SOLES ALCANZADOS! Has desbloqueado el secreto 💛", window.innerWidth / 2, window.innerHeight / 2);

        // Abrir automáticamente el modal tras 1.4 segundos de celebración
        setTimeout(() => {
          secretModal.classList.add('active');
          burstPetals(window.innerWidth / 2, window.innerHeight * 0.3, 40);
        }, 1400);
      }
    }
  }

  // Inicializar estado de la barra en 50/500
  addSunScore(0);

  function collectSun(element, x, y) {
    playSunCollectSound();

    // Sumar 50 soles con control de desbloqueo
    addSunScore(50);

    // Mostrar feedback visual "+50 Amor 💛"
    showFeedbackText("+50 Amor 💛", x + 34, y);

    // Efecto de partículas de soles
    burstPetals(x + 34, y + 34, 15);

    // Animación hacia el marcador
    const badgeRect = document.getElementById('sun-counter-badge').getBoundingClientRect();
    element.style.transition = 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    element.style.left = `${badgeRect.left + 15}px`;
    element.style.top = `${badgeRect.top + 15}px`;
    element.style.transform = 'scale(0.3) rotate(360deg)';
    element.style.opacity = '0.5';

    setTimeout(() => {
      element.remove();
    }, 500);
  }

  function showFeedbackText(text, x, y) {
    const feedback = document.createElement('div');
    feedback.className = 'sun-collect-feedback';
    feedback.textContent = text;
    feedback.style.left = `${x}px`;
    feedback.style.top = `${y}px`;
    document.body.appendChild(feedback);

    setTimeout(() => {
      feedback.remove();
    }, 1200);
  }

  // =========================================================================
  // PEQUEÑOS GIRASOLES FLOTANTES (MINI GIFS)
  // =========================================================================
  function spawnFloatingMiniSunflower(customX, customY) {
    const mini = document.createElement('div');
    mini.className = 'floating-mini-sunflower';
    mini.innerHTML = `<img src="sunflower-pvz.gif" alt="Mini Girasol">`;

    const startX = customX !== undefined ? customX : Math.random() * (window.innerWidth - 80) + 40;
    const startY = customY !== undefined ? customY : Math.random() * (window.innerHeight * 0.4) + 100;

    mini.style.left = `${startX}px`;
    mini.style.top = `${startY}px`;

    // Tocar un mini girasol para obtener amor y chispas
    mini.addEventListener('click', (e) => {
      e.stopPropagation();
      playSunCollectSound();
      addSunScore(25);
      burstPetals(startX + 25, startY + 25, 14);
      showFeedbackText("¡Mini Sol para Azuleta! 🌻💛", startX + 25, startY);
      mini.style.transform = 'scale(1.4) rotate(25deg)';
      setTimeout(() => {
        mini.style.transform = 'scale(0) rotate(180deg)';
        mini.style.opacity = '0';
        setTimeout(() => mini.remove(), 350);
      }, 250);
    });

    document.body.appendChild(mini);

    // Desaparece suavemente después de 14 segundos si no se recoge
    setTimeout(() => {
      if (mini.parentElement) {
        mini.style.transition = 'opacity 1s, transform 1s';
        mini.style.opacity = '0';
        mini.style.transform = 'scale(0.3)';
        setTimeout(() => mini.remove(), 1000);
      }
    }, 14000);
  }

  // Generar soles periódicamente cada 7.5 segundos
  setInterval(() => {
    if (gardenScreen.classList.contains('active')) {
      spawnFloatingSun();
    }
  }, 7500);

  // Generar pequeños girasoles flotantes periódicamente cada 10 segundos
  setInterval(() => {
    if (gardenScreen.classList.contains('active')) {
      spawnFloatingMiniSunflower();
    }
  }, 10000);

  // Interacción con los mini girasoles acompañantes del jardín
  document.querySelectorAll('.mini-sunflower-item').forEach(mini => {
    mini.addEventListener('click', (e) => {
      e.stopPropagation();
      playSunCollectSound();
      addSunScore(25);
      const rect = mini.getBoundingClientRect();
      burstPetals(rect.left + 30, rect.top + 30, 15);
      showFeedbackText("+25 Amor 💛", rect.left + 30, rect.top);
      mini.style.transform = 'scale(1.3) translateY(-10px)';
      setTimeout(() => {
        mini.style.transform = '';
      }, 300);
    });
  });

  // =========================================================================
  // INTERACCIÓN CON EL GIRASOL PRINCIPAL
  // =========================================================================
  function interactWithSunflower() {
    // Cambiar frase del bocadillo
    phraseIndex = (phraseIndex + 1) % sunflowerPhrases.length;
    speechBubble.textContent = sunflowerPhrases[phraseIndex];
    speechBubble.style.animation = 'none';
    void speechBubble.offsetWidth; // reset anim
    speechBubble.style.animation = 'bubbleFloat 2.5s ease-in-out infinite';

    // Generar un sol desde el girasol
    const rect = sunflowerChar.getBoundingClientRect();
    const sunX = rect.left + rect.width / 2 - 34;
    const sunY = rect.top + 50;
    spawnFloatingSun(sunX + (Math.random() * 60 - 30), sunY);

    // Animación de rebote alegre en el girasol
    sunflowerChar.style.transform = 'scale(1.15) rotate(5deg)';
    setTimeout(() => {
      sunflowerChar.style.transform = '';
    }, 280);

    burstPetals(rect.left + rect.width / 2, rect.top + 100, 15);
  }

  sunflowerChar.addEventListener('click', interactWithSunflower);
  spawnSunBtn.addEventListener('click', interactWithSunflower);

  // =========================================================================
  // BOTONES DE ACCIÓN: LLUVIA DE FLORES Y MENSAJE SECRETO (BLOQUEADO/DESBLOQUEABLE)
  // =========================================================================
  btnFlowerRain.addEventListener('click', () => {
    // Lluvia masiva de pétalos, soles y pequeños girasoles
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        burstPetals(Math.random() * width, Math.random() * (height * 0.6), 25);
        spawnFloatingSun();
      }, i * 200);
    }
    // Lanzar pequeños girasoles flotantes adicionales
    spawnFloatingMiniSunflower(Math.random() * (width * 0.4) + 50, Math.random() * (height * 0.4) + 80);
    spawnFloatingMiniSunflower(Math.random() * (width * 0.4) + (width * 0.5), Math.random() * (height * 0.4) + 80);
  });

  // Botón de razones de amor con verificación de 500 soles
  btnSecretLetter.addEventListener('click', (e) => {
    if (!isSecretUnlocked) {
      const missing = UNLOCK_GOAL - sunScore;
      
      // Animación de sacudida indicando bloqueo
      btnSecretLetter.classList.remove('shaking');
      void btnSecretLetter.offsetWidth;
      btnSecretLetter.classList.add('shaking');

      // Mensaje flotante avisando cuántos soles faltan
      const clickX = e.clientX || window.innerWidth / 2;
      const clickY = (e.clientY || window.innerHeight / 2) - 40;
      showFeedbackText(`🔒 ¡Junta 500 soles! Faltan ${missing} ☀️ 💛`, clickX, clickY);
    } else {
      secretModal.classList.add('active');
    }
  });

  modalCloseBtn.addEventListener('click', () => {
    secretModal.classList.remove('active');
  });

  secretModal.addEventListener('click', (e) => {
    if (e.target === secretModal) {
      secretModal.classList.remove('active');
    }
  });

  modalLoveBtn.addEventListener('click', () => {
    secretModal.classList.remove('active');
    burstPetals(width / 2, height / 2, 40);
    showFeedbackText("¡Miau & Azuleta por siempre! 💛🌻", width / 2, height / 2);
  });

  // Clic en cualquier parte del jardín genera una mini chispa/pétalo
  document.addEventListener('click', (e) => {
    // Ignorar clics en botones o tarjetas
    if (e.target.closest('button') || e.target.closest('.love-card') || e.target.closest('.secret-modal-box')) {
      return;
    }
    burstPetals(e.clientX, e.clientY, 8);
  });
});
