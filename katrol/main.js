


const containsOnlyDigits = (str) => {
    const regExp = /^\d+$/;
    return regExp.test(str);
};

console.log('1) "12345":', containsOnlyDigits('12345')); 
console.log('1) "12a45":', containsOnlyDigits('12a45')); 



const startSecondLogger = () => {
    let seconds = 0;
    return setInterval(() => {
        seconds += 1;
        console.log(`Прошла секунда // ${seconds}`);
    }, 1000);
};


const secondTimerId = startSecondLogger();





const count = () => {
    let i = 1;
    const interval = setInterval(() => {
        console.log('3) Счётчик:', i);
        if (i >= 10) {
            clearInterval(interval);
        }
        i += 1;
    }, 1000);
};

count();



const initCountdownTimer = () => {
    const displayEl = document.querySelector('#timerDisplay');
    const startBtn = document.querySelector('#startBtn');
    const stopBtn = document.querySelector('#stopBtn');
    const resetBtn = document.querySelector('#resetBtn');

    let timeLeft = 10;
    let countdownId = null;

    const renderTime = () => {
        if (displayEl) {
            displayEl.textContent = timeLeft;
        }
    };

    const stopTimer = () => {
        if (countdownId !== null) {
            clearInterval(countdownId);
            countdownId = null;
        }
    };

    const startTimer = () => {
        if (countdownId !== null || timeLeft <= 0) return;

        countdownId = setInterval(() => {
            timeLeft -= 1;
            renderTime();

            if (timeLeft <= 0) {
                timeLeft = 0;
                renderTime();
                stopTimer();
            }
        }, 1000);
    };

    const resetTimer = () => {
        stopTimer();
        timeLeft = 10;
        renderTime();
    };

    renderTime();
    if (startBtn) startBtn.addEventListener('click', startTimer);
    if (stopBtn) stopBtn.addEventListener('click', stopTimer);
    if (resetBtn) resetBtn.addEventListener('click', resetTimer);
};

initCountdownTimer();




const initColorBox = () => {
    
    let box = document.querySelector('.color-box');
    if (!box) {
        box = document.createElement('div');
        box.className = 'color-box';
        box.style.width = '150px';
        box.style.height = '150px';
        box.style.border = '1px solid #333';
        box.style.margin = '10px 0';
        document.body.append(box);
    }

    
    box.addEventListener('click', () => {
        box.classList.toggle('active-bg');
        box.style.backgroundColor = box.classList.contains('active-bg')
            ? 'lightblue'
            : '';
    });
};

initColorBox();



const loadTestJson = () => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', './test.json');
    xhr.responseType = 'json';

    xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
            console.log('6) Данные из test.json:', xhr.response);
        } else {
            console.warn('6) Ошибка загрузки test.json. Статус:', xhr.status);
        }
    };

    xhr.onerror = () => {
        console.warn('6) Сетевая ошибка при запросе test.json');
    };

    xhr.send();
};

loadTestJson();




const initUserSearch = () => {
    const loginInput = document.querySelector('#loginInput');
    const checkBtn = document.querySelector('#checkBtn');
    const userCard = document.querySelector('#userCard');
    const messageEl = document.querySelector('#message');

    if (!loginInput || !checkBtn || !userCard || !messageEl) return;

    checkBtn.addEventListener('click', () => {
        const queryLogin = loginInput.value.trim().toLowerCase();
        userCard.innerHTML = '';
        messageEl.textContent = '';

        if (!queryLogin) {
            messageEl.textContent = 'Введите логин для поиска';
            return;
        }

        const xhr = new XMLHttpRequest();
        xhr.open('GET', './users.json');

        xhr.onload = () => {
            if (xhr.status < 200 || xhr.status >= 300) {
                messageEl.textContent = `Ошибка запроса (${xhr.status}). Не удалось загрузить пользователей.`;
                return;
            }

            try {
                const users = JSON.parse(xhr.responseText);
                const foundUser = users.find(
                    (u) => u.login.toLowerCase() === queryLogin
                );

                if (!foundUser) {
                    messageEl.textContent = `Пользователь с логином "${loginInput.value.trim()}" не найден`;
                    return;
                }

                userCard.innerHTML = `
                    <div class="user-card">
                        ${foundUser.image ? `<img src="${foundUser.image}" alt="${foundUser.login}">` : ''}
                        <h3>Логин: ${foundUser.login}</h3>
                        <p>Роль: ${foundUser.role}</p>
                        <p>Email: ${foundUser.email}</p>
                    </div>
                `;
            } catch (err) {
                messageEl.textContent = 'Ошибка чтения данных из users.json';
            }
        };

        xhr.onerror = () => {
            messageEl.textContent = 'Ошибка сети при обращении к users.json';
        };

        xhr.send();
    });
};

initUserSearch();





const fetchUserMock = () =>
    new Promise((resolve) => {
        setTimeout(() => resolve({ user: 'Alim' }), 1000);
    });

const fetchPostsMock = () =>
    new Promise((resolve) => {
        setTimeout(() => resolve(['Post 1', 'Post 2']), 2000);
    });

const fetchCommentsMock = () =>
    new Promise((resolve, reject) => {
        setTimeout(() => {
            
            const shouldReject = false;
            if (shouldReject) {
                reject(new Error('Не удалось загрузить комментарии'));
            } else {
                resolve(['Comment A', 'Comment B']);
            }
        }, 3000);
    });

Promise.all([fetchUserMock(), fetchPostsMock(), fetchCommentsMock()])
    .then(([userData, postsData, commentsData]) => {
        console.log('8) Объединённый результат Promise.all:', {
            user: userData,
            posts: postsData,
            comments: commentsData,
        });
    })
    .catch((error) => {
        console.warn('8) Ошибка в Promise.all:', error.message);



const getUserData = async (id) => {
    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);
        if (!response.ok) {
            throw new Error(`HTTP ошибка: ${response.status}`);
        }
        const user = await response.json();
        console.log(`9) Данные пользователя ${id}:`, user);
        return user;
    } catch (error) {
        console.warn('9) Ошибка при получении пользователя:', error.message);
    } finally {
        console.log('Запрос завершён');
    }
};

getUserData(1);
const createPhoto = async (photoPayload) => {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/photos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify(photoPayload),
        });

        if (!response.ok) {
            throw new Error(`Ошибка сервера: ${response.status}`);
        }

        const createdPhoto = await response.json();
        console.log('10) Ответ сервера на POST /photos:', createdPhoto);
        return createdPhoto;
    } catch (error) {
        console.warn('10) Ошибка при отправке POST-запроса:', error.message);
    }
};

createPhoto({
    title: 'Test photo',
    url: 'https://via.placeholder.com/600',
    thumbnailUrl: 'https://via.placeholder.com/150',
});