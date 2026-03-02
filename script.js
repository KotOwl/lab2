// Варіант 20: Вебсайт симулятора космічної експедиції

const expeditionsData = [
    { id: 'mars-01', name: 'Колонізація Марса', target: 'Марс', description: 'Перша пілотована місія для створення постійної бази на Червоній планеті. Тривалість: 2 роки.', difficulty: 'Висока' },
    { id: 'lunar-base', name: 'Місячна База Альфа', target: 'Місяць', description: 'Постачання ресурсів та розширення інфраструктури на Місяці. Тривалість: 3 місяці.', difficulty: 'Середня' },
    { id: 'europa-probe', name: 'Дослідження Європи', target: 'Супутник Юпітера (Європа)', description: 'Пошук позаземного життя під льодовим покривом супутника Юпітера. Тривалість: 5 років.', difficulty: 'Екстремальна' },
    { id: 'asteroid-mining', name: 'Видобуток на Астероїді', target: 'Пояс астероїдів', description: 'Видобуток рідкісних металів на астероїді Психея. Тривалість: 1 рік.', difficulty: 'Висока' }
];

// --- Завдання 1 та 3: Динамічне створення контенту та керування DOM за допомогою циклів ---

const expeditionsContainer = document.getElementById('expeditions-container');
const expeditionSelect = document.getElementById('expedition-select');

// 3.4. Використати цикл for для динамічного відображення списку елементів
// Варіант 20: 1. Використати цикл for для генерації списку доступних експедицій.
for (let i = 0; i < expeditionsData.length; i++) {
    const exp = expeditionsData[i];
    
    // Створення картки експедиції
    const card = document.createElement('div');
    card.className = 'expedition-card';
    card.dataset.id = exp.id; // Збереження ID в data-атрибуті
    
    // 1.3 Застосувати оператори if-else для зміни стилю на основі умов (індекс)
    if (i % 2 === 0) {
        card.style.borderLeft = '4px solid var(--primary-color)';
    } else {
        card.style.borderLeft = '4px solid var(--secondary-color)';
    }

    card.innerHTML = `
        <h3>${exp.name}</h3>
        <p><strong>Ціль:</strong> ${exp.target}</p>
        <p><strong>Рівень складності:</strong> <span class="difficulty-level">${exp.difficulty}</span></p>
        <div class="expedition-description">
            <p>${exp.description}</p>
            <button class="btn select-exp-btn" data-id="${exp.id}">Обрати для реєстрації</button>
        </div>
    `;
    
    expeditionsContainer.appendChild(card);

    // Додавання опцій у випадаючий список форми
    const option = document.createElement('option');
    option.value = exp.id;
    option.textContent = exp.name;
    expeditionSelect.appendChild(option);
}

// 1.1, 1.4: Використати querySelectorAll, щоб вибрати кілька елементів
const difficultyLevels = document.querySelectorAll('.difficulty-level');

// 1.2: Використати цикл for для циклічного перебору колекції елементів
for (let i = 0; i < difficultyLevels.length; i++) {
    const level = difficultyLevels[i];
    // 1.3: if-else для зміни стилю
    if (level.textContent === 'Екстремальна') {
        level.style.color = 'var(--secondary-color)';
        level.style.fontWeight = 'bold';
        level.style.textShadow = '0 0 5px var(--secondary-color)';
    } else if (level.textContent === 'Висока') {
        level.style.color = '#ff9900';
    } else {
        level.style.color = '#00ff00';
    }
}


// --- Завдання 2: Обробка подій та динамічні оновлення ---

const expeditionCards = document.querySelectorAll('.expedition-card');

