import { renderUsers } from './render.js'
import { updateUsers } from './users.js'

export const fetchAndRenderTasks = () => {
    // Загружаем комментарии с сервера
    return fetch('https://wedev-api.sky.pro/api/v1/dmitry-karabanov/comments')
        .then((response) => {
            // Преобразуем ответ в JSON
            return response.json()
        })
        .then((data) => {
            // Обновляем массив пользователей данными с сервера
            updateUsers(data.comments)
            // Отрисовываем комментарии на странице
            renderUsers()
        })
}
