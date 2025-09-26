// Компонент страницы регистрации
export const renderRegisterPage = () => {
    const container = document.querySelector('.container')

    container.innerHTML = `
        <div class="login-form">
            <h2 class="login-title">Регистрация</h2>
            <form class="login-form-content" id="registerForm">
                <input 
                    type="text" 
                    class="login-input" 
                    placeholder="Введите логин" 
                    id="registerLoginInput"
                    required
                />
                <input 
                    type="text" 
                    class="login-input" 
                    placeholder="Введите имя" 
                    id="registerNameInput"
                    required
                />
                <input 
                    type="password" 
                    class="login-input" 
                    placeholder="Введите пароль" 
                    id="registerPasswordInput"
                    required
                />
                <div class="login-buttons">
                    <button type="submit" class="login-button" id="registerSubmitButton">Зарегистрироваться</button>
                    <button type="button" class="register-button" id="backToLoginButton">Вернуться к входу</button>
                </div>
                <div class="login-error" id="registerError" style="display: none;"></div>
            </form>
        </div>
    `

    // Добавляем обработчики событий
    setupRegisterHandlers()
}

// Настройка обработчиков для страницы регистрации
const setupRegisterHandlers = () => {
    const registerForm = document.getElementById('registerForm')
    const backToLoginButton = document.getElementById('backToLoginButton')

    // Обработчик отправки формы регистрации
    registerForm.addEventListener('submit', handleRegister)

    // Обработчик кнопки возврата к входу
    backToLoginButton.addEventListener('click', handleBackToLogin)
}

// Обработка регистрации
const handleRegister = async (event) => {
    event.preventDefault()

    const loginInput = document.getElementById('registerLoginInput')
    const nameInput = document.getElementById('registerNameInput')
    const passwordInput = document.getElementById('registerPasswordInput')
    const registerButton = document.getElementById('registerSubmitButton')
    const errorDiv = document.getElementById('registerError')

    const login = loginInput.value.trim()
    const name = nameInput.value.trim()
    const password = passwordInput.value.trim()

    // Сброс ошибок
    errorDiv.style.display = 'none'
    loginInput.classList.remove('error')
    nameInput.classList.remove('error')
    passwordInput.classList.remove('error')

    if (!login || !name || !password) {
        showRegisterError('Заполните все поля')
        return
    }

    if (password.length < 6) {
        showRegisterError('Пароль должен содержать минимум 6 символов')
        return
    }

    // Блокируем кнопку
    registerButton.disabled = true
    registerButton.textContent = 'Регистрация...'

    try {
        const requestData = {
            login: login,
            name: name,
            password: password,
        }

        const response = await fetch('https://wedev-api.sky.pro/api/user', {
            method: 'POST',
            body: JSON.stringify(requestData),
        })

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
            showRegisterError(
                errorData.error ||
                    'Пользователь с таким логином уже существует',
            )
        } else {
            showRegisterError('Ошибка сервера. Попробуйте позже')
        }
    } catch (error) {
        showRegisterError('Ошибка сети. Проверьте подключение к интернету')
    } finally {
        registerButton.disabled = false
        registerButton.textContent = 'Зарегистрироваться'
    }
}

// Обработка возврата к странице входа
const handleBackToLogin = async () => {
    const { renderLoginPage } = await import('./login.js')
    renderLoginPage()
}

// Показать ошибку регистрации
const showRegisterError = (message) => {
    const errorDiv = document.getElementById('registerError')
    errorDiv.textContent = message
    errorDiv.style.display = 'block'

    // Подсвечиваем поля с ошибками
    document.getElementById('registerLoginInput').classList.add('error')
    document.getElementById('registerNameInput').classList.add('error')
    document.getElementById('registerPasswordInput').classList.add('error')
}
