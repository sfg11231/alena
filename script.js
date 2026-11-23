
// ===================================
// НАВИГАЦИЯ ПО САЙТУ
// ===================================

function nextScreen(screenId) {
  document.querySelectorAll(".screen").forEach(screen => {
    screen.classList.remove("active");
  });

  const target = document.getElementById(screenId);

  if (target) {
    target.classList.add("active");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

// ===================================
// МУЗЫКА
// ===================================

const music = document.getElementById("backgroundMusic");
const musicButton = document.getElementById("musicButton");

let musicPlaying = false;

function toggleMusic() {
  if (!music) return;

  if (musicPlaying) {
    music.pause();

    if (musicButton) {
      musicButton.classList.remove("playing");
      musicButton.textContent = "♫";
    }

    musicPlaying = false;
  } else {
    music.play().then(() => {
      if (musicButton) {
        musicButton.classList.add("playing");
        musicButton.textContent = "♪";
      }

      musicPlaying = true;
    }).catch(() => {
      musicPlaying = false;
    });
  }
}

// ===================================
// ПЕРВЫЙ ЭКРАН
// ===================================

function startAdventure() {
  nextScreen("questionScreen");
  resetQuestion();
}

// ===================================
// ИГРА «ТЫ СЧАСТЛИВА?»
// ===================================

const runawayPhrases = [
  "Еще раз",
  "Ну че случилось",
  "Повтори еще раз",
  "Не так просто попасть?",
  "Ты прям снайпер"
];

let runawayCount = 0;

let yesButton = document.getElementById("yesButton");
let answerArea = document.getElementById("answerButtons");
let runawayMessage = document.getElementById("runawayMessage");

function resetQuestion() {
  runawayCount = 0;

  if (yesButton) {
    yesButton.style.left = "20px";
    yesButton.style.top = "25px";
    yesButton.style.position = "absolute";
  }

  if (runawayMessage) {
    runawayMessage.textContent = "";
  }
}

function moveYesButton() {
  if (!yesButton || !answerArea) return;

  // После пяти уворачиваний кнопка перестает убегать
  if (runawayCount >= 5) return;

  const maxX = answerArea.clientWidth - yesButton.offsetWidth;
  const maxY = answerArea.clientHeight - yesButton.offsetHeight;

  const randomX = Math.random() * Math.max(0, maxX);
  const randomY = Math.random() * Math.max(0, maxY);

  yesButton.style.left = randomX + "px";
  yesButton.style.top = randomY + "px";

  runawayMessage.textContent = runawayPhrases[runawayCount];

  runawayCount++;
}

function catchYes() {
  nextScreen("yesScreen");
  createPetals(35);
}

function answerNo() {
  nextScreen("noScreen");
}

function retryQuestion() {
  nextScreen("questionScreen");
  resetQuestion();
}

function continueAdventure() {
  resetAccess();
  nextScreen("accessScreen");
}

if (yesButton) {
  yesButton.addEventListener("mouseenter", moveYesButton);

  yesButton.addEventListener("touchstart", function(event) {
    if (runawayCount < 5) {
      event.preventDefault();
      moveYesButton();
    }
  }, { passive: false });

  yesButton.addEventListener("click", catchYes);
}

// ===================================
// СЕКРЕТНЫЙ ТЕРМИНАЛ «ДОСТУП АЛЁНЕ»
// ===================================

const terminalContent = document.getElementById("terminalContent");
const accessIntro = document.getElementById("accessIntro");
const accessStartButton = document.getElementById("accessStartButton");

const passwordSection = document.getElementById("passwordSection");
const passwordInput = document.getElementById("passwordInput");
const passwordButton = document.getElementById("passwordButton");
const passwordError = document.getElementById("passwordError");

const accessGranted = document.getElementById("accessGranted");
const secretMessage = document.getElementById("secretMessage");
const accessContinueButton = document.getElementById("accessContinueButton");

let accessStarted = false;
let accessUnlocked = false;

// Сброс терминала при повторном входе
function resetAccess() {
  accessStarted = false;
  accessUnlocked = false;

  if (accessIntro) {
    accessIntro.style.display = "";
  }

  if (passwordSection) {
    passwordSection.classList.remove("show");
    passwordSection.style.display = "";
  }

  if (accessGranted) {
    accessGranted.classList.remove("show");
    accessGranted.style.display = "";
  }

  if (passwordInput) {
    passwordInput.value = "";
    passwordInput.disabled = false;
  }

  if (passwordButton) {
    passwordButton.disabled = false;
    passwordButton.textContent = "Авторизоваться";
  }

  if (passwordError) {
    passwordError.textContent = "";
    passwordError.classList.remove("shake");
  }

  if (accessStartButton) {
    accessStartButton.disabled = false;
  }

  if (accessContinueButton) {
    accessContinueButton.disabled = false;
  }

  // Возвращаем системные строки в исходное состояние
  if (terminalContent) {
    terminalContent.querySelectorAll(".terminal-line").forEach(line => {
      line.style.opacity = "1";
      line.style.transform = "none";
    });
  }

  // Скрываем секретное сообщение до разблокировки
  if (secretMessage) {
    secretMessage.querySelectorAll("p").forEach(p => {
      p.style.display = "";
      p.style.opacity = "1";
      p.style.transform = "none";
    });
  }
}

// Начало авторизации
function startAccess() {
  if (accessStarted) return;

  accessStarted = true;

  if (accessIntro) {
    accessIntro.style.display = "none";
  }

  if (terminalContent) {
    const lines = terminalContent.querySelectorAll(".terminal-line");

    // Скрываем строки перед анимацией
    lines.forEach(line => {
      line.style.opacity = "0";
      line.style.transform = "translateX(-8px)";
      line.style.transition = "opacity 0.5s, transform 0.5s";
    });

    // Последовательно выводим текст терминала
    lines.forEach((line, index) => {
      setTimeout(() => {
        line.style.opacity = "1";
        line.style.transform = "translateX(0)";
      }, 450 + index * 650);
    });

    // Показываем загадку после завершения вывода
    setTimeout(() => {
      if (passwordSection) {
        passwordSection.classList.add("show");
      }

      if (passwordInput) {
        passwordInput.focus();
      }
    }, 450 + lines.length * 650);
  } else {
    if (passwordSection) {
      passwordSection.classList.add("show");
    }
  }
}

// Проверка пароля
function checkPassword() {
  if (!passwordInput || accessUnlocked) return;

  const password = passwordInput.value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "");

  const correctPasswords = ["июль", "07", "july"];

  if (correctPasswords.includes(password)) {
    unlockAccess();
  } else {
    showPasswordError();
  }
}

// Ошибка пароля
function showPasswordError() {
  const errorMessages = [
    "Доступ отклонён. Попробуй вспомнить.",
    "Система не согласна. Подумай ещё.",
    "Неверный ответ. Но я верю, что ты знаешь.",
    "Подсказка: это был летний месяц.",
    "Ошибка... Моё сердце знает правильный ответ."
  ];

  if (passwordError) {
    passwordError.textContent =
      errorMessages[Math.floor(Math.random() * errorMessages.length)];

    passwordError.classList.remove("shake");

    // Перезапуск анимации ошибки
    void passwordError.offsetWidth;

    passwordError.classList.add("shake");
  }

  if (passwordInput) {
    passwordInput.focus();
  }
}

// Успешная авторизация
function unlockAccess() {
  accessUnlocked = true;

  if (passwordSection) {
    passwordSection.classList.remove("show");
  }

  if (accessGranted) {
    accessGranted.classList.add("show");
  }

  if (passwordInput) {
    passwordInput.disabled = true;
  }

  createPetals(35);

  // Секретное сообщение раскрывается постепенно
  if (secretMessage) {
    const paragraphs = secretMessage.querySelectorAll("p");

    paragraphs.forEach((p, index) => {
      p.style.opacity = "0";
      p.style.transform = "translateY(12px)";
      p.style.transition = "opacity 1s ease, transform 1s ease";

      setTimeout(() => {
        p.style.opacity = "1";
        p.style.transform = "translateY(0)";
      }, 1200 + index * 1800);
    });
  }
}

// Переход к письму
function finishAccess() {
  if (!accessUnlocked) return;

  createPetals(25);
  nextScreen("letterScreen");
}

// Вход по Enter
if (passwordInput) {
  passwordInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
      checkPassword();
    }
  });
}

