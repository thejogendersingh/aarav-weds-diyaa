/**
 * Main Application Logic for Aarav Malhotra weds Diya Sharma
 * Exact clone functionality for ShaadiKaCard Frosty Blue template
 */

// ============================================================================
// 1. DATA DEFINITIONS
// ============================================================================
const weddingDateTarget = new Date('2027-02-13T19:30:00+05:30');

const eventsData = [
  {
    name: "RING CEREMONY",
    date: "10 FEB 2027",
    time: "05:00 PM",
    venueName: "THE LEELA PALACE",
    venueAddress: "Chanakyapuri, New Delhi",
    image: "./templates/frosty-blue/events/frosty_event_ring.webp",
    desc: "Two hearts, one promise a beautiful beginning.",
    mapUrl: "https://maps.google.com/?q=The+Leela+Palace+New+Delhi"
  },
  {
    name: "HALDI",
    date: "11 FEB 2027",
    time: "10:00 AM",
    venueName: "THE LEELA PALACE",
    venueAddress: "Chanakyapuri, New Delhi",
    image: "./templates/frosty-blue/events/frosty_event_haldi_1788963863020.webp",
    desc: "A splash of yellow, a whole lot of love.",
    mapUrl: "https://maps.google.com/?q=The+Leela+Palace+New+Delhi"
  },
  {
    name: "MEHENDI",
    date: "12 FEB 2027",
    time: "04:00 PM",
    venueName: "THE LEELA PALACE",
    venueAddress: "Chanakyapuri, New Delhi",
    image: "./templates/frosty-blue/events/frosty_event_mehndi_1788963987519.webp",
    desc: "Hands full of henna, hearts full of love.",
    mapUrl: "https://maps.google.com/?q=The+Leela+Palace+New+Delhi"
  },
  {
    name: "SANGEET",
    date: "12 FEB 2027",
    time: "07:00 PM",
    venueName: "THE LEELA PALACE",
    venueAddress: "Chanakyapuri, New Delhi",
    image: "./templates/frosty-blue/events/frosty_event_sangeet_1788964110415.webp",
    desc: "Music, dance and memories that last forever.",
    mapUrl: "https://maps.google.com/?q=The+Leela+Palace+New+Delhi"
  },
  {
    name: "WEDDING",
    date: "13 FEB 2027",
    time: "07:30 PM",
    venueName: "THE LEELA PALACE",
    venueAddress: "Chanakyapuri, New Delhi",
    image: "./templates/frosty-blue/events/frosty_event_wedding_1788964447182.webp",
    desc: "The day we say forever and always.",
    mapUrl: "https://maps.google.com/?q=The+Leela+Palace+New+Delhi"
  },
  {
    name: "RECEPTION",
    date: "14 FEB 2027",
    time: "07:00 PM",
    venueName: "THE LEELA PALACE",
    venueAddress: "Chanakyapuri, New Delhi",
    image: "./templates/frosty-blue/events/frosty_event_reception_1788964554860.webp",
    desc: "Let's celebrate love, laughter and happily ever after.",
    mapUrl: "https://maps.google.com/?q=The+Leela+Palace+New+Delhi"
  }
];

const galleryImages = [
  "./assets/photos/photo_1.webp",
  "./assets/photos/photo_2.webp",
  "./assets/photos/photo_3.webp",
  "./assets/photos/photo_4.webp",
  "./assets/photos/photo_5.webp",
  "./assets/photos/photo_6.webp"
];

// ============================================================================
// 2. SMOOTH SCROLLING HELPER
// ============================================================================
function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' });
  }
}

// Hero Couple Scroll Click
document.addEventListener('DOMContentLoaded', () => {
  const heroScroll = document.getElementById('heroCoupleScroll');
  if (heroScroll) {
    heroScroll.addEventListener('click', () => {
      scrollToSection('section-calendar');
    });
  }
});

