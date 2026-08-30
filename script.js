/* ==========================================================
   BIRTHDAY WISH INTERACTIVE ENGINE FOR ZARA & FAIZAN
   ========================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const welcomeModal = document.getElementById('welcome-modal');
  const startJourneyBtn = document.getElementById('start-journey-btn');
  const blackoutScreen = document.getElementById('blackout-screen');
  const bgAudio = document.getElementById('bg-audio');
  const musicController = document.getElementById('music-controller');
  const songStatus = document.getElementById('song-status');

  // Auto Timer Elements
  const autoProgressBar = document.getElementById('auto-progress-bar');
  const timerCounter = document.getElementById('timer-counter');
  const pauseTimerBtn = document.getElementById('pause-timer-btn');

  // Scene Elements
  const scene1 = document.getElementById('scene-1');
  const scene2 = document.getElementById('scene-2');
  const scene3 = document.getElementById('scene-3');
  const gotoScene2Btn = document.getElementById('goto-scene-2-btn');
  const backtoScene1Btn = document.getElementById('backto-scene-1-btn');
  const gotoScene3Btn = document.getElementById('goto-scene-3-btn');
  const backtoScene2Btn = document.getElementById('backto-scene-2-btn');
  const celebrateAgainBtn = document.getElementById('celebrate-again-btn');
  const restartJourneyBtn = document.getElementById('restart-journey-btn');

  // Gallery & Batch Image Loader
  const petalsContainer = document.getElementById('petals-container');
  const batchImageInput = document.getElementById('batch-image-input');
  const imgSlots = [
    document.getElementById('img-slot-1'),
    document.getElementById('img-slot-2'),
    document.getElementById('img-slot-3'),
    document.getElementById('img-slot-4')
  ];

  // Candle & Capsules
  const candle = document.getElementById('candle');
  const wishStatusBadge = document.getElementById('wish-status-badge');
  const capsuleCards = document.querySelectorAll('.capsule-card');

  // Fallback portraits if files are missing
  const fallbackPlaceholders = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80'
  ];

  // Smart multi-extension image loader (finds .jpeg, .jpg, .png, .webp automatically)
  function tryLoadImage(slot, index) {
    if (!slot) return;
    const extensions = ['.jpeg', '.jpg', '.png', '.webp', '.JPG', '.JPEG', '.PNG'];
    let extIndex = 0;

    function tryNext() {
      if (extIndex < extensions.length) {
        const nextSrc = `images/photo${index + 1}${extensions[extIndex]}`;
        extIndex++;
        const testImg = new Image();
        testImg.onload = () => {
          slot.src = nextSrc;
        };
        testImg.onerror = tryNext;
        testImg.src = nextSrc;
      } else {
        slot.src = fallbackPlaceholders[index % fallbackPlaceholders.length];
      }
    }

    const saved = localStorage.getItem(`zara_bday_photo_${index + 1}`);
    if (saved && saved.startsWith('data:image')) {
      slot.src = saved;
    } else {
      tryNext();
    }
  }

  imgSlots.forEach((slot, index) => {
    tryLoadImage(slot, index);
  });

  // ==========================================================
  // 1. AMBIENT CANVAS (HEARTS, SHOOTING STARS & GLOWING MIST)
  // ==========================================================
  const canvas = document.getElementById('ambient-canvas');
  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  class FloatingHeart {
    constructor() {
      this.reset(true);
    }
    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : height + 30;
      this.size = Math.random() * 16 + 8;
      this.speedY = Math.random() * 0.7 + 0.3;
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.opacity = Math.random() * 0.2 + 0.06; // soft and faded
      this.color = Math.random() > 0.4 ? '#e91e63' : '#ff80ab';
      this.angle = Math.random() * Math.PI * 2;
      this.angularSpeed = (Math.random() - 0.5) * 0.015;
    }
    update() {
      this.y -= this.speedY;
      this.x += Math.sin(this.angle) * 0.5 + this.speedX;
      this.angle += this.angularSpeed;
      if (this.y < -40 || this.x < -40 || this.x > width + 40) {
        this.reset();
      }
    }
    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle * 0.2);
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = this.color;
      const s = this.size;
      ctx.beginPath();
      const topCurveHeight = s * 0.3;
      ctx.moveTo(0, topCurveHeight);
      ctx.bezierCurveTo(0, 0, -s / 2, 0, -s / 2, topCurveHeight);
      ctx.bezierCurveTo(-s / 2, (s + topCurveHeight) / 2, 0, s, 0, s * 1.3);
      ctx.bezierCurveTo(0, s, s / 2, (s + topCurveHeight) / 2, s / 2, topCurveHeight);
      ctx.bezierCurveTo(s / 2, 0, 0, 0, 0, topCurveHeight);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
  }

  // Shooting Stars for emotional nostalgia
  class ShootingStar {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * (height * 0.4);
      this.length = Math.random() * 80 + 40;
      this.speed = Math.random() * 8 + 6;
      this.opacity = 0;
      this.active = false;
      this.angle = Math.PI / 4 + (Math.random() - 0.5) * 0.2;
    }
    trigger() {
      this.reset();
      this.active = true;
      this.opacity = 1;
    }
    update() {
      if (!this.active) return;
      this.x += Math.cos(this.angle) * this.speed;
      this.y += Math.sin(this.angle) * this.speed;
      this.opacity -= 0.015;
      if (this.opacity <= 0 || this.x > width || this.y > height) {
        this.active = false;
      }
    }
    draw() {
      if (!this.active) return;
      ctx.save();
      ctx.globalAlpha = this.opacity;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(
        this.x - Math.cos(this.angle) * this.length,
        this.y - Math.sin(this.angle) * this.length
      );
      ctx.stroke();
      ctx.restore();
    }
  }

  // Glowing Ambient Sparkles
  class AmbientSparkle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 2.5 + 1;
      this.opacity = Math.random() * 0.5 + 0.1;
      this.pulseSpeed = Math.random() * 0.02 + 0.008;
      this.pulseDir = 1;
    }
    update() {
      this.opacity += this.pulseSpeed * this.pulseDir;
      if (this.opacity >= 0.6) this.pulseDir = -1;
      if (this.opacity <= 0.1) this.pulseDir = 1;
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = '#ff99bb';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  const hearts = Array.from({ length: 30 }, () => new FloatingHeart());
  const sparkles = Array.from({ length: 40 }, () => new AmbientSparkle());
  const shootingStars = Array.from({ length: 3 }, () => new ShootingStar());

  // Periodically launch shooting stars
  setInterval(() => {
    const idleStar = shootingStars.find((s) => !s.active);
    if (idleStar) idleStar.trigger();
  }, 3500);

  function animateCanvas() {
    ctx.clearRect(0, 0, width, height);
    sparkles.forEach((s) => {
      s.update();
      s.draw();
    });
    hearts.forEach((h) => {
      h.update();
      h.draw();
    });
    shootingStars.forEach((star) => {
      star.update();
      star.draw();
    });
    requestAnimationFrame(animateCanvas);
  }
  animateCanvas();

  // ==========================================================
  // 2. AUDIO SYNTHESIZER & AUDIO MANAGER
  // ==========================================================
  let isMusicPlaying = false;
  let synthInterval = null;
  let audioCtx = null;

  function playSynthMelody() {
    if (audioCtx) return;
    try {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const notes = [
        261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 523.25, 587.33, 659.25
      ];
      const melody = [0, 2, 4, 6, 4, 2, 1, 3, 5, 7, 5, 3, 0, 4, 6, 8, 6, 4];
      let step = 0;

      synthInterval = setInterval(() => {
        if (!isMusicPlaying || !audioCtx) return;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(notes[melody[step % melody.length]], audioCtx.currentTime);

        gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1.2);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start();
        osc.stop(audioCtx.currentTime + 1.2);
        step++;
      }, 420);
    } catch (e) {
      console.log('Synth unsupported');
    }
  }

  function startMusic() {
    bgAudio.volume = 0.5;
    bgAudio.play()
      .then(() => {
        isMusicPlaying = true;
        musicController.classList.remove('paused');
        songStatus.textContent = 'Playing';
      })
      .catch(() => {
        isMusicPlaying = true;
        musicController.classList.remove('paused');
        songStatus.textContent = 'Melody Playing';
        playSynthMelody();
      });
  }

  function toggleMusic() {
    if (isMusicPlaying) {
      bgAudio.pause();
      if (audioCtx && audioCtx.state === 'running') audioCtx.suspend();
      isMusicPlaying = false;
      musicController.classList.add('paused');
      songStatus.textContent = 'Paused';
    } else {
      bgAudio.play().catch(() => {});
      if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
      } else if (!bgAudio.duration) {
        playSynthMelody();
      }
      isMusicPlaying = true;
      musicController.classList.remove('paused');
      songStatus.textContent = 'Playing';
    }
  }

  musicController.addEventListener('click', toggleMusic);

  // ==========================================================
  // 3. AUTO-PROGRESSION TIMER (20s on Scene 1 -> 2s Blackout -> Scene 2)
  // ==========================================================
  let autoTimerInterval = null;
  let remainingSeconds = 20;
  let isTimerPaused = false;

  function startAutoProgressTimer() {
    remainingSeconds = 20;
    timerCounter.textContent = remainingSeconds.toString();
    autoProgressBar.classList.remove('running');
    void autoProgressBar.offsetWidth; // trigger reflow
    autoProgressBar.classList.add('running');

    clearInterval(autoTimerInterval);
    autoTimerInterval = setInterval(() => {
      if (isTimerPaused) return;
      remainingSeconds--;
      if (remainingSeconds >= 0) {
        timerCounter.textContent = remainingSeconds.toString();
      }

      if (remainingSeconds <= 0) {
        clearInterval(autoTimerInterval);
        triggerBlackoutTransitionToScene2();
      }
    }, 1000);
  }

  if (pauseTimerBtn) {
    pauseTimerBtn.addEventListener('click', () => {
      isTimerPaused = !isTimerPaused;
      pauseTimerBtn.textContent = isTimerPaused ? '▶ Resume' : '⏸ Pause';
    });
  }

  // Opening envelope click
  startJourneyBtn.addEventListener('click', () => {
    welcomeModal.classList.add('hidden');
    startMusic();
    startAutoProgressTimer();
  });

  function triggerBlackoutTransitionToScene2() {
    clearInterval(autoTimerInterval);
    blackoutScreen.classList.add('active');

    // Exactly 2 seconds blackout
    setTimeout(() => {
      scene1.classList.remove('active-scene');
      scene2.classList.add('active-scene');
      blackoutScreen.classList.remove('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      startRosePetals();
    }, 2000);
  }

  gotoScene2Btn.addEventListener('click', triggerBlackoutTransitionToScene2);

  function switchScene(fromScene, toScene) {
    fromScene.classList.remove('active-scene');
    setTimeout(() => {
      toScene.classList.add('active-scene');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 150);
  }

  backtoScene1Btn.addEventListener('click', () => {
    switchScene(scene2, scene1);
    stopRosePetals();
    startAutoProgressTimer();
  });

  gotoScene3Btn.addEventListener('click', () => {
    switchScene(scene2, scene3);
    stopRosePetals();
  });

  backtoScene2Btn.addEventListener('click', () => {
    switchScene(scene3, scene2);
    startRosePetals();
  });

  restartJourneyBtn.addEventListener('click', () => {
    switchScene(scene3, scene1);
    stopRosePetals();
    resetCandle();
    startAutoProgressTimer();
  });

  // ==========================================================
  // 4. ROSE PETALS GENERATOR (SCENE 2)
  // ==========================================================
  let petalInterval = null;

  function createPetal() {
    if (!petalsContainer) return;
    const petal = document.createElement('div');
    petal.classList.add('petal');

    const size = Math.random() * 15 + 12;
    petal.style.width = `${size}px`;
    petal.style.height = `${size * 1.3}px`;
    petal.style.left = `${Math.random() * 100}vw`;
    petal.style.animationDuration = `${Math.random() * 4 + 4}s`;
    petal.style.opacity = (Math.random() * 0.4 + 0.6).toString();

    petalsContainer.appendChild(petal);
    setTimeout(() => {
      petal.remove();
    }, 8000);
  }

  function startRosePetals() {
    if (petalInterval) return;
    for (let i = 0; i < 8; i++) setTimeout(createPetal, i * 300);
    petalInterval = setInterval(createPetal, 450);
  }

  function stopRosePetals() {
    clearInterval(petalInterval);
    petalInterval = null;
    if (petalsContainer) petalsContainer.innerHTML = '';
  }

  // Batch Image Uploader (Saves images so they can be viewed anywhere)
  if (batchImageInput) {
    batchImageInput.addEventListener('change', (e) => {
      const files = Array.from(e.target.files);
      files.forEach((file, index) => {
        if (index < imgSlots.length && imgSlots[index]) {
          const reader = new FileReader();
          reader.onload = (event) => {
            imgSlots[index].src = event.target.result;
            try {
              localStorage.setItem(`zara_bday_photo_${index + 1}`, event.target.result);
            } catch (err) {
              console.log('LocalStorage quota full');
            }
          };
          reader.readAsDataURL(file);
        }
      });
    });
  }

  // ==========================================================
  // 5. CANDLE BLOW-OUT & CELEBRATION (SCENE 3)
  // ==========================================================
  let isCandleBlown = false;

  function triggerCelebrationConfetti() {
    if (typeof confetti === 'function') {
      const count = 220;
      const defaults = {
        origin: { y: 0.7 },
        colors: ['#ff4081', '#e91e63', '#ff80ab', '#ffd54f', '#ffffff']
      };

      function fire(particleRatio, opts) {
        confetti(Object.assign({}, defaults, opts, {
          particleCount: Math.floor(count * particleRatio)
        }));
      }

      fire(0.25, { spread: 26, startVelocity: 55 });
      fire(0.2, { spread: 60 });
      fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
      fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
      fire(0.1, { spread: 120, startVelocity: 45 });
    }
  }

  candle.addEventListener('click', () => {
    if (isCandleBlown) return;
    isCandleBlown = true;
    candle.classList.add('blown');
    wishStatusBadge.innerHTML = '🎉 Wish Made! May all your prayers be answered, Zara! Ameen 🤲🏻💖';
    wishStatusBadge.classList.add('wish-made');

    triggerCelebrationConfetti();
    setTimeout(triggerCelebrationConfetti, 800);
    setTimeout(triggerCelebrationConfetti, 1600);
  });

  celebrateAgainBtn.addEventListener('click', () => {
    triggerCelebrationConfetti();
  });

  function resetCandle() {
    isCandleBlown = false;
    candle.classList.remove('blown');
    wishStatusBadge.innerHTML = '✨ Tap the flame to blow the candle! ✨';
    wishStatusBadge.classList.remove('wish-made');
  }

  // Interactive Surprise Cards / Capsules
  capsuleCards.forEach((card) => {
    card.addEventListener('click', () => {
      card.classList.toggle('flipped');
    });
  });
});