// 2.3: Використати цикл for для додавання обробників подій до декількох елементів
for (let i = 0; i < expeditionCards.length; i++) {
    const card = expeditionCards[i];
    
    // Показати повний зміст при кліку (інтерактивність з Завдання 3.4)
    card.addEventListener('click', function(e) {
        // Уникнення конфлікту з кнопкою "Обрати"
        if(e.target.classList.contains('select-exp-btn')) return;
        
        // Перемикання класу для показу/сховання деталей
        if (this.classList.contains('show-desc')) {
            this.classList.remove('show-desc');
        } else {
            // Закрити інші відкриті картки
            for (let j = 0; j < expeditionCards.length; j++) {
                expeditionCards[j].classList.remove('show-desc');
            }
            this.classList.add('show-desc');
        }
    });

    // 2.4: Ефект наведення (зміна стилю/вмісту за допомогою JS та if-else)
    card.addEventListener('mouseenter', function() {
        if (!this.classList.contains('selected')) {
            this.style.backgroundColor = 'rgba(0, 240, 255, 0.05)';
        }
    });
    
    card.addEventListener('mouseleave', function() {
        if (!this.classList.contains('selected')) {
            this.style.backgroundColor = 'rgba(0, 0, 0, 0.4)';
        }
    });
}

// Обробка кнопок "Обрати для реєстрації" на картках
const selectBtns = document.querySelectorAll('.select-exp-btn');
for (let i = 0; i < selectBtns.length; i++) {
    // eslint-disable-next-line no-loop-func
    selectBtns[i].addEventListener('click', function() {
        const expId = this.getAttribute('data-id');
        expeditionSelect.value = expId;
        
        // Зняти виділення з усіх
        for (let j = 0; j < expeditionCards.length; j++) {
            expeditionCards[j].classList.remove('selected');
            expeditionCards[j].style.backgroundColor = 'rgba(0, 0, 0, 0.4)';
        }
        
        // Виділити обрану картку
        const parentCard = this.closest('.expedition-card');
        parentCard.classList.add('selected');
        parentCard.style.backgroundColor = 'rgba(255, 0, 85, 0.1)';
        
        // Прокрутити до форми реєстрації
        document.getElementById('registration-section').scrollIntoView({ behavior: 'smooth' });
    });
}


// --- Завдання 3: Динамічне керування контентом (Форма) ---

const registrationForm = document.getElementById('registration-form');
const regMessage = document.getElementById('registration-message');
const usersList = document.getElementById('users-list');
let currentRegisteredExpedition = null;

registrationForm.addEventListener('submit', function(e) {
    e.preventDefault(); // Запобігання перезавантаженню сторінки
    
    // 3.2: Збір даних та валідація if-else
    const name = document.getElementById('commander-name').value.trim();
    const email = document.getElementById('commander-email').value.trim();
    const expeditionId = document.getElementById('expedition-select').value;
    
    if (name === '' || email === '' || expeditionId === '') {
        regMessage.textContent = 'Помилка: Будь ласка, заповніть усі поля!';
        regMessage.className = 'error';
        regMessage.classList.remove('hidden');
    } else {
        // Формат успішний
        const expData = expeditionsData.find(exp => exp.id === expeditionId);
        currentRegisteredExpedition = expData;
        
        regMessage.innerHTML = `Успіх! Командир <strong>${name}</strong> зареєстрований на місію <strong>${expData.name}</strong>.`;
        regMessage.className = 'success';
        regMessage.classList.remove('hidden');
        
        // 3.3: Динамічне додавання даних користувача
        const userEntry = document.createElement('li');
        userEntry.innerHTML = `Командир: <strong>${name}</strong> (${email}) - Місія: <span style="color: var(--primary-color)">${expData.name}</span>`;
        usersList.appendChild(userEntry);
        
        // Оновлення поточної місії
        document.getElementById('current-mission-name').textContent = expData.name;
        document.getElementById('start-mission-btn').disabled = false;
        
        // Очищення форми
        registrationForm.reset();
        
        // Прокрутити до поточної місії
        document.getElementById('mission-section').scrollIntoView({ behavior: 'smooth' });
    }
});


// --- Завдання 2.1, 2.2 та Варіант 20 (Керування місією і Таймер) ---

const toggleMissionBtn = document.getElementById('toggle-mission-btn');
const missionPanel = document.getElementById('mission-control-panel');