// ============================================================================
// 3. REAL-TIME COUNTDOWN TIMER
// ============================================================================
function updateCountdown() {
  const now = new Date().getTime();
  const diff = weddingDateTarget.getTime() - now;

  if (diff <= 0) {
    document.getElementById('cdDays').textContent = '00';
    document.getElementById('cdHours').textContent = '00';
    document.getElementById('cdMinutes').textContent = '00';
    document.getElementById('cdSeconds').textContent = '00';
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  const daysEl = document.getElementById('cdDays');
  const hoursEl = document.getElementById('cdHours');
  const minsEl = document.getElementById('cdMinutes');
  const secsEl = document.getElementById('cdSeconds');

  if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
  if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
  if (minsEl) minsEl.textContent = String(minutes).padStart(2, '0');
  if (secsEl) secsEl.textContent = String(seconds).padStart(2, '0');
}

setInterval(updateCountdown, 1000);
updateCountdown();

// ============================================================================
// 4. INTERACTIVE SCRATCH CARD
// ============================================================================
document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('scratchCanvas');
  const wrapper = document.getElementById('scratchCardWrapper');
  const hint = document.getElementById('scratchHint');
  if (!canvas || !wrapper) return;

  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  let isScratching = false;
  let isRevealed = false;
  let lastPos = null;

  function initCanvas() {
    if (isRevealed) return;
    const rect = wrapper.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    canvas.width = rect.width;
    canvas.height = rect.height;

    // Linear gradient background matching original component
    const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    grad.addColorStop(0, 'rgba(240, 247, 255, 1)');
    grad.addColorStop(0.5, 'rgba(225, 238, 252, 1)');
    grad.addColorStop(1, 'rgba(232, 243, 255, 1)');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle decorative diagonal stripes
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.55)';
    ctx.lineWidth = 1;
    for (let a = -canvas.height; a < canvas.width + canvas.height; a += 14) {
      ctx.beginPath();
      ctx.moveTo(a, 0);
      ctx.lineTo(a + canvas.height, canvas.height);
      ctx.stroke();
    }
  }

  function getPos(e) {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  }

  function scratch(e) {
    if (!isScratching || isRevealed) return;
    if (e.cancelable && e.type !== 'mousemove') e.preventDefault();

    const pos = getPos(e);
    ctx.globalCompositeOperation = 'destination-out';
    ctx.lineWidth = 45;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    if (lastPos) {
      ctx.moveTo(lastPos.x, lastPos.y);
    } else {
      ctx.moveTo(pos.x, pos.y);
    }
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();

    lastPos = pos;
    checkScratchedPercent();
  }

  function startScratch(e) {
    if (isRevealed) return;
    isScratching = true;
    lastPos = getPos(e);
    scratch(e);
  }

  function endScratch() {
    isScratching = false;
    lastPos = null;
    checkScratchedPercent();
  }

  function checkScratchedPercent() {
    if (isRevealed) return;
    try {
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      let clearPixels = 0;
      const totalPixels = imgData.length / 4;

      for (let i = 3; i < imgData.length; i += 4) {
        if (imgData[i] < 128) clearPixels++;
      }

      const percent = (clearPixels / totalPixels) * 100;

      // Fade out hint text
      if (hint) {
        const remainingOpacity = Math.max(0, 1 - percent / 20);
        hint.style.opacity = remainingOpacity;
      }

      // Auto-reveal if > 30% scratched
      if (percent > 30) {
        isRevealed = true;
        canvas.style.transition = 'opacity 0.6s ease';
        canvas.style.opacity = '0';
        canvas.style.pointerEvents = 'none';
        if (hint) hint.style.opacity = '0';
        triggerConfetti();
      }
    } catch (err) {
      // Ignore cross-origin error if any
    }
  }

  function triggerConfetti() {
    const count = 60;
    const colors = ['#ffffff', '#a5d4ff', '#7fa2c7', '#cbe3fc', '#e6f2ff', '#b3d9ff'];
    for (let i = 0; i < count; i++) {
      const conf = document.createElement('div');
      conf.style.position = 'absolute';
      conf.style.width = Math.random() * 8 + 4 + 'px';
      conf.style.height = Math.random() * 6 + 4 + 'px';
      conf.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      conf.style.borderRadius = '2px';
      conf.style.left = Math.random() * 90 + 5 + '%';
      conf.style.top = Math.random() * 40 + '%';
      conf.style.zIndex = '999';
      conf.style.pointerEvents = 'none';
      conf.style.transition = 'all 1.8s cubic-bezier(0.25, 1, 0.5, 1)';
      wrapper.appendChild(conf);

      setTimeout(() => {
        conf.style.transform = `translate(${Math.random() * 120 - 60}px, ${Math.random() * 160 + 80}px) rotate(${Math.random() * 360}deg)`;
        conf.style.opacity = '0';
      }, 20);

      setTimeout(() => conf.remove(), 2000);
    }
  }

  canvas.addEventListener('mousedown', startScratch);
  canvas.addEventListener('mousemove', scratch);
  window.addEventListener('mouseup', endScratch);

  canvas.addEventListener('touchstart', startScratch, { passive: false });
  canvas.addEventListener('touchmove', scratch, { passive: false });
  window.addEventListener('touchend', endScratch);

  // Initialize canvas on load and on resize
  setTimeout(initCanvas, 150);
  window.addEventListener('resize', initCanvas);
});

