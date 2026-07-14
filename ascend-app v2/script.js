// ===== Инициализация Telegram Web App =====
const tg = window.Telegram?.WebApp;

if (tg) {
  tg.ready();
  tg.expand(); // раскрыть на весь экран
  tg.setHeaderColor?.('#000000');
  tg.setBackgroundColor?.('#000000');
  tg.disableVerticalSwipes?.(); // запретить сворачивание свайпом вниз, если метод доступен
}

const splash = document.getElementById('splash');
const splashVideo = document.getElementById('splash-video');
const app = document.getElementById('app');

// ===== Блокировка касаний/жестов на время сплэша =====
function blockEvent(e) {
  e.preventDefault();
  e.stopPropagation();
}

const blockedEvents = ['touchstart', 'touchmove', 'touchend', 'gesturestart', 'contextmenu'];
blockedEvents.forEach(evt => {
  document.addEventListener(evt, blockEvent, { passive: false });
});

// ===== Переход к основному приложению =====
let finished = false;

function finishSplash() {
  if (finished) return;
  finished = true;

  splash.classList.add('fade-out');

  setTimeout(() => {
    splash.remove();

    blockedEvents.forEach(evt => {
      document.removeEventListener(evt, blockEvent);
    });

    document.documentElement.style.touchAction = 'auto';
    document.body.style.touchAction = 'auto';
    document.body.style.overflow = 'auto';

    app.classList.remove('hidden');
    requestAnimationFrame(() => app.classList.add('visible'));
    window.startBootSequence?.();
  }, 500); // должно совпадать с transition в CSS (.splash)
}

// Диагностика: если видео не загрузилось (неверный путь, битый файл и т.п.),
// это будет видно в консоли браузера (F12 -> Console).
splashVideo.addEventListener('error', () => {
  console.error(
    'Не удалось загрузить видео сплэша. Проверь, что файл лежит по пути "assets/splash.mp4" ' +
    'относительно index.html и что имя файла совпадает с указанным в src.',
    splashVideo.error
  );
});

// Основной сценарий: ждём, когда видео доиграет до конца само
splashVideo.addEventListener('ended', finishSplash);

// Подстраховка на случай, если автовоспроизведение
// заблокировано системой (редко, но бывает на некоторых WebView) —
// не даём пользователю застрять на чёрном экране навсегда.
splashVideo.addEventListener('loadedmetadata', () => {
  const durationMs = (splashVideo.duration || 4) * 1000;
  setTimeout(finishSplash, durationMs + 500); // небольшой запас
});

// Если play() не срабатывает сразу (некоторые мобильные браузеры
// требуют явного вызова даже при наличии атрибута autoplay)
splashVideo.play().catch(() => {
  // если совсем не удалось запустить видео — не блокируем пользователя,
  // отрабатываем запасной таймер на 4 секунды
  setTimeout(finishSplash, 4000);
});
