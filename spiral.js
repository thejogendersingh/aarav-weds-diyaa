/**
 * Floral Spiral Intro Animation - 1:1 Pixel-Perfect Clone from ShaadiKaCard
 * Reverse-engineered from ShaadiKaCard Turbopack chunk 1-zdl55y3z_c9.js
 */

(function () {
  'use strict';

  // Rose image sets (desktop / small and mobile)
  const DESKTOP_ROSES = [
    './assets/animations/floral-spiral/small/rose-yellow.webp',
    './assets/animations/floral-spiral/small/rose-pink.webp',
    './assets/animations/floral-spiral/small/rose-white.webp',
    './assets/animations/floral-spiral/small/rose-peach.webp',
    './assets/animations/floral-spiral/small/rose-green.webp',
    './assets/animations/floral-spiral/small/rose-blue.webp',
    './assets/animations/floral-spiral/small/rose-purple.webp',
    './assets/animations/floral-spiral/small/rose-coral.webp'
  ];

  const MOBILE_ROSES = [
    './assets/animations/floral-spiral/mobile/rose-yellow.webp',
    './assets/animations/floral-spiral/mobile/rose-pink.webp',
    './assets/animations/floral-spiral/mobile/rose-white.webp',
    './assets/animations/floral-spiral/mobile/rose-peach.webp',
    './assets/animations/floral-spiral/mobile/rose-green.webp',
    './assets/animations/floral-spiral/mobile/rose-blue.webp',
    './assets/animations/floral-spiral/mobile/rose-purple.webp',
    './assets/animations/floral-spiral/mobile/rose-coral.webp'
  ];

  let introContainer = null;
  let canvas = null;
  let ctx = null;
  let restingFlowerWrapper = null;
  let clickPrompt = null;
  let bgCover = null;

  let loadedImages = new Map();
  let imageBitmaps = new Map();
  let isAssetLoaded = false;
  let isPlaying = false;
  let isParting = false;
  let isCompleted = false;

  let animStartTime = null;
  let animFrameId = null;

  let windowWidth = window.innerWidth;
  let windowHeight = window.innerHeight;

  // Preset settings matching original chunk
  const flowerSizePreset = 'large';
  const rotationSpeed = 'medium';
  const speedMultiplier = 1;

  // Preload all rose images
  function preloadImages(sources, onDone) {
    let loadedCount = 0;
    const total = sources.length;

    sources.forEach((src) => {
      const img = new Image();
      img.onload = () => {
        loadedCount++;
        loadedImages.set(src, img);
        if (loadedCount >= total) {
          prepareBitmaps(onDone);
        }
      };
      img.onerror = () => {
        loadedCount++;
        loadedImages.set(src, img);
        if (loadedCount >= total) {
          prepareBitmaps(onDone);
        }
      };
      img.src = src;
      if (img.complete) {
        loadedCount++;
        loadedImages.set(src, img);
        if (loadedCount >= total) {
          prepareBitmaps(onDone);
        }
      }
    });
  }

  async function prepareBitmaps(onDone) {
    if (typeof createImageBitmap === 'function') {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const targetSize = Math.max(1, Math.ceil(1.12 * 180 * dpr));
      const promises = [];

      loadedImages.forEach((img, src) => {
        if (img && img.naturalWidth > 0) {
          promises.push(
            createImageBitmap(img, {
              resizeWidth: targetSize,
              resizeHeight: targetSize,
              resizeQuality: 'high'
            }).then((bmp) => {
              imageBitmaps.set(src, bmp);
            }).catch(() => {})
          );
        }
      });

      await Promise.all(promises);
    }
    isAssetLoaded = true;
    if (onDone) onDone();
  }

  // Calculate Archimedean spiral flower nodes
  function computeSpiralNodes(w, h) {
    const isMobile = w < 640;
    const isTablet = w >= 640 && w < 1024;
    const activeRoseSources = isMobile ? MOBILE_ROSES : DESKTOP_ROSES;

    const maxRadius = Math.sqrt((w / 2) ** 2 + (h / 2) ** 2) + 120;

    let config;
    if (isMobile) {
      config = {
        medium: { flowerSize: 98, coilGap: 62, stepDist: 56, startR: 27 },
        large: { flowerSize: 115, coilGap: 72, stepDist: 65, startR: 32 },
        'extra-large': { flowerSize: 130, coilGap: 80, stepDist: 72, startR: 36 }
      }[flowerSizePreset];
    } else if (isTablet) {
      config = {
        medium: { flowerSize: 155, coilGap: 100, stepDist: 88, startR: 44 },
        large: { flowerSize: 180, coilGap: 112, stepDist: 98, startR: 50 },
        'extra-large': { flowerSize: 205, coilGap: 125, stepDist: 110, startR: 56 }
      }[flowerSizePreset];
    } else {
      config = {
        medium: { flowerSize: 200, coilGap: 125, stepDist: 110, startR: 55 },
        large: { flowerSize: 230, coilGap: 140, stepDist: 124, startR: 65 },
        'extra-large': { flowerSize: 260, coilGap: 155, stepDist: 138, startR: 75 }
      }[flowerSizePreset];
    }

    const { flowerSize: i, coilGap: n, stepDist: s, startR: l } = config;
    const p = n / (2 * Math.PI);
    const m = isMobile ? 0.95 * w : 0.65 * w;
    const nodes = [];

    // Deterministic PRNG exactly from ShaadiKaCard
    let f = 999;
    const hRnd = () => (f = (9301 * f + 49297) % 233280) / 233280;

    const getSpinDuration = () => {
      let speedVal = { slow: 38, medium: 22, fast: 12, none: 0 }[rotationSpeed];
      return speedVal === 0 ? 0 : speedVal + (hRnd() - 0.5) * 6;
    };

    const g0 = Math.round(360 * hRnd());
    const b0 = getSpinDuration();

    // Center flower node
    nodes.push({
      id: 0,
      x: 0,
      y: 0,
      radius: 0,
      angle: 0,
      size: i,
      initialRotation: g0,
      spinDuration: b0,
      spinDirection: 1,
      src: activeRoseSources[0],
      flowerIndex: 0,
      bloomDelay: 0.1,
      bloomDuration: 0.6,
      isLeft: true,
      displaceX: -m,
      zIndex: 10
    });

    let currentAngle = 0;
    let v = 1;

    while (true) {
      let radius = l + p * currentAngle;
      if (radius > maxRadius || v > 350) break;

      let xPos = radius * Math.cos(currentAngle);
      let yPos = radius * Math.sin(currentAngle);
      let size = Math.round(i * (0.96 + 0.08 * hRnd()));
      let initRot = Math.round(360 * hRnd());
      let spinDur = getSpinDuration();
      let spinDir = v % 2 === 0 ? 1 : -1;
      let flowerIdx = (5 * v) % activeRoseSources.length;
      let src = activeRoseSources[flowerIdx];
      let bDelay = 0.2 + 0.285 * Math.pow(currentAngle, 0.78);
      let bDuration = 0.55 - 0.12 * Math.min(1, radius / maxRadius) + 0.05 * hRnd();
      let isLeft = xPos < 0 || (xPos === 0 && v % 2 === 0);
      let displaceX = isLeft ? -m : m;

      nodes.push({
        id: v,
        x: Math.round(10 * xPos) / 10,
        y: Math.round(10 * yPos) / 10,
        radius: radius,
        angle: currentAngle,
        size: size,
        initialRotation: initRot,
        spinDuration: spinDur,
        spinDirection: spinDir,
        src: src,
        flowerIndex: flowerIdx,
        bloomDelay: bDelay,
        bloomDuration: bDuration,
        isLeft: isLeft,
        displaceX: displaceX,
        zIndex: v + 10
      });

      currentAngle += Math.min(0.82, s / radius);
      v++;
    }

    let maxBloomEnd = 0.7;
    nodes.forEach((node) => {
      let end = node.bloomDelay + node.bloomDuration;
      if (end > maxBloomEnd) maxBloomEnd = end;
    });

    const partingStartTime = maxBloomEnd + 0.8;
    const partingDuration = 2.0;
    const totalDuration = partingStartTime + partingDuration;

    return {
      nodes,
      timings: {
        partingStartTime,
        partingDuration,
        totalDuration
      }
    };
  }

  // Overshoot easing matching ShaadiKaCard
  function overshootEase(e) {
    let t = e - 1;
    return 1 + 2.70158 * t * t * t + 1.70158 * t * t;
  }

  // Render loop
  function startRenderLoop(nodes, timings) {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(windowWidth * dpr);
    canvas.height = Math.round(windowHeight * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.imageSmoothingQuality = 'low';

    const centerX = windowWidth / 2;
    const centerY = windowHeight / 2;
    const { partingStartTime, partingDuration, totalDuration } = timings;

    function render(timestamp) {
      if (!animStartTime) animStartTime = timestamp;
      const elapsed = ((timestamp - animStartTime) / 1000) * speedMultiplier;

      // Check parting start
      if (elapsed >= partingStartTime && !isParting) {
        isParting = true;
        if (bgCover) {
          bgCover.style.opacity = '0';
          bgCover.style.transition = 'opacity 1.5s ease-out';
        }
      }

      ctx.clearRect(0, 0, windowWidth, windowHeight);
      ctx.save();
      ctx.translate(centerX, centerY);

      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        const bloomProgress = (elapsed - node.bloomDelay) / node.bloomDuration;

        if (bloomProgress <= 0) continue;

        let scale = 1;
        let bloomScale = 1;

        if (bloomProgress < 0.65) {
          const eased = overshootEase(bloomProgress / 0.65);
          scale = Math.min(1, eased);
          bloomScale = 1.05 * eased;
        } else if (bloomProgress < 1) {
          scale = 1;
          bloomScale = 1.05 - ((bloomProgress - 0.65) / 0.35) * 0.05;
        } else {
          scale = 1;
          bloomScale = 1;
        }

        // Parting displacement
        let alpha = 1;
        let shiftX = 0;
        const partProgress = (elapsed - partingStartTime) / partingDuration;

        if (partProgress > 0) {
          const clamped = Math.min(1, partProgress);
          const smoothStep = clamped * clamped * (3 - 2 * clamped);
          shiftX = node.displaceX * smoothStep;
          alpha = clamped < 0.75 ? 1 - (clamped / 0.75) * 0.1 : 0.9 * (1 - (clamped - 0.75) / 0.25);
        }

        const totalAlpha = scale * alpha;
        if (totalAlpha <= 0.01) continue;

        const rotation = node.spinDuration > 0
          ? node.initialRotation + 360 * node.spinDirection * ((elapsed / node.spinDuration) % 1)
          : node.initialRotation;

        const imgOrBmp = imageBitmaps.get(node.src) || loadedImages.get(node.src);

        if (imgOrBmp) {
          ctx.save();
          ctx.globalAlpha = totalAlpha;
          ctx.translate(node.x + shiftX, node.y);
          ctx.rotate((rotation * Math.PI) / 180);
          ctx.scale(bloomScale, bloomScale);
          ctx.drawImage(imgOrBmp, -node.size / 2, -node.size / 2, node.size, node.size);
          ctx.restore();
        }
      }

      ctx.restore();

      if (elapsed < totalDuration + 0.4) {
        animFrameId = requestAnimationFrame(render);
      } else {
        finishAnimation();
      }
    }

    animFrameId = requestAnimationFrame(render);
  }

  function finishAnimation() {
    if (isCompleted) return;
    isCompleted = true;

    if (introContainer) {
      introContainer.style.opacity = '0';
      introContainer.style.transition = 'opacity 0.4s ease-out';
      setTimeout(() => {
        if (introContainer && introContainer.parentNode) {
          introContainer.parentNode.removeChild(introContainer);
        }
        document.body.classList.remove('intro-active');
        document.body.classList.add('intro-done');
      }, 450);
    }
  }

  // Handle user interaction (Click to Begin)
  function handleIntroTrigger() {
    if (isPlaying) return;
    isPlaying = true;

    // Trigger background audio seamlessly on first user gesture
    if (window.AudioPlayer && typeof window.AudioPlayer.play === 'function') {
      window.AudioPlayer.play();
    } else {
      const musicFab = document.getElementById('musicFab');
      if (musicFab && !musicFab.classList.contains('playing')) {
        musicFab.click();
      }
    }

    // Hide resting blossom and tap prompt
    if (restingFlowerWrapper) {
      restingFlowerWrapper.style.opacity = '0';
      restingFlowerWrapper.style.transition = 'opacity 0.25s ease-out';
    }
    if (clickPrompt) {
      clickPrompt.style.opacity = '0';
      clickPrompt.style.transition = 'opacity 0.2s ease-out';
    }

    // Compute spiral and start canvas animation
    windowWidth = window.innerWidth;
    windowHeight = window.innerHeight;
    const { nodes, timings } = computeSpiralNodes(windowWidth, windowHeight);
    startRenderLoop(nodes, timings);
  }

  // Initialize intro UI in DOM
  function initIntro() {
    // Add intro-active class to body
    document.body.classList.add('intro-active');

    const isMobile = window.innerWidth < 640;
    const allRoses = isMobile ? MOBILE_ROSES : DESKTOP_ROSES;
    const heroRose = allRoses[1] || allRoses[0];

    // Build DOM structure
    introContainer = document.createElement('div');
    introContainer.id = 'floralSpiralIntro';
    introContainer.className = 'floral-spiral-overlay';

    introContainer.innerHTML = `
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700&family=Montserrat:wght@500;600;700&display=swap');

        body.intro-active {
          overflow: hidden !important;
          height: 100vh !important;
        }

        .floral-spiral-overlay {
          position: fixed;
          inset: 0;
          z-index: 999999;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          user-select: none;
          -webkit-user-select: none;
        }

        .spiral-bg-cover {
          position: absolute;
          inset: 0;
          z-index: 10;
          background: #f5ece2;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: none;
        }

        .spiral-bg-radial {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle, #FAF5EF 0%, #f5ece2 50%, #EBDCCF 100%);
        }

        .spiral-bg-spot-1 {
          position: absolute;
          top: 25%;
          left: 25%;
          width: 320px;
          height: 320px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(232, 213, 196, 0.6) 0%, transparent 70%);
          pointer-events: none;
        }

        .spiral-bg-spot-2 {
          position: absolute;
          bottom: 25%;
          right: 25%;
          width: 320px;
          height: 320px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(223, 206, 189, 0.5) 0%, transparent 70%);
          pointer-events: none;
        }

        .spiral-bg-dots {
          position: absolute;
          inset: 0;
          opacity: 0.15;
          background-image: radial-gradient(#C4A482 1px, transparent 1px);
          background-size: 24px 24px;
          pointer-events: none;
        }

        /* Resting Hero Flower Keyframes */
        @keyframes restingFlowerGlow {
          0%, 100% {
            transform: scale(1) rotate(0deg);
          }
          50% {
            transform: scale(1.04) rotate(4deg);
          }
        }

        /* Clean White Hand Tap Gesture */
        @keyframes handTapGesture {
          0%, 100% {
            transform: translateY(0) scale(1);
          }
          30% {
            transform: translateY(3px) scale(0.92);
          }
          50% {
            transform: translateY(0) scale(1.04);
          }
        }

        @keyframes handRippleWave {
          0% {
            transform: scale(0.6);
            opacity: 0.9;
          }
          100% {
            transform: scale(2.2);
            opacity: 0;
          }
        }

        .spiral-center-content {
          position: absolute;
          inset: 0;
          z-index: 50;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          pointer-events: auto;
        }

        .spiral-resting-flower {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: none;
        }

        .spiral-mint-glow {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: ${isMobile ? '260px' : '340px'};
          height: ${isMobile ? '260px' : '340px'};
          border-radius: 50%;
          background: radial-gradient(circle, rgba(200, 230, 210, 0.45) 0%, rgba(180, 215, 190, 0.15) 50%, transparent 72%);
          pointer-events: none;
        }

        .spiral-rose-img-wrapper {
          position: relative;
          width: ${isMobile ? '140px' : '180px'};
          height: ${isMobile ? '140px' : '180px'};
          animation: restingFlowerGlow 4.2s ease-in-out infinite;
          pointer-events: none;
        }

        .spiral-rose-img-wrapper img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          pointer-events: none;
          user-select: none;
        }

        .spiral-prompt-wrapper {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, ${isMobile ? '95px' : '125px'});
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          pointer-events: none;
        }

        .spiral-prompt-text {
          font-family: 'Plus Jakarta Sans', 'Montserrat', -apple-system, sans-serif;
          font-size: ${isMobile ? '12px' : '13px'};
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.24em;
          color: #3d2b1f;
          text-shadow: 0 1px 8px rgba(255, 255, 255, 0.9), 0 0 16px rgba(255, 255, 255, 0.95);
          text-align: center;
        }

        .spiral-hand-container {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
        }

        .spiral-ripple-1 {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 24px;
          height: 24px;
          border-radius: 50%;
          border: 2px solid rgba(255, 255, 255, 0.85);
          animation: handRippleWave 2.0s cubic-bezier(0.1, 0.8, 0.3, 1) infinite;
          pointer-events: none;
        }

        .spiral-ripple-2 {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 24px;
          height: 24px;
          border-radius: 50%;
          border: 1px solid rgba(255, 255, 255, 0.45);
          animation: handRippleWave 2.0s cubic-bezier(0.1, 0.8, 0.3, 1) 0.6s infinite;
          pointer-events: none;
        }

        .spiral-hand-svg {
          width: 34px;
          height: 34px;
          color: #ffffff;
          animation: handTapGesture 2.0s ease-in-out infinite;
          filter: drop-shadow(0 3px 12px rgba(0, 0, 0, 0.75)) drop-shadow(0 0 16px rgba(255, 255, 255, 0.45));
        }

        .spiral-canvas {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          z-index: 25;
          pointer-events: none;
        }
      </style>

      <!-- Background Cover -->
      <div id="spiralBgCover" class="spiral-bg-cover">
        <div class="spiral-bg-radial"></div>
        <div class="spiral-bg-spot-1"></div>
        <div class="spiral-bg-spot-2"></div>
        <div class="spiral-bg-dots"></div>
      </div>

      <!-- Center Resting Blossom & Tap Button -->
      <div class="spiral-center-content" id="spiralCenterContent">
        <div class="spiral-resting-flower" id="spiralRestingFlower">
          <div class="spiral-mint-glow"></div>
          <div class="spiral-rose-img-wrapper">
            <img src="${heroRose}" alt="Blossom" draggable="false">
          </div>
        </div>

        <div class="spiral-prompt-wrapper" id="spiralPromptWrapper">
          <span class="spiral-prompt-text" id="spiralPromptText">Click to Begin</span>
          <div class="spiral-hand-container">
            <div class="spiral-ripple-1"></div>
            <div class="spiral-ripple-2"></div>
            <svg class="spiral-hand-svg" viewBox="0 0 32 32" fill="currentColor">
              <path d="M15.5 2C14.12 2 13 3.12 13 4.5V14.65L11.53 13.18C10.55 12.2 8.95 12.2 7.97 13.18C7.45 13.7 7.21 14.41 7.29 15.11C7.38 15.82 7.78 16.44 8.38 16.85L14.7 25.13C16.03 26.88 18.11 27.91 20.33 27.91H23C26.31 27.91 29 25.22 29 21.91V14.5C29 13.12 27.88 12 26.5 12C26.17 12 25.86 12.06 25.57 12.18C25.19 11.18 24.23 10.5 23.1 10.5C22.77 10.5 22.45 10.56 22.16 10.68C21.78 9.68 20.82 9 19.69 9C19.46 9 19.23 9.03 19.01 9.1V4.5C19.01 3.12 17.89 2 16.51 2H15.5Z"/>
            </svg>
          </div>
        </div>
      </div>

      <!-- Canvas for Archimedean Spiral -->
      <canvas id="spiralCanvas" class="spiral-canvas"></canvas>
    `;

    document.body.prepend(introContainer);

    canvas = document.getElementById('spiralCanvas');
    ctx = canvas.getContext('2d');
    bgCover = document.getElementById('spiralBgCover');
    restingFlowerWrapper = document.getElementById('spiralRestingFlower');
    clickPrompt = document.getElementById('spiralPromptWrapper');

    introContainer.addEventListener('click', handleIntroTrigger);
    introContainer.addEventListener('touchstart', handleIntroTrigger, { passive: true });

    // Preload images immediately
    preloadImages([...DESKTOP_ROSES, ...MOBILE_ROSES], () => {
      const promptText = document.getElementById('spiralPromptText');
      if (promptText) {
        promptText.textContent = 'Click to Begin';
      }
    });

    // Handle resize
    window.addEventListener('resize', () => {
      if (!isPlaying) {
        windowWidth = window.innerWidth;
        windowHeight = window.innerHeight;
      }
    });
  }

  // Execute as early as possible
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initIntro);
  } else {
    initIntro();
  }
})();
