import { renderUsers } from './render.js'
import { updateUsers } from './users.js'

let isLoading = false

export const fetchAndRenderTasks = () => {
    if (isLoading) {
        return Promise.resolve()
    }

    isLoading = true

    // Показываем индикатор загрузки
    const loadingEl = document.getElementById('loading')
    if (loadingEl) {
        loadingEl.classList.remove('hidden')
    }

    // Загружаем комментарии с сервера
    return fetch('https://wedev-api.sky.pro/api/v2/dmitry-karabanov/comments')
        .then((response) => {
            // Проверяем статус ответа
            if (response.status === 500) {
                // Обработка 500-й ошибки (ошибка сервера)
                alert(
                    'Ошибка сервера при загрузке комментариев. Попробуйте обновить страницу позже.',
                )
                throw new Error('500 Internal Server Error')
            }

            if (!response.ok) {
                // Обработка других ошибок
                alert(`Ошибка при загрузке комментариев: ${response.status}`)
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            // Преобразуем ответ в JSON
            return response.json()
        })
        .then((data) => {
            // Инициализируем свойство isLikeLoading для каждого комментария
            const commentsWithLoading = data.comments.map((comment) => ({
                ...comment,
                isLikeLoading: false,
            }))

            // Обновляем массив пользователей данными с сервера
            updateUsers(commentsWithLoading)
            // Отрисовываем комментарии на странице
            renderUsers()

            // Скрываем индикатор загрузки
            if (loadingEl) {
                loadingEl.classList.add('hidden')
            }
            isLoading = false
        })
        .catch((error) => {
            // Обработка ошибок сети и других ошибок
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                // Ошибка сети (нет интернета)
                alert(
                    'Ошибка сети при загрузке комментариев. Проверьте подключение к интернету и попробуйте обновить страницу.',
                )
            } else if (error.message.includes('500')) {
                // 500-я ошибка уже обработана выше
            } else if (!error.message.includes('HTTP error')) {
                // Другие ошибки (кроме уже обработанных HTTP ошибок)
                alert('Произошла неизвестная ошибка при загрузке комментариев.')
            }

            // Скрываем индикатор загрузки даже при ошибке
            if (loadingEl) {
                loadingEl.classList.add('hidden')
            }
            isLoading = false
        })
}