// 2.1, 2.2: Кнопка перемикає видимість розділу з логікою if-else
toggleMissionBtn.addEventListener('click', function() {
    if (missionPanel.classList.contains('hidden')) {
        missionPanel.classList.remove('hidden');
        this.textContent = 'Сховати панель управління';
    } else {
        missionPanel.classList.add('hidden');
        this.textContent = 'Відкрити панель управління місією';
    }
});

let flightTimerInterval;
let flightSeconds = 0;
const startMissionBtn = document.getElementById('start-mission-btn');
const endMissionBtn = document.getElementById('end-mission-btn');
const missionStatus = document.getElementById('mission-status');
const flightTimerDisplay = document.getElementById('flight-timer');
const travelLog = document.getElementById('travel-log');

function formatTime(totalSeconds) {
    const h = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
    const s = (totalSeconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
}

function addToLog(message) {
    const now = new Date();
    const timeString = now.toLocaleTimeString();
    
    const logEntry = document.createElement('li');
    logEntry.innerHTML = `<span class="log-time">[${timeString}]</span> ${message}`;
    
    // Додаємо на початок списку
    travelLog.insertBefore(logEntry, travelLog.firstChild);
}

// Варіант 20: 2, 3: "Почати місію", зміна статусу, запис у журнал, таймер
startMissionBtn.addEventListener('click', function() {
    if (!currentRegisteredExpedition) return;
    
    // Зміна UI для активної місії
    missionStatus.textContent = 'У польоті';
    missionStatus.className = 'status-badge active';
    
    this.classList.add('hidden');
    endMissionBtn.classList.remove('hidden');
    document.getElementById('expedition-select').disabled = true; // Блокуємо зміну місії під час польоту
    
    addToLog(`Місія <strong>${currentRegisteredExpedition.name}</strong> успішно стартувала! Системи в нормі. Ціль: ${currentRegisteredExpedition.target}.`);
    
    // Запуск таймера тривалості польоту, що оновлюється в реальному часі
    flightSeconds = 0;
    flightTimerDisplay.textContent = formatTime(flightSeconds);
    clearInterval(flightTimerInterval);
    
    flightTimerInterval = setInterval(() => {
        flightSeconds++;
        flightTimerDisplay.textContent = formatTime(flightSeconds);
        
        // Випадкові події для журналу (просто для інтерактивності симулятора)
        if (flightSeconds > 0 && flightSeconds % 10 === 0) {
            const events = [
                'Коригування орбіти пройшло успішно.',
                'Перевірка систем життєзабезпечення: 100% працездатність.',
                'Отримано сигнал з командного центру Землі.',
                'Виявлено сонячний спалах, активовано магнітні щити.',
                'Проведено плановий аналіз навігаційних даних.'
            ];
            const randomEvent = events[Math.floor(Math.random() * events.length)];
            addToLog(randomEvent);
        }
    }, 1000);
});

endMissionBtn.addEventListener('click', function() {
    clearInterval(flightTimerInterval);
    
    missionStatus.textContent = 'Завершено';
    missionStatus.className = 'status-badge completed';
    
    this.classList.add('hidden');
    startMissionBtn.classList.remove('hidden');
    startMissionBtn.textContent = 'Почати нову місію';
    startMissionBtn.disabled = true; // Вимагає нової реєстрації
    
    document.getElementById('expedition-select').disabled = false;
    
    addToLog(`Місія <strong>${currentRegisteredExpedition.name}</strong> успішно завершена. Тривалість: ${formatTime(flightSeconds)}. Екіпаж у безпеці.`);
    currentRegisteredExpedition = null;
    
    setTimeout(() => {
        missionStatus.textContent = 'Очікування';
        missionStatus.className = 'status-badge standby';
        flightSeconds = 0;
        flightTimerDisplay.textContent = '00:00:00';
        document.getElementById('current-mission-name').textContent = 'Немає';
    }, 5000); // Скидання через 5 секунд
});

// Ініціалізація: показуємо навігацію
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        document.getElementById(targetId).scrollIntoView({ behavior: 'smooth' });
        
        // Оновлення активного класу
        document.querySelectorAll('nav a').forEach(a => a.classList.remove('active'));
        this.classList.add('active');
    });
});