// ============================================================================
// 5. WEDDING EVENTS CAROUSEL & MODAL
// ============================================================================
let currentEventIdx = 0;

function renderEventCard(idx) {
  currentEventIdx = idx;
  const ev = eventsData[idx];
  if (!ev) return;

  const imgEl = document.getElementById('eventCardImage');
  const nameEl = document.getElementById('eventCardName');
  const venueTitleEl = document.getElementById('eventCardVenueTitle');
  const venueAddrEl = document.getElementById('eventCardVenueAddress');
  const dateEl = document.getElementById('eventCardDate');
  const timeEl = document.getElementById('eventCardTime');
  const dirBtn = document.getElementById('eventCardDirectionsBtn');

  if (imgEl) imgEl.src = ev.image;
  if (nameEl) nameEl.textContent = ev.name;
  if (dateEl) dateEl.textContent = ev.date;
  if (timeEl) timeEl.textContent = ev.time;
  if (dirBtn) dirBtn.href = ev.mapUrl;

  if (venueTitleEl) {
    venueTitleEl.innerHTML = `<span><span style="display:inline-block;vertical-align:-0.1em;margin-right:4px;"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="0.92em" height="0.92em" style="display:block;"><path d="M3 21h18"></path><path d="M9 8h1"></path><path d="M9 12h1"></path><path d="M9 16h1"></path><path d="M14 8h1"></path><path d="M14 12h1"></path><path d="M14 16h1"></path><path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16"></path></svg></span>${ev.venueName}</span>`;
  }
  if (venueAddrEl) {
    venueAddrEl.innerHTML = `<span><span style="display:inline-block;vertical-align:-0.12em;margin-right:3px;"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="0.92em" height="0.92em" style="display:block;"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg></span>${ev.venueAddress}</span>`;
  }

  // Update dots
  const dots = document.querySelectorAll('#eventDots .Template3-module__zDQZ6a__eventDot');
  dots.forEach((dot, i) => {
    if (i === idx) {
      dot.classList.add('Template3-module__zDQZ6a__eventDotActive');
    } else {
      dot.classList.remove('Template3-module__zDQZ6a__eventDotActive');
    }
  });
}

function openEventModal(idx) {
  const ev = eventsData[idx ?? currentEventIdx];
  if (!ev) return;

  const modal = document.getElementById('eventModal');
  const img = document.getElementById('modalEventImg');
  const title = document.getElementById('modalEventTitle');
  const desc = document.getElementById('modalEventDesc');
  const date = document.getElementById('modalEventDate');
  const time = document.getElementById('modalEventTime');
  const venue = document.getElementById('modalEventVenue');
  const dirBtn = document.getElementById('modalDirectionsBtn');

  if (img) img.src = ev.image;
  if (title) title.textContent = ev.name;
  if (desc) desc.textContent = ev.desc;
  if (date) date.textContent = ev.date;
  if (time) time.textContent = ev.time;
  if (venue) venue.textContent = `${ev.venueName}, ${ev.venueAddress}`;
  if (dirBtn) dirBtn.href = ev.mapUrl;

  if (modal) {
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }
}

