/* ==========================================================================
   HEIDY & ITALO • THREE CHEERS FOR 365 DAYS OF SWEET LOVE
   Lógica Interactiva, Web Audio API, Canvas de Rosas y Mecánica de 365 Días
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Elementos DOM
  const introScreen = document.getElementById('intro-screen');
  const stageScreen = document.getElementById('stage-screen');
  const btnEnterUniverse = document.getElementById('btn-enter-universe');
  const stageLoader = document.getElementById('stage-loader');
  const mainStageContent = document.getElementById('main-stage-content');

  // Reproductor de Música (Motorama)
  const bgMusic = document.getElementById('bg-music');
  const musicVinylBtn = document.getElementById('music-vinyl-btn');
  const vinylDisc = document.getElementById('vinyl-disc');
  const musicStatusIcon = document.getElementById('music-status-icon');

  // Marcador y progreso
  const daysCountEl = document.getElementById('days-count');
  const daysProgressBar = document.getElementById('days-progress-bar');
  const badgeLockStatus = document.getElementById('badge-lock-status');
  const btnSecretVault = document.getElementById('btn-secret-vault');
  const vaultLockIcon = document.getElementById('vault-lock-icon');
  const vaultBtnText = document.getElementById('vault-btn-text');
  const vaultCostBadge = document.getElementById('vault-cost-badge');

  // Tocadiscos Central y Bocadillo
  const centralStageBox = document.getElementById('central-stage-box');
  const punkSpeechBubble = document.getElementById('punk-speech-bubble');
  const btnPunkRain = document.getElementById('btn-punk-rain');

  // Modal
  const vaultModal = document.getElementById('vault-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalLoveBtn = document.getElementById('modal-love-btn');

  // Canvas
  const canvas = document.getElementById('punk-canvas');
  const ctx = canvas.getContext('2d');

  // Estados
  let daysScore = 0;
  const GOAL_DAYS = 365;
  let isUnlocked = false;
  let isMusicPlaying = false;
  let continuousRainActive = false;

  // Frases rotativas para el tocadiscos (La Oroya: Synth Pop, New Wave, Post-Punk, Dark Wave e Indie)
  const rockPhrases = [
    "¡Felices Bodas de Papel, Italo! Toca aquí para soltar púas 🎸📜",
    "Synth pop, new wave y dark wave: ¡Nuestra banda sonora en La Oroya! 🎹🖤",
    "Post-punk, guitarras indie y un amor eterno juntos, Italo ⚡",
    "By your side: El único y verdadero tesoro somos nosotros y nuestro amor 🌹",
    "Desde La Oroya hasta la eternidad... ¡Te amo con toda mi alma, esposo! 🖤",
    "22.11.2025: El día que empezó nuestra mejor gira de casados 💍",
    "Casacas de cuero, canciones oscuras y nuestro amor indestructible ⚡",
    "Three Cheers for 365 Days of Sweet Love! 🌹🖤"
  ];
  let phraseIndex = 0;

  // =========================================================================
  // SISTEMA DE AUDIO SINTETIZADO (WEB AUDIO API - RIFFS Y EFECTOS PUNK)
  // =========================================================================
  let audioCtx = null;

  function initAudioContext() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  // Sonido de púa / cuerda de guitarra eléctrica distorsionada
  function playPickSound() {
    try {
      initAudioContext();
      if (!audioCtx) return;

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      const filter = audioCtx.createBiquadFilter();

      osc.type = 'sawtooth';
      // Frecuencias pentatónicas rockeras (A, C, D, E)
      const freqs = [220, 261.6, 293.6, 329.6, 440];
      const f = freqs[Math.floor(Math.random() * freqs.length)];
      osc.frequency.setValueAtTime(f, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(f * 0.75, audioCtx.currentTime + 0.18);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1800, audioCtx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(400, audioCtx.currentTime + 0.18);

      gain.gain.setValueAtTime(0.22, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.18);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.2);
    } catch (e) {
      console.log("Audio SFX:", e);
    }
  }

  // Fanfarria de Victoria: Power Chord de Aniversario (365 Días)
  function playAnniversaryFanfare() {
    try {
      initAudioContext();
      if (!audioCtx) return;

      const chordNotes = [220, 329.6, 440, 554.3, 659.2]; // La mayor rockero brillante
      chordNotes.forEach((freq, i) => {
        setTimeout(() => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

          gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.2);

          osc.connect(gain);
          gain.connect(audioCtx.destination);

          osc.start();
          osc.stop(audioCtx.currentTime + 1.25);
        }, i * 140);
      });
    } catch (e) {
      console.log("Fanfare SFX:", e);
    }
  }

  // =========================================================================
  // CONTROL DEL REPRODUCTOR (MOTORAMA - BY YOUR SIDE)
  // =========================================================================
  // Segundo 13.0: Momento exacto en que entra la voz cantando "Poverty is nothing for you..."
  const VOCAL_START_TIME = 13.0;

  function startMusic() {
    if (bgMusic) {
      // Iniciar directamente desde la parte cantada
      if (bgMusic.currentTime < VOCAL_START_TIME) {
        bgMusic.currentTime = VOCAL_START_TIME;
      }

      if (bgMusic.paused) {
        bgMusic.volume = 0.85;
        bgMusic.play().then(() => {
          isMusicPlaying = true;
          vinylDisc.classList.add('spinning');
          musicStatusIcon.textContent = '⚡';
        }).catch(err => {
          console.log("Autoplay bloqueado por el navegador. Esperando interacción:", err);
          isMusicPlaying = false;
          vinylDisc.classList.remove('spinning');
          musicStatusIcon.textContent = '🎵';

          const playOnGesture = () => {
            if (!isMusicPlaying && bgMusic.paused) {
              if (bgMusic.currentTime < VOCAL_START_TIME) {
                bgMusic.currentTime = VOCAL_START_TIME;
              }
              bgMusic.play().then(() => {
                isMusicPlaying = true;
                vinylDisc.classList.add('spinning');
                musicStatusIcon.textContent = '⚡';
              }).catch(e => console.log(e));
            }
            window.removeEventListener('pointerdown', playOnGesture, true);
            window.removeEventListener('touchstart', playOnGesture, true);
            window.removeEventListener('click', playOnGesture, true);
          };

          window.addEventListener('pointerdown', playOnGesture, { capture: true, once: true });
          window.addEventListener('touchstart', playOnGesture, { capture: true, once: true });
          window.addEventListener('click', playOnGesture, { capture: true, once: true });
        });
      }
    }
  }

  startMusic();

  function toggleMusic() {
    if (bgMusic.paused) {
      if (bgMusic.currentTime < VOCAL_START_TIME) {
        bgMusic.currentTime = VOCAL_START_TIME;
      }
      bgMusic.play().then(() => {
        isMusicPlaying = true;
        vinylDisc.classList.add('spinning');
        musicStatusIcon.textContent = '⚡';
      });
    } else {
      bgMusic.pause();
      isMusicPlaying = false;
      vinylDisc.classList.remove('spinning');
      musicStatusIcon.textContent = '🎵';
    }
  }

  musicVinylBtn.addEventListener('click', toggleMusic);

  // Al finalizar la pista, volver a la parte cantada en bucle continuo
  bgMusic.addEventListener('ended', () => {
    bgMusic.currentTime = VOCAL_START_TIME;
    bgMusic.play().catch(e => console.log(e));
  });

  // =========================================================================
  // TRANSICIÓN DE PANTALLA INTRO -> ESCENARIO
  // =========================================================================
  btnEnterUniverse.addEventListener('click', () => {
    startMusic();
    initAudioContext();
    playPickSound();

    // Ráfaga inicial de rosas y confeti
    burstParticles(window.innerWidth / 2, window.innerHeight * 0.4, 40, 'rose');

    introScreen.style.opacity = '0';
    setTimeout(() => {
      introScreen.classList.remove('active');
      stageScreen.classList.add('active');
      setTimeout(() => {
        stageScreen.style.opacity = '1';
      }, 50);

      // Loader con cinta de cassette por 2.2 segundos
      setTimeout(() => {
        if (stageLoader) {
          stageLoader.classList.add('fade-out');
        }

        setTimeout(() => {
          if (stageLoader) {
            stageLoader.style.display = 'none';
          }
          if (mainStageContent) {
            mainStageContent.classList.add('revealed');
          }

          // Ráfaga de apertura del escenario y primeros coleccionables
          burstParticles(window.innerWidth / 2, window.innerHeight * 0.35, 30, 'rose');
          spawnFloatingPick(window.innerWidth * 0.28, window.innerHeight * 0.35);
          spawnFloatingRose(window.innerWidth * 0.72, window.innerHeight * 0.35);
          spawnFloatingCassette(window.innerWidth * 0.5, window.innerHeight * 0.25);
        }, 400);

      }, 2200);

    }, 600);
  });

  // =========================================================================
  // CANVAS DE PARTÍCULAS: PÉTALOS DE ROSA ROJA Y CONFETI PUNK
  // =========================================================================
  let width, height;
  let particles = [];

  function resizeCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  class PunkParticle {
    constructor(x, y, isBurst = false, type = 'rose') {
      this.x = x !== undefined ? x : Math.random() * width;
      this.y = y !== undefined ? y : (isBurst ? y : -25);
      this.size = Math.random() * 14 + 8;
      this.speedY = isBurst ? (Math.random() - 0.5) * 8 : Math.random() * 1.6 + 1.2;
      this.speedX = isBurst ? (Math.random() - 0.5) * 8 : Math.random() * 1.6 - 0.8;
      this.angle = Math.random() * Math.PI * 2;
      this.angularSpeed = (Math.random() - 0.5) * 0.06;
      this.opacity = Math.random() * 0.4 + 0.6;
      this.type = type;

      // Paletas MCR / Punk: Carmesí, Rojo Sangre, Carbón y Tiza
      const rosePalette = ['#B71C1C', '#D32F2F', '#E53935', '#7F0000', '#FF1744', '#1A1A1A'];
      this.color = rosePalette[Math.floor(Math.random() * rosePalette.length)];
      this.isBurst = isBurst;
      this.life = isBurst ? 90 : Infinity;
      this.dead = false;
    }

    update() {
      if (this.isBurst) {
        this.speedX *= 0.96;
        this.speedY += 0.12; // gravedad
        this.life--;
      } else {
        this.x += Math.sin(this.angle) * 1.3 + this.speedX;
        this.y += this.speedY;
      }

      this.angle += this.angularSpeed;

      // Si es lluvia continua y sale de la pantalla, reaparecer arriba
      if (!this.isBurst) {
        if (this.y > height + 25) {
          if (continuousRainActive) {
            this.y = -25;
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
      ctx.globalAlpha = this.opacity * (this.isBurst ? Math.max(0, this.life / 90) : 1);

      // Dibujar forma de pétalo de rosa gótica
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.moveTo(0, -this.size);
      ctx.bezierCurveTo(this.size * 0.7, -this.size * 0.5, this.size * 0.6, this.size * 0.6, 0, this.size);
      ctx.bezierCurveTo(-this.size * 0.6, this.size * 0.6, -this.size * 0.7, -this.size * 0.5, 0, -this.size);
      ctx.fill();

      // Centro sombreado oscuro
      ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
      ctx.beginPath();
      ctx.arc(0, 0, this.size * 0.35, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }
  }

  // Iniciar lluvia continua de rosas carmesí al desbloquear los 365 días
  function startContinuousRoseRain() {
    continuousRainActive = true;
    for (let i = 0; i < 65; i++) {
      const p = new PunkParticle(Math.random() * width, Math.random() * -height, false, 'rose');
      particles.push(p);
    }
  }

  function burstParticles(originX, originY, count = 25, type = 'rose') {
    for (let i = 0; i < count; i++) {
      particles.push(new PunkParticle(originX, originY, true, type));
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
  // SISTEMA DE CONTADOR Y DESBLOQUEO DE 365 DÍAS
  // =========================================================================
  function addDays(amount) {
    daysScore = Math.min(GOAL_DAYS, daysScore + amount);
    daysCountEl.textContent = daysScore;

    // Actualizar barra de progreso
    const percent = Math.min(100, Math.round((daysScore / GOAL_DAYS) * 100));
    daysProgressBar.style.width = `${percent}%`;

    if (!isUnlocked) {
      if (vaultCostBadge) {
        vaultCostBadge.textContent = `${daysScore}/${GOAL_DAYS} Días 🎸`;
      }

      // ¡ALCANZÓ LOS 365 DÍAS DE ANIVERSARIO!
      if (daysScore >= GOAL_DAYS) {
        isUnlocked = true;
        badgeLockStatus.textContent = '🔓';
        playAnniversaryFanfare();

        // Desbloquear botón
        btnSecretVault.classList.remove('locked');
        btnSecretVault.classList.add('unlocked');
        if (vaultLockIcon) vaultLockIcon.textContent = '🔓';
        if (vaultBtnText) vaultBtnText.textContent = '¡BODAS DE PAPEL! ✨';
        if (vaultCostBadge) vaultCostBadge.textContent = '¡DESBLOQUEADO! 📜🌹';

        // Iniciar lluvia continua de rosas rojas como celebración definitiva
        startContinuousRoseRain();

        // Celebración masiva de partículas
        burstParticles(window.innerWidth / 2, window.innerHeight / 2, 70, 'rose');
        showFloatingFeedback("🎉 ¡365 DÍAS • BODAS DE PAPEL! Te amo Italo 🖤📜⚡", window.innerWidth / 2, window.innerHeight / 2);

        // Abrir el cofre secreto automáticamente tras 1.4 segundos
        setTimeout(() => {
          vaultModal.classList.add('active');
          burstParticles(window.innerWidth / 2, window.innerHeight * 0.3, 50, 'rose');
        }, 1400);
      }
    }
  }

  // Inicializar contador
  addDays(0);

  function showFloatingFeedback(text, x, y) {
    const feedback = document.createElement('div');
    feedback.className = 'rock-feedback-text';
    feedback.textContent = text;
    feedback.style.left = `${x}px`;
    feedback.style.top = `${y}px`;
    document.body.appendChild(feedback);

    setTimeout(() => {
      feedback.remove();
    }, 1300);
  }

  // =========================================================================
  // SPAWNER DE ELEMENTOS FLOTANTES INTERACTIVOS (PÚAS, ROSAS, CASSETTES)
  // =========================================================================

  // SVGs de los elementos rockeros
  const pickSvg = `
    <svg viewBox="0 0 100 100" class="pick-icon-svg">
      <defs>
        <linearGradient id="pickGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#E53935"/>
          <stop offset="50%" stop-color="#B71C1C"/>
          <stop offset="100%" stop-color="#4A0000"/>
        </linearGradient>
      </defs>
      <!-- Forma de Púa de Guitarra -->
      <path d="M 50 95 C 42 75 10 50 10 28 C 10 12 30 5 50 5 C 70 5 90 12 90 28 C 90 50 58 75 50 95 Z" 
            fill="url(#pickGrad)" stroke="#FFFFFF" stroke-width="3"/>
      <!-- Sello Punk -->
      <text x="50" y="38" font-family="'Oswald', sans-serif" font-weight="bold" font-size="14" fill="#FFFFFF" text-anchor="middle">H &amp; I</text>
      <text x="50" y="54" font-family="'Special Elite', cursive" font-size="11" fill="#FFCDD2" text-anchor="middle">OROYA</text>
      <circle cx="50" cy="70" r="4" fill="#FFFFFF"/>
    </svg>
  `;

  const roseSvg = `
    <svg viewBox="0 0 100 100" class="rose-item-svg">
      <defs>
        <radialGradient id="roseGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#FF1744"/>
          <stop offset="60%" stop-color="#B71C1C"/>
          <stop offset="100%" stop-color="#4A0000"/>
        </radialGradient>
      </defs>
      <!-- Espina y tallo -->
      <path d="M 50 65 Q 48 85 52 98" stroke="#2E7D32" stroke-width="4" fill="none" stroke-linecap="round"/>
      <path d="M 50 78 Q 40 76 38 82" stroke="#2E7D32" stroke-width="3" fill="none"/>
      <!-- Pétalos de Rosa Gótica -->
      <circle cx="50" cy="45" r="28" fill="url(#roseGrad)" stroke="#FFF" stroke-width="2"/>
      <path d="M 35 45 C 35 30 65 30 65 45 C 65 60 35 60 35 45" fill="#880E4F" opacity="0.6"/>
      <path d="M 42 42 C 42 34 58 34 58 42 C 58 50 42 50 42 42" fill="#D32F2F"/>
      <circle cx="50" cy="42" r="5" fill="#FFCDD2"/>
    </svg>
  `;

  const cassetteSvg = `
    <svg viewBox="0 0 120 80" class="cassette-item-svg">
      <rect x="5" y="5" width="110" height="70" rx="8" fill="#1A1A1A" stroke="#E53935" stroke-width="3"/>
      <!-- Etiqueta del cassette -->
      <rect x="18" y="14" width="84" height="42" rx="4" fill="#F5F5F0" stroke="#B71C1C" stroke-width="1.5"/>
      <text x="60" y="27" font-family="'Oswald', sans-serif" font-size="9" font-weight="bold" fill="#B71C1C" text-anchor="middle">MOTORAMA</text>
      <!-- Ruedas de cinta -->
      <rect x="25" y="32" width="70" height="18" rx="9" fill="#111"/>
      <circle cx="42" cy="41" r="6" fill="#FFF"/>
      <circle cx="78" cy="41" r="6" fill="#FFF"/>
    </svg>
  `;

  function createFloatingItem(contentHtml, points, feedbackLabel, customX, customY) {
    const item = document.createElement('div');
    item.className = 'floating-rock-item';
    item.innerHTML = contentHtml;

    const startX = customX !== undefined ? customX : Math.random() * (window.innerWidth - 120) + 60;
    const startY = customY !== undefined ? customY : Math.random() * (window.innerHeight * 0.5) + 90;

    item.style.left = `${startX}px`;
    item.style.top = `${startY}px`;

    item.addEventListener('click', (e) => {
      e.stopPropagation();
      playPickSound();
      addDays(points);
      burstParticles(startX + 28, startY + 28, 16, 'rose');
      showFloatingFeedback(feedbackLabel, startX + 28, startY);

      // Animación de recogida hacia el marcador superior
      const badgeRect = document.getElementById('days-counter-badge').getBoundingClientRect();
      item.style.transition = 'all 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      item.style.left = `${badgeRect.left + 20}px`;
      item.style.top = `${badgeRect.top + 10}px`;
      item.style.transform = 'scale(0.2) rotate(360deg)';
      item.style.opacity = '0.3';

      setTimeout(() => item.remove(), 450);
    });

    document.body.appendChild(item);

    // Desaparece a los 13 segundos si no se recoge
    setTimeout(() => {
      if (item.parentElement) {
        item.style.transition = 'opacity 0.8s, transform 0.8s';
        item.style.opacity = '0';
        item.style.transform = 'scale(0.3)';
        setTimeout(() => item.remove(), 800);
      }
    }, 13000);
  }

  function spawnFloatingPick(x, y) {
    createFloatingItem(pickSvg, 15, "+15 Días 🎸", x, y);
  }

  function spawnFloatingRose(x, y) {
    createFloatingItem(roseSvg, 25, "+25 Días 🌹", x, y);
  }

  function spawnFloatingCassette(x, y) {
    createFloatingItem(cassetteSvg, 50, "+50 Días 📼 Motorama", x, y);
  }

  // Generador periódico de elementos en el escenario
  setInterval(() => {
    if (stageScreen.classList.contains('active')) {
      const rand = Math.random();
      if (rand < 0.5) {
        spawnFloatingPick();
      } else if (rand < 0.8) {
        spawnFloatingRose();
      } else {
        spawnFloatingCassette();
      }
    }
  }, 6500);

  // =========================================================================
  // INTERACCIÓN CON EL TOCADISCOS CENTRAL
  // =========================================================================
  centralStageBox.addEventListener('click', (e) => {
    playPickSound();

    // Rotar frase del bocadillo
    phraseIndex = (phraseIndex + 1) % rockPhrases.length;
    punkSpeechBubble.textContent = rockPhrases[phraseIndex];
    punkSpeechBubble.style.animation = 'none';
    void punkSpeechBubble.offsetWidth;
    punkSpeechBubble.style.animation = 'floatBubble 3s ease-in-out infinite';

    // Generar púa flotante y partículas
    const rect = centralStageBox.getBoundingClientRect();
    const spawnX = rect.left + rect.width / 2 + (Math.random() * 80 - 40);
    const spawnY = rect.top + 20;
    
    if (Math.random() > 0.4) {
      spawnFloatingPick(spawnX, spawnY);
    } else {
      spawnFloatingRose(spawnX, spawnY);
    }

    addDays(10);
    showFloatingFeedback("+10 Días de Amor ⚡", rect.left + rect.width / 2, rect.top + 40);
    burstParticles(rect.left + rect.width / 2, rect.top + rect.height / 2, 20, 'rose');
  });

  // Botón "Lluvia de Rosas y Púas"
  btnPunkRain.addEventListener('click', () => {
    playPickSound();
    for (let i = 0; i < 4; i++) {
      setTimeout(() => {
        burstParticles(Math.random() * width, Math.random() * (height * 0.6), 25, 'rose');
        if (i % 2 === 0) spawnFloatingPick();
        else spawnFloatingRose();
      }, i * 220);
    }
    spawnFloatingCassette();
  });

  // Botón de Cofre / 365 Días
  btnSecretVault.addEventListener('click', (e) => {
    if (!isUnlocked) {
      const missing = GOAL_DAYS - daysScore;
      btnSecretVault.classList.remove('shaking');
      void btnSecretVault.offsetWidth;
      btnSecretVault.classList.add('shaking');

      const clickX = e.clientX || window.innerWidth / 2;
      const clickY = (e.clientY || window.innerHeight / 2) - 40;
      showFloatingFeedback(`🔒 ¡Atrapa púas y rosas! Faltan ${missing} días 🎸`, clickX, clickY);
    } else {
      vaultModal.classList.add('active');
    }
  });

  // Controles del Modal
  modalCloseBtn.addEventListener('click', () => {
    vaultModal.classList.remove('active');
  });

  vaultModal.addEventListener('click', (e) => {
    if (e.target === vaultModal) {
      vaultModal.classList.remove('active');
    }
  });

  modalLoveBtn.addEventListener('click', () => {
    vaultModal.classList.remove('active');
    burstParticles(width / 2, height / 2, 60, 'rose');
    showFloatingFeedback("¡Heidy & Italo por siempre! 🖤🌹⚡", width / 2, height / 2);
  });

  // Clic libre en el fondo genera sutil chispa de rosa
  document.addEventListener('click', (e) => {
    if (e.target.closest('button') || e.target.closest('.punk-letter-card') || e.target.closest('.modal-box-punk') || e.target.closest('.floating-rock-item')) {
      return;
    }
    burstParticles(e.clientX, e.clientY, 8, 'rose');
  });
});
