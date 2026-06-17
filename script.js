// Wedding date — change this to your date
const WEDDING_DATE = new Date('2026-07-24T11:30:00');

// ===== Personalization =====
function getGuestFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const directName = params.get('guest') || params.get('name');
  const directCount = params.get('count');

  if (id && typeof GUEST_LIST !== 'undefined' && GUEST_LIST[id]) {
    return {
      name: GUEST_LIST[id].name,
      count: GUEST_LIST[id].count,
      gender: GUEST_LIST[id].gender,
    };
  }

  if (directName) {
    return {
      name: decodeURIComponent(directName.replace(/\+/g, ' ')).trim(),
      count: directCount ? Math.min(4, Math.max(1, parseInt(directCount, 10) || 1)) : null,
      gender: null,
    };
  }

  return null;
}

// ИСПРАВЛЕНО: Теперь функция принимает весь объект гостя (guest)
function getDearGreeting(guest) {
  const name = guest.name;
  const lower = name.toLowerCase();
  
  if (lower.includes('семья') || lower.includes(' и ')) {
    return `Дорогие ${name}!`;
  }
  if (guest.gender === 'female') {
    return `Дорогая ${name}!`;
  }
  
  if (guest.gender === 'male') {
    return `Дорогой ${name}!`;
  }
  
  // 3. Запасной вариант (если gender не указан)
  return `Дорогой(ая) ${name}!`;
}


function applyPersonalization() {
  const guest = getGuestFromUrl();
  if (!guest) return null;

  const { name, count } = guest;
  // ИСПРАВЛЕНО: Передаем в функцию весь объект guest, а не только имя
  const dear = getDearGreeting(guest);

  document.title = `${name} — приглашение на свадьбу`;

  const heroLabel = document.getElementById('heroLabel');
  const heroGuest = document.getElementById('heroGuest');
  heroLabel.textContent = 'Именное приглашение';
  heroGuest.textContent = dear;
  heroGuest.hidden = false;

  const personal = document.getElementById('personal');
  document.getElementById('personalDear').textContent = dear;
  personal.hidden = false;

  const countdownGuest = document.getElementById('countdownGuest');
  countdownGuest.textContent = `${name}, до нашего дня осталось`;
  countdownGuest.hidden = false;

  document.getElementById('rsvpTitle').textContent = `${name}, подтвердите присутствие`;

  const nameInput = document.getElementById('name');
  nameInput.value = name;
  nameInput.readOnly = true;
  nameInput.classList.add('input--readonly');

  if (count) {
    const guestsSelect = document.getElementById('guests');
    guestsSelect.value = String(Math.min(4, count));
    /*if (count <= 4) {
      /*guestsSelect.disabled = true;
      guestsSelect.classList.add('input--readonly');
    }*/
  }

  return guest;
}

const guestInfo = applyPersonalization();

// ===== Countdown Timer =====
function updateCountdown() {
  const now = new Date();
  const diff = WEDDING_DATE - now;

  if (diff <= 0) {
    document.getElementById('days').textContent = '00';
    document.getElementById('hours').textContent = '00';
    document.getElementById('minutes').textContent = '00';
    document.getElementById('seconds').textContent = '00';
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  document.getElementById('days').textContent = String(days).padStart(2, '0');
  document.getElementById('hours').textContent = String(hours).padStart(2, '0');
  document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
  document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
}

setInterval(updateCountdown, 1000);
updateCountdown();

// ===== Navigation scroll effect =====
const nav = document.getElementById('nav');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 80);
});

// ===== Timeline animation on scroll =====
const timelineItems = document.querySelectorAll('.timeline__item');

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  },
  { threshold: 0.3 }
);

timelineItems.forEach((item) => observer.observe(item));

// ===== RSVP Form =====
const form = document.getElementById('rsvpForm');
const success = document.getElementById('rsvpSuccess');
const errorEl = document.getElementById('rsvpError');
const submitBtn = document.getElementById('rsvpSubmit');

function showRsvpSuccess() {
  form.hidden = true;
  errorEl.hidden = true;
  success.hidden = false;

  if (guestInfo) {
    const firstName = guestInfo.name.split(/[\s,]+/)[0];
    document.getElementById('rsvpSuccessTitle').textContent = `Спасибо, ${firstName}!`;
    document.getElementById('rsvpSuccessText').textContent =
      'Мы получили ваш ответ и с нетерпением ждём встречи на нашей свадьбе!';
  }

  success.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function showRsvpError(message) {
  errorEl.textContent = message;
  errorEl.hidden = false;
}

async function sendToGoogleSheets(data) {
  if (!GOOGLE_SCRIPT_URL) {
    throw new Error('Не настроена ссылка на Google Таблицу. Укажите GOOGLE_SCRIPT_URL в config.js');
  }

  const response = await fetch(GOOGLE_SCRIPT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Не удалось отправить ответ. Попробуйте позже.');
  }
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const params = new URLSearchParams(window.location.search);
  const data = {
    name: form.name.value.trim(),
    attendance: form.attendance.value,
    guests: form.guests.value,
    message: form.message.value.trim(),
    guestId: params.get('id') || '',
    timestamp: new Date().toISOString(),
  };

  submitBtn.disabled = true;
  submitBtn.textContent = 'Отправка...';
  errorEl.hidden = true;

  try {
    await sendToGoogleSheets(data);
    showRsvpSuccess();
  } catch (err) {
    showRsvpError(err.message || 'Произошла ошибка при отправке. Попробуйте ещё раз.');
    submitBtn.disabled = false;
    submitBtn.textContent = 'Отправить ответ';
  }
});