function closeEventModal() {
  const modal = document.getElementById('eventModal');
  if (modal) {
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const prevBtn = document.getElementById('eventPrevBtn');
  const nextBtn = document.getElementById('eventNextBtn');
  const viewBtn = document.getElementById('viewDetailsBtn');
  const card = document.getElementById('eventSingleCard');

  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const next = currentEventIdx === 0 ? eventsData.length - 1 : currentEventIdx - 1;
      renderEventCard(next);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const next = currentEventIdx === eventsData.length - 1 ? 0 : currentEventIdx + 1;
      renderEventCard(next);
    });
  }

  const dotButtons = document.querySelectorAll('#eventDots button');
  dotButtons.forEach((dot) => {
    dot.addEventListener('click', (e) => {
      e.stopPropagation();
      const idx = parseInt(dot.getAttribute('data-idx') || '0', 10);
      renderEventCard(idx);
    });
  });

  if (viewBtn) {
    viewBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      openEventModal(currentEventIdx);
    });
  }

  if (card) {
    card.addEventListener('click', () => {
      openEventModal(currentEventIdx);
    });

    // Touch swipe support
    let startX = 0;
    card.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
    }, { passive: true });

    card.addEventListener('touchend', (e) => {
      const endX = e.changedTouches[0].clientX;
      const diffX = endX - startX;
      if (diffX < -50) {
        // swipe left -> next
        const next = currentEventIdx === eventsData.length - 1 ? 0 : currentEventIdx + 1;
        renderEventCard(next);
      } else if (diffX > 50) {
        // swipe right -> prev
        const next = currentEventIdx === 0 ? eventsData.length - 1 : currentEventIdx - 1;
        renderEventCard(next);
      }
    }, { passive: true });
  }
});

// ============================================================================
// 6. PHOTO GALLERY SLIDER & LIGHTBOX
// ============================================================================
let currentGalleryIdx = 0;

function renderGallery(idx) {
  currentGalleryIdx = idx;
  const mainImg = document.getElementById('galleryMainImg');
  const counter = document.getElementById('galleryCurrentNum');

  if (mainImg) mainImg.src = galleryImages[idx];
  if (counter) counter.textContent = idx + 1;

  // Update active thumbnail
  const thumbs = document.querySelectorAll('.Template3-module__zDQZ6a__galleryThumbnailItem');
  thumbs.forEach((th, i) => {
    if (i === idx) {
      th.classList.add('Template3-module__zDQZ6a__galleryThumbnailActive');
    } else {
      th.classList.remove('Template3-module__zDQZ6a__galleryThumbnailActive');
    }
  });
}

function openLightbox(idx) {
  currentGalleryIdx = idx ?? currentGalleryIdx;
  const lightbox = document.getElementById('galleryLightbox');
  const lbImg = document.getElementById('lightboxImg');
  const lbCounter = document.getElementById('lightboxCounter');

  if (lbImg) lbImg.src = galleryImages[currentGalleryIdx];
  if (lbCounter) lbCounter.textContent = `${currentGalleryIdx + 1} / ${galleryImages.length}`;

  if (lightbox) {
    lightbox.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }
}

