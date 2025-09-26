// Компонент страницы входа
export const renderLoginPage = () => {
    const container = document.querySelector('.container')

    container.innerHTML = `
        <div class="login-form">
            <h2 class="login-title">Вход в систему</h2>
            <form class="login-form-content" id="loginForm">
                <input 
                    type="text" 
                    class="login-input" 
                    placeholder="Введите логин" 
                    id="loginInput"
                    required
                />
                <input 
                    type="password" 
                    class="login-input" 
                    placeholder="Введите пароль" 
                    id="passwordInput"
                    required
                />
                <div class="login-buttons">
                    <button type="submit" class="login-button" id="loginButton">Войти</button>
                    <button type="button" class="register-button" id="registerButton">Зарегистрироваться</button>
                </div>
                <div class="login-error" id="loginError" style="display: none;"></div>
            </form>
        </div>
    `

    // Добавляем обработчики событий
    setupLoginHandlers()
}

// Настройка обработчиков для страницы входа
const setupLoginHandlers = () => {
    const loginForm = document.getElementById('loginForm')
    const registerButton = document.getElementById('registerButton')

    // Обработчик отправки формы входа
    loginForm.addEventListener('submit', handleLogin)

    // Обработчик кнопки регистрации
    registerButton.addEventListener('click', handleRegisterClick)
}

// Обработка входа
const handleLogin = async (event) => {
    event.preventDefault()

    const loginInput = document.getElementById('loginInput')
    const passwordInput = document.getElementById('passwordInput')
    const loginButton = document.getElementById('loginButton')
    const errorDiv = document.getElementById('loginError')

    const login = loginInput.value.trim()
    const password = passwordInput.value.trim()

    // Сброс ошибок
    errorDiv.style.display = 'none'
    loginInput.classList.remove('error')
    passwordInput.classList.remove('error')

    if (!login || !password) {
        showError('Заполните все поля')
        return
    }

    // Блокируем кнопку
    loginButton.disabled = true
    loginButton.textContent = 'Вход...'

    try {
        const requestData = {
            login: login,
            password: password,
        }

        const response = await fetch(
            'https://wedev-api.sky.pro/api/user/login',
            {
                method: 'POST',
                body: JSON.stringify(requestData),
            },
        )

        if (response.ok) {
            const data = await response.json()
            const user = data.user

            // Сохраняем данные пользователя в LocalStorage
            localStorage.setItem(
                'user',
                JSON.stringify({
                    id: user.id,
                    login: user.login,
                    name: user.name,
                    token: user.token,
                }),
            )

            // Импортируем и вызываем функцию для возврата на главную страницу
            const { renderMainPage } = await import('./mainPage.js')
            renderMainPage()
        } else if (response.status === 400) {
            const errorData = await response.json()
            showError(errorData.error || 'Неверный логин или пароль')
        } else {
            showError('Ошибка сервера. Попробуйте позже')
        }
    } catch {
        showError('Ошибка сети. Проверьте подключение к интернету')
    } finally {
        loginButton.disabled = false
        loginButton.textContent = 'Войти'
    }
}

// Обработка клика на кнопку регистрации
const handleRegisterClick = async () => {
    const { renderRegisterPage } = await import('./register.js')
    renderRegisterPage()
}

// Показать ошибку
const showError = (message) => {
    const errorDiv = document.getElementById('loginError')
    errorDiv.textContent = message
    errorDiv.style.display = 'block'

    // Подсвечиваем поля с ошибками
    document.getElementById('loginInput').classList.add('error')
    document.getElementById('passwordInput').classList.add('error')
}
