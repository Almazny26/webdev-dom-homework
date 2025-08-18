import { renderUsers } from './render.js'
import { updateUsers } from './users.js'

export const fetchAndRenderTasks = () => {
    // Показываем индикатор загрузки
    const loadingEl = document.getElementById('loading')
    if (loadingEl) {
        loadingEl.classList.remove('hidden')
    }

    // Загружаем комментарии с сервера
    return fetch('https://wedev-api.sky.pro/api/v1/dmitry-karabanov/comments')
        .then((response) => {
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
        })
        .catch((error) => {
            console.error('Ошибка при загрузке комментариев:', error)
            // Скрываем индикатор загрузки даже при ошибке
            if (loadingEl) {
                loadingEl.classList.add('hidden')
            }
        })
}
