import { renderUsers } from './render.js'
import { write } from './writeButton.js'
import { fetchAndRenderTasks } from './fetchAndRenderTasks.js'

// Функция для получения данных пользователя из LocalStorage
export const getCurrentUser = () => {
    const userData = localStorage.getItem('user')
    return userData ? JSON.parse(userData) : null
}

// Функция для выхода из системы
export const logout = () => {
    localStorage.removeItem('user')
    renderMainPage()
}

// Главная страница приложения
export const renderMainPage = () => {
    const container = document.querySelector('.container')
    const currentUser = getCurrentUser()

    if (currentUser) {
        // Показываем страницу для авторизованного пользователя
        renderAuthorizedPage(currentUser)
    } else {
        // Показываем страницу для неавторизованного пользователя
        renderUnauthorizedPage()
    }
}

// Страница для авторизованного пользователя
const renderAuthorizedPage = (user) => {
    const container = document.querySelector('.container')

    container.innerHTML = `
        <div class="header">
            <div class="user-info">
                <span class="user-name">Привет, ${user.name}!</span>
                <button class="logout-button" id="logoutButton">Выйти</button>
            </div>
        </div>
        
        <!-- Индикатор загрузки -->
        <div class="loading" id="loading">
            <div class="loading-spinner"></div>
            <div class="loading-text">Загрузка комментариев...</div>
        </div>
        
        <ul class="comments"></ul>
        <div class="add-form">
            <input type="text" class="add-form-name" placeholder="Введите ваше имя" id="yourName" value="${user.name}" readonly />
            <textarea type="textarea" class="add-form-text" placeholder="Введите ваш комментарий" rows="4" id="yourComment"></textarea>
            <div class="add-form-row">
                <button class="add-form-button" id="write">Написать</button>
            </div>
        </div>
    `

    // Настраиваем обработчики
    setupAuthorizedHandlers()

    // Загружаем комментарии
    fetchAndRenderTasks()
}

// Страница для неавторизованного пользователя
const renderUnauthorizedPage = () => {
    const container = document.querySelector('.container')

    container.innerHTML = `
        <!-- Индикатор загрузки -->
        <div class="loading" id="loading">
            <div class="loading-spinner"></div>
            <div class="loading-text">Загрузка комментариев...</div>
        </div>
        
        <ul class="comments"></ul>
        
        <div class="auth-link">
            <a href="#" id="loginLink">Чтобы добавить комментарий, авторизуйтесь</a>
        </div>
    `

    // Настраиваем обработчики
    setupUnauthorizedHandlers()

    // Загружаем комментарии
    fetchAndRenderTasks()
}

// Настройка обработчиков для авторизованного пользователя
const setupAuthorizedHandlers = () => {
    const logoutButton = document.getElementById('logoutButton')
    logoutButton.addEventListener('click', logout)

    // Инициализируем функционал добавления комментариев
    write()
}

// Настройка обработчиков для неавторизованного пользователя
const setupUnauthorizedHandlers = () => {
    const loginLink = document.getElementById('loginLink')
    loginLink.addEventListener('click', async (event) => {
        event.preventDefault()
        const { renderLoginPage } = await import('./login.js')
        renderLoginPage()
    })
}
