/* ============================================================
   1. НАСТРОЙКИ
   ============================================================ */

// ↓ ЗАМЕНИТЕ ЭТУ ДАТУ НА ДАТУ ВАШЕГО НАЧАЛА ОТНОШЕНИЙ (год, месяц-1, день)
const START_DATE = new Date(2026, 1, 4);


/* ============================================================
   2. КАСТОМНЫЙ КУРСОР
   ============================================================ */
const cursor = document.getElementById('customCursor');
const isDesktop = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

if (isDesktop && cursor) {
  document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
  });

  const hoverElements = document.querySelectorAll('a, button, .polaroid, .accordion-header, .envelope, .quality-sticker, .music-btn, .nav-btn, .page-corner');
  hoverElements.forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
  });
}

/* ============================================================
   3. ФОНОВЫЕ ЛЕПЕСТКИ
   ============================================================ */
const petalsContainer = document.getElementById('bgPetals');
const petalCount = window.innerWidth < 640 ? 10 : 18;
const petalSymbols = ['🌸', '🌺', '🌹', '❤️', '💮'];

for (let i = 0; i < petalCount; i++) {
  const petal = document.createElement('div');
  petal.className = 'petal';
  petal.textContent = petalSymbols[Math.floor(Math.random() * petalSymbols.length)];
  petal.style.left = Math.random() * 100 + '%';
  petal.style.top = Math.random() * 100 + '%';
  petal.style.fontSize = (Math.random() * 1.5 + 1) + 'rem';
  petal.style.animationDelay = (Math.random() * 8) + 's';
  petal.style.animationDuration = (Math.random() * 6 + 6) + 's';
  petal.style.opacity = Math.random() * 0.3 + 0.15;
  petalsContainer.appendChild(petal);
}

let ticking = false;
window.addEventListener('scroll', () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      const scrolled = window.pageYOffset;
      const petals = document.querySelectorAll('.petal');
      petals.forEach((petal, index) => {
        const speed = 0.02 + (index % 3) * 0.01;
        petal.style.transform = `translateY(${scrolled * speed}px) rotate(${scrolled * 0.02}deg)`;
      });
      ticking = false;
    });
    ticking = true;
  }
});

/* ============================================================
   4. ЛИСТАНИЕ ЖУРНАЛА
   ============================================================ */
const cover = document.getElementById('hero');
const journalContainer = document.getElementById('journalContainer');
const book = document.getElementById('book');
const pages = Array.from(document.querySelectorAll('.page'));
const totalPages = pages.length;
const currentPageEl = document.getElementById('currentPage');
const totalPagesEl = document.getElementById('totalPages');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

let currentPage = 0;
let isAnimating = false;

totalPagesEl.textContent = totalPages;

function initPages() {
  pages.forEach((page, i) => {
    if (i === 0) {
      page.classList.add('current');
      page.style.transform = 'rotateY(0deg)';
      page.style.zIndex = 3;
    } else {
      page.style.transform = 'rotateY(0deg)';
      page.style.zIndex = 1;
    }
    page.classList.remove('flipped', 'turning');
  });
  updateUI();
}

function updateUI() {
  currentPageEl.textContent = currentPage + 1;
  prevBtn.disabled = currentPage === 0;
  nextBtn.disabled = currentPage === totalPages - 1;

  pages.forEach((page, i) => {
    page.classList.toggle('current', i === currentPage);
  });
}

// Перелистывание вперёд
function goNext() {
  if (isAnimating) return;
  if (currentPage >= totalPages - 1) return;

  isAnimating = true;
  const currentEl = pages[currentPage];
  currentEl.classList.add('turning');
  currentEl.classList.remove('current');
  currentEl.style.transform = 'rotateY(-180deg)';
  currentEl.style.zIndex = 5;

  currentPage++;

  setTimeout(() => {
    currentEl.classList.remove('turning');
    currentEl.classList.add('flipped');
    currentEl.style.zIndex = 0;
    pages[currentPage].classList.add('current');
    pages[currentPage].style.zIndex = 3;
    updateUI();
    isAnimating = false;

    // Запуск счётчика, если это страница 5
    if (currentPage === 4) {
      setTimeout(updateDaysCounter, 300);
    }
  }, 900);
}

// Перелистывание назад
function goPrev() {
  if (isAnimating) return;
  if (currentPage === 0) return;

  isAnimating = true;
  const prevIndex = currentPage - 1;
  const prevEl = pages[prevIndex];

  prevEl.classList.remove('flipped');
  prevEl.classList.add('turning');
  prevEl.style.transform = 'rotateY(0deg)';
  prevEl.style.zIndex = 5;

  pages[currentPage].classList.remove('current');
  pages[currentPage].style.zIndex = 1;

  currentPage--;

  setTimeout(() => {
    prevEl.classList.remove('turning');
    prevEl.classList.add('current');
    prevEl.style.zIndex = 3;
    updateUI();
    isAnimating = false;
  }, 900);
}

nextBtn.addEventListener('click', goNext);
prevBtn.addEventListener('click', goPrev);

// Клавиатура (ПК)
document.addEventListener('keydown', (e) => {
  if (!journalContainer.classList.contains('active')) return;
  if (e.key === 'ArrowRight' || e.key === ' ') {
    e.preventDefault();
    goNext();
  } else if (e.key === 'ArrowLeft') {
    e.preventDefault();
    goPrev();
  }
});

// Клик по уголку (ПК)
pages.forEach((page, i) => {
  const corner = page.querySelector('.page-corner');
  if (corner) {
    corner.addEventListener('click', (e) => {
      e.stopPropagation();
      if (i === currentPage) goNext();
    });
  }
});

/* ============================================================
   5. СВАЙПЫ (мобильные)
   ============================================================ */
