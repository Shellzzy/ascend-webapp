// ===== Переключение вкладок / окон =====
function initTabs() {
  const tabs = document.querySelectorAll('.tab');
  const windows = document.querySelectorAll('.window');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.target;

      tabs.forEach(t => {
        t.classList.toggle('active', t === tab);
        t.setAttribute('aria-selected', t === tab ? 'true' : 'false');
      });

      windows.forEach(w => {
        w.classList.toggle('active', w.id === `window-${target}`);
      });
    });
  });

  // Лёгкое красное свечение при тапе внутрь активного окна
  windows.forEach(win => {
    win.addEventListener('click', () => {
      windows.forEach(w => w.classList.remove('focused'));
      win.classList.add('focused');
    });
  });
}

// ===== Загрузочный лог "дешифровки" (проигрывается один раз при входе) =====
const BOOT_LINES = [
  { text: '> CONNECTING TO SERVER...', okAfter: 260 },
  { text: '> INITIALIZING SENSORS...', okAfter: 220 },
  { text: '> DECRYPTING MAP DATA...', okAfter: 300 },
  { text: '> ACCESS GRANTED', ok: true },
];

function runBootLog() {
  const box = document.getElementById('boot-log');
  if (!box || box.dataset.played === 'true') return;
  box.dataset.played = 'true';

  box.classList.add('running');
  box.innerHTML = '';

  let delay = 0;
  BOOT_LINES.forEach((line, i) => {
    delay += i === 0 ? 150 : 320;
    setTimeout(() => {
      const el = document.createElement('div');
      el.className = 'line';
      el.textContent = line.text + (line.ok ? '  [OK]' : '');
      if (line.ok) el.classList.add('ok');
      box.appendChild(el);
    }, delay);
  });

  // прячем окно лога после того, как всё "продешифровалось"
  setTimeout(() => {
    box.classList.remove('running');
    box.classList.add('done');
  }, delay + 700);
}

// Делаем доступной глобально, чтобы script.js мог вызвать сразу после сплэша
window.startBootSequence = runBootLog;

document.addEventListener('DOMContentLoaded', initTabs);