// ===================================
// ТАЙМЕР ДО ДНЯ РОЖДЕНИЯ
// ===================================

const birthdayDate = new Date(2026, 11, 5, 0, 0, 0);

function updateCountdown() {
  const now = new Date();
  const diff = birthdayDate - now;

  if (diff <= 0) {
    activateBirthdayMode();
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  setText("days", days);
  setText("hours", hours);
  setText("minutes", minutes);
  setText("seconds", seconds);
}

let birthdayActivated = false;

function activateBirthdayMode() {
  if (birthdayActivated) return;

  birthdayActivated = true;

  const countdownBox = document.getElementById("countdownBox");
  const celebration = document.getElementById("birthdayCelebration");
  const startButton = document.getElementById("startButton");
  const welcomeTitle = document.querySelector("#welcome h1");
  const welcomeText = document.querySelector("#welcome .welcome-text");
  const dateText = document.getElementById("dateText");

  if (countdownBox) countdownBox.style.display = "none";
  if (celebration) celebration.classList.add("show");

  if (welcomeTitle) {
    welcomeTitle.textContent = "С днём рождения, любимая!";
  }

  if (welcomeText) {
    welcomeText.innerHTML =
      "Сегодня особенный день.<br>И я хочу сделать его чуточку теплее.";
  }

  if (startButton) {
    startButton.textContent = "Открыть твой подарок";
  }

  if (dateText) {
    dateText.textContent = "Сегодня твой день ♡";
  }

  createPetals(25);
}

updateCountdown();
setInterval(updateCountdown, 1000);

// ===================================
// ТАЙМЕР НАШИХ ОТНОШЕНИЙ
// ===================================

const relationshipStart = new Date(2025, 6, 5, 0, 0, 0);

function updateRelationshipTimer() {
  const now = new Date();
  let diff = now - relationshipStart;

  if (diff < 0) diff = 0;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  setText("relDays", days);
  setText("relHours", hours);
  setText("relMinutes", minutes);
  setText("relSeconds", seconds);
}

updateRelationshipTimer();
setInterval(updateRelationshipTimer, 1000);

// ===================================
// ВСПОМОГАТЕЛЬНАЯ ФУНКЦИЯ
// ===================================

function setText(id, value) {
  const element = document.getElementById(id);
  if (element) element.textContent = value;
}

// ===================================
// ФОТОГАЛЕРЕЯ
// ===================================

function openPhoto(img) {
  const viewer = document.getElementById("photoViewer");
  const viewerImage = document.getElementById("viewerImage");

  if (!viewer || !viewerImage) return;

  viewerImage.src = img.src;
  viewer.classList.add("show");
}

function closePhoto() {
  const viewer = document.getElementById("photoViewer");
  if (viewer) viewer.classList.remove("show");
}

// ===================================
// 100 ПРИЧИН, ПОЧЕМУ Я ЛЮБЛЮ ТЕБЯ
// ===================================

const reasons = [
  "За твою улыбку.",
  "За твой смех.",
  "За твои глаза.",
  "За то, как ты смотришь на меня.",
  "За твой голос.",
  "За твои объятия.",
  "За твои поцелуи.",
  "За то, что ты рядом.",
  "За твою заботу.",
  "За твою нежность.",
  "За Пипона.",
  "За Боню.",
  "За твой характер.",
  "За твою искренность.",
  "За то, что ты настоящая.",
  "За твои маленькие привычки.",
  "За то, как ты радуешься мелочам.",
  "За то, как ты смотришь на любимые вещи.",
  "За твои эмоции.",
  "За твои тик токи.",
  "За твою доброту.",
  "За то, что с тобой уютно.",
  "За то, что рядом с тобой я могу быть собой.",
  "За наши разговоры.",
  "За наши шутки.",
  "За наши воспоминания.",
  "За наши поездки.",
  "За наши прогулки.",
  "За наши вечера.",
  "За то, что даже обычный день с тобой особенный.",
  "За то, что ты умеешь слушать.",
  "За то, что ты замечаешь детали.",
  "За твою красоту.",
  "За твою улыбку, когда ты смущаешься.",
  "За твои смешные реакции.",
  "За твою непосредственность.",
  "За твою силу.",
  "За то, что ты не сдаёшься.",
  "За то, что ты вдохновляешь меня.",
  "За то, что ты веришь в меня.",
  "За то, что помогаешь мне становиться лучше.",
  "За то, что разделяешь со мной моменты.",
  "За то, что ты умеешь создавать уют.",
  "За то, как ты выбираешь одежду.",
  "За твой стиль.",
  "За то, как ты пахнешь.",
  "За то, что я скучаю по тебе.",
  "За то, что мне хочется скорее увидеть тебя.",
  "За то, что я думаю о тебе.",
  "За то, что ты стала частью моей жизни.",
  "За то, что мы встретились.",
  "За то, что у нас есть своя история.",
  "За то, что мы прошли уже многое.",
  "За то, что впереди нас ждёт ещё больше.",
  "За то, что ты моя любимая.",
  "За то, что ты мой самый близкий человек.",
  "За то, что ты умеешь сделать мой день лучше.",
  "За твоё терпение.",
  "За твою внимательность.",
  "За твою ласку.",
  "За то, как ты произносишь моё имя.",
  "За то, что ты умеешь быть рядом даже молча.",
  "За то, что с тобой не страшно мечтать.",
  "За то, что у нас есть общие планы.",
  "За наши маленькие традиции.",
  "За то, что ты умеешь удивлять.",
  "За то, что ты иногда вредничаешь.",
  "За то, что можешь быть смешной.",
  "За то, что ты умеешь быть серьёзной.",
  "За то, что ты умеешь быть нежной.",
  "За то, что ты не похожа ни на кого.",
  "За то, что ты уникальная.",
  "За твоё тепло.",
  "За твою душу.",
  "За то, что ты делаешь меня счастливее.",
  "За то, что мне хочется заботиться о тебе.",
  "За то, что мне хочется радовать тебя.",
  "За то, что я хочу дарить тебе цветы.",
  "За то, что я хочу проводить с тобой выходные.",
  "За то, что я хочу путешествовать с тобой.",
  "За то, что я хочу увидеть с тобой мир.",
  "За то, что мне нравится выбирать подарки тебе.",
  "За то, что я хочу запоминать каждый наш день.",
  "За то, что ты моя радость.",
  "За то, что ты моё вдохновение.",
  "За то, что ты мой дом, где бы мы ни были.",
  "За то, что рядом с тобой мне спокойно.",
  "За то, что ты умеешь дать мне силы.",
  "За то, что я могу делиться с тобой всем.",
  "За то, что мы можем смеяться над глупостями.",
  "За то, что мы можем мечтать вместе.",
  "За то, что ты принимаешь меня.",
  "За то, что я принимаю тебя.",
  "За то, что мы учимся друг у друга.",
  "За то, что с тобой хочется идти дальше.",
  "За то, что я хочу быть рядом в хорошие дни.",
  "За то, что я хочу быть рядом и в сложные дни.",
  "За то, что я хочу видеть твою улыбку каждый день.",
  "За то, что ты — это ты.",
  "И просто за то, что я люблю тебя."
];

function renderReasons() {
  const container = document.getElementById("reasonsList");
  if (!container) return;

  container.innerHTML = "";

  reasons.forEach((reason, index) => {
    const item = document.createElement("div");
    item.className = "reason";

    const number = document.createElement("span");
    number.textContent = (index + 1) + ".";

    const text = document.createElement("span");
    text.textContent = reason;

    item.appendChild(number);
    item.appendChild(text);

    container.appendChild(item);
  });
}

renderReasons();

// ===================================
// ПОДАРКИ
// ===================================

const giftMessages = [
  "Мой первый подарок — тысяча поцелуев, которые я пока не успел тебе подарить. Но обязательно подарю.",
  "Мой второй подарок — одно свидание, которое я организую для нас. Только ты, я и прекрасный день.",
  "Мой третий подарок — обещание продолжать создавать с тобой воспоминания, которые мы будем хранить долгие годы."
];

function openGift(index) {
  const message = document.getElementById("giftMessage");
  if (!message) return;

  message.textContent = giftMessages[index] || "";
  createPetals(8);
}

// ===================================
// ПЛАВАЮЩИЕ СЕРДЕЧКИ
// ===================================

const heartContainer = document.getElementById("backgroundHearts");

function createFloatingHeart() {
  if (!heartContainer) return;

  const heart = document.createElement("div");
  heart.className = "floating-heart";

  const hearts = ["♡", "♥", "❤", "❥"];
  heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];

  heart.style.left = Math.random() * 100 + "%";
  heart.style.fontSize = (12 + Math.random() * 24) + "px";
  heart.style.animationDuration = (8 + Math.random() * 10) + "s";

  heartContainer.appendChild(heart);

  setTimeout(() => heart.remove(), 18000);
}

setInterval(createFloatingHeart, 1000);

// ===================================
// ЛЕПЕСТКИ
// ===================================

function createPetals(count = 15) {
  const container = document.getElementById("petalsContainer");
  if (!container) return;

  for (let i = 0; i < count; i++) {
    const petal = document.createElement("div");
    petal.className = "petal";
    petal.textContent = Math.random() > 0.5 ? "♡" : "♥";

    petal.style.left = Math.random() * 100 + "%";
    petal.style.fontSize = (12 + Math.random() * 20) + "px";
    petal.style.animationDuration = (4 + Math.random() * 5) + "s";
    petal.style.animationDelay = (Math.random() * 2) + "s";

    container.appendChild(petal);

    setTimeout(() => petal.remove(), 10000);
  }
}