let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;
const SWIPE_THRESHOLD = 50;

book.addEventListener('touchstart', (e) => {
  touchStartX = e.changedTouches[0].screenX;
  touchStartY = e.changedTouches[0].screenY;
}, { passive: true });

book.addEventListener('touchend', (e) => {
  touchEndX = e.changedTouches[0].screenX;
  touchEndY = e.changedTouches[0].screenY;
  handleSwipe();
}, { passive: true });

function handleSwipe() {
  const deltaX = touchEndX - touchStartX;
  const deltaY = touchEndY - touchStartY;

  if (Math.abs(deltaY) > Math.abs(deltaX)) return;
  if (Math.abs(deltaX) < SWIPE_THRESHOLD) return;

  if (deltaX < 0) {
    goNext();
  } else {
    goPrev();
  }
}

/* ============================================================
   6. ОТКРЫТИЕ ЖУРНАЛА
   ============================================================ */
document.getElementById('openJournalBtn').addEventListener('click', () => {
  cover.classList.add('hidden');
  journalContainer.classList.add('active');

  window.scrollTo({ top: 0, behavior: 'smooth' });

  setTimeout(() => {
    initPages();
  }, 100);
});

/* ============================================================
   7. АККОРДЕОН
   ============================================================ */
const accordionItems = document.querySelectorAll('.accordion-item');
accordionItems.forEach(item => {
  const header = item.querySelector('.accordion-header');
  header.addEventListener('click', (e) => {
    e.stopPropagation();
    accordionItems.forEach(otherItem => {
      if (otherItem !== item && otherItem.classList.contains('active')) {
        otherItem.classList.remove('active');
      }
    });
    item.classList.toggle('active');
  });
});

/* ============================================================
   8. КОНВЕРТ
   ============================================================ */
const envelope = document.getElementById('envelope');
if (envelope) {
  envelope.addEventListener('click', (e) => {
    e.stopPropagation();
    envelope.classList.toggle('open');
  });
}

/* ============================================================
   9. СЧЁТЧИК ДНЕЙ
   ============================================================ */
let counterStarted = false;

function updateDaysCounter() {
  if (counterStarted) return;
  counterStarted = true;

  const now = new Date();
  const diffTime = Math.abs(now - START_DATE);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const counterEl = document.getElementById('daysCounter');
  if (!counterEl) return;

  let current = 0;
  const step = Math.max(1, Math.ceil(diffDays / 50));
  const interval = setInterval(() => {
    current += step;
    if (current >= diffDays) {
      current = diffDays;
      clearInterval(interval);
    }
    counterEl.textContent = current;
  }, 20);
}

/* ============================================================
   10. ДОЖДЬ СЕРДЕЧЕК
   ============================================================ */
const heartRainBtn = document.getElementById('heartRainBtn');
if (heartRainBtn) {
  heartRainBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    createHeartRain();
  });
}

function createHeartRain() {
  const heartCount = window.innerWidth < 640 ? 35 : 60;
  for (let i = 0; i < heartCount; i++) {
    const heart = document.createElement('div');
    heart.className = 'heart-rain';
    heart.textContent = ['❤️', '💖', '💗', '💓', '🌸'][Math.floor(Math.random() * 5)];
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.fontSize = (Math.random() * 1.5 + 1.2) + 'rem';
    heart.style.animationDuration = (Math.random() * 2 + 2.5) + 's';
    heart.style.animationDelay = Math.random() * 1.5 + 's';
    heart.style.opacity = Math.random() * 0.7 + 0.3;
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 5000);
  }
}

/* ============================================================
   11. МУЗЫКА (романтическая мелодия)
   ============================================================ */
const musicBtn = document.getElementById('musicBtn');
const musicIcon = document.getElementById('musicIcon');
const musicTooltip = document.getElementById('musicTooltip');
const bgMusic = document.getElementById('bgMusic');

let musicPlaying = false;

// Устанавливаем умеренную громкость
bgMusic.volume = 0.4;

musicBtn.addEventListener('click', () => {
  if (!musicPlaying) {
    // Включаем музыку
    bgMusic.play().then(() => {
      musicPlaying = true;
      musicBtn.classList.add('playing');
      musicIcon.textContent = '🎶';
      musicTooltip.textContent = 'Выключить музыку';
    }).catch(err => {
      console.warn('Не удалось воспроизвести музыку:', err);
      // Если браузер заблокировал — попробуем ещё раз при клике
      musicTooltip.textContent = 'Нажми ещё раз 😊';
    });
  } else {
    // Выключаем музыку
    bgMusic.pause();
    musicPlaying = false;
    musicBtn.classList.remove('playing');
    musicIcon.textContent = '🎵';
    musicTooltip.textContent = 'Нажми, чтобы включить музыку';
  }
});

// Автовключение при открытии журнала (после первого взаимодействия)
document.getElementById('openJournalBtn').addEventListener('click', () => {
  // Небольшая задержка, чтобы пользователь успел "войти" в атмосферу
  setTimeout(() => {
    if (!musicPlaying) {
      bgMusic.play().then(() => {
        musicPlaying = true;
        musicBtn.classList.add('playing');
        musicIcon.textContent = '🎶';
        musicTooltip.textContent = 'Выключить музыку';
      }).catch(() => {
        // Если браузер заблокировал — пользователь включит вручную
      });
    }
  }, 800);
});

/* ============================================================
   12. КОРРЕКТИРОВКА ВЫСОТЫ НА МОБИЛЬНЫХ
   ============================================================ */
function setViewportHeight() {
  document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
}
setViewportHeight();
window.addEventListener('resize', setViewportHeight);
window.addEventListener('orientationchange', () => {
  setTimeout(setViewportHeight, 200);
});

console.log('📖 Журнал для Николь готов ✨ Музыка, листание, любовь!');