function closeLightbox() {
  const lightbox = document.getElementById('galleryLightbox');
  if (lightbox) {
    lightbox.style.display = 'none';
    document.body.style.overflow = '';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const prevBtn = document.getElementById('galleryPrevBtn');
  const nextBtn = document.getElementById('galleryNextBtn');
  const mainCard = document.getElementById('galleryMainCard');

  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const prev = currentGalleryIdx === 0 ? galleryImages.length - 1 : currentGalleryIdx - 1;
      renderGallery(prev);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const next = currentGalleryIdx === galleryImages.length - 1 ? 0 : currentGalleryIdx + 1;
      renderGallery(next);
    });
  }

  if (mainCard) {
    mainCard.addEventListener('click', () => {
      openLightbox(currentGalleryIdx);
    });
  }

  const thumbButtons = document.querySelectorAll('.Template3-module__zDQZ6a__galleryThumbnailItem');
  thumbButtons.forEach((th) => {
    th.addEventListener('click', (e) => {
      e.stopPropagation();
      const idx = parseInt(th.getAttribute('data-idx') || '0', 10);
      renderGallery(idx);
    });
  });

  // Lightbox nav buttons
  const lbPrev = document.getElementById('lightboxPrevBtn');
  const lbNext = document.getElementById('lightboxNextBtn');

  if (lbPrev) {
    lbPrev.addEventListener('click', (e) => {
      e.stopPropagation();
      const prev = currentGalleryIdx === 0 ? galleryImages.length - 1 : currentGalleryIdx - 1;
      currentGalleryIdx = prev;
      openLightbox(prev);
      renderGallery(prev);
    });
  }

  if (lbNext) {
    lbNext.addEventListener('click', (e) => {
      e.stopPropagation();
      const next = currentGalleryIdx === galleryImages.length - 1 ? 0 : currentGalleryIdx + 1;
      currentGalleryIdx = next;
      openLightbox(next);
      renderGallery(next);
    });
  }
});

// ESC key closes modals
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeEventModal();
    closeLightbox();
  }
});

// ============================================================================
// 7. LANGUAGE SWITCHER DROPDOWN
// ============================================================================
document.addEventListener('DOMContentLoaded', () => {
  const trigger = document.getElementById('lsTrigger');
  const dropdown = document.getElementById('lsDropdown');
  const chevron = document.getElementById('lsChevron');
  const nativeSpan = document.getElementById('lsNative');
  const flagSpan = document.getElementById('lsFlag');

  if (!trigger || !dropdown) return;

  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = dropdown.style.display === 'block';
    dropdown.style.display = isOpen ? 'none' : 'block';
    if (chevron) chevron.classList.toggle('open', !isOpen);
  });

  const items = dropdown.querySelectorAll('.ls-item');
  items.forEach(item => {
    item.addEventListener('click', (e) => {
      e.stopPropagation();
      items.forEach(it => it.classList.remove('active'));
      item.classList.add('active');

      const flag = item.querySelector('.ls-flag')?.textContent || '';
      const text = item.querySelector('span:not(.ls-flag)')?.textContent || '';

      if (flagSpan) flagSpan.textContent = flag;
      if (nativeSpan) nativeSpan.textContent = text;

      dropdown.style.display = 'none';
      if (chevron) chevron.classList.remove('open');
    });
  });

  window.addEventListener('click', () => {
    dropdown.style.display = 'none';
    if (chevron) chevron.classList.remove('open');
  });
});

// ============================================================================
// 8. ADD TO CALENDAR HELPER
// ============================================================================
function addToCalendar() {
  const title = encodeURIComponent("Aarav Malhotra & Diya Sharma Wedding");
  const details = encodeURIComponent("Join us in celebrating the wedding of Aarav and Diya at The Leela Palace.");
  const location = encodeURIComponent("The Leela Palace, Chanakyapuri, New Delhi, 110023");
  const dates = "20270213T140000Z/20270213T190000Z"; // UTC time for 7:30 PM IST

  const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${dates}`;
  window.open(googleUrl, '_blank');
}

// ============================================================================
// 9. RSVP SUBMISSION
// ============================================================================
function handleRsvpSubmit(e) {
  e.preventDefault();
  const form = document.getElementById('rsvpForm');
  const successMsg = document.getElementById('rsvpSuccessMsg');

  if (form && successMsg) {
    const submitBtn = form.querySelector('.Template3-module__zDQZ6a__submitBtn');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Submitting...';
    }

    setTimeout(() => {
      form.style.display = 'none';
      successMsg.style.display = 'block';
    }, 600);
  }
}
