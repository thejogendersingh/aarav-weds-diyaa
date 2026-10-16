/**
 * Background Audio Controller for Wedding Invitation
 */
document.addEventListener('DOMContentLoaded', () => {
  const audio = document.getElementById('bgAudio');
  const musicBtn = document.getElementById('siteMusicBtn');
  const iconMuted = document.getElementById('musicIconMuted');
  const iconPlaying = document.getElementById('musicIconPlaying');

  if (!audio || !musicBtn) return;

  let isPlaying = false;
  let userInteracted = false;

  function setPlayingState(playing) {
    isPlaying = playing;
    if (playing) {
      if (iconMuted) iconMuted.style.display = 'none';
      if (iconPlaying) iconPlaying.style.display = 'block';
      musicBtn.classList.add('playing');
      musicBtn.setAttribute('aria-label', 'Pause Music');
    } else {
      if (iconMuted) iconMuted.style.display = 'block';
      if (iconPlaying) iconPlaying.style.display = 'none';
      musicBtn.classList.remove('playing');
      musicBtn.setAttribute('aria-label', 'Play Music');
    }
  }

  function toggleAudio() {
    userInteracted = true;
    if (isPlaying) {
      audio.pause();
      setPlayingState(false);
    } else {
      audio.play().then(() => {
        setPlayingState(true);
      }).catch(err => {
        console.log('Audio autoplay prevented:', err);
      });
    }
  }

  musicBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleAudio();
  });

  // Attempt gentle autoplay on first touch / click anywhere on the page
  function autoStart() {
    if (!userInteracted && !isPlaying) {
      audio.play().then(() => {
        userInteracted = true;
        setPlayingState(true);
        cleanup();
      }).catch(() => {
        // Browser requires direct gesture on button
      });
    }
  }

  function cleanup() {
    window.removeEventListener('click', autoStart);
    window.removeEventListener('touchstart', autoStart);
    window.removeEventListener('scroll', autoStart);
  }

  window.addEventListener('click', autoStart, { once: true });
  window.addEventListener('touchstart', autoStart, { once: true });
  window.addEventListener('scroll', autoStart, { once: true });
});
