import { users } from './users.js'
import { renderUsers } from './render.js'
import { getCurrentUser } from './mainPage.js'

// Функция для имитации задержки API
function delay(interval = 300) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve()
        }, interval)
    })
}

// Обработка клика по лайку
export const setLikeListeners = () => {
    // Находим все лайки по классу
    const likeButtons = document.querySelectorAll('.like-button')
    likeButtons.forEach((button, index) => {
        button.addEventListener('click', async (event) => {
            // Предотвращаем всплытие события
            event.stopPropagation()

            // Проверяем авторизацию пользователя
            const currentUser = getCurrentUser()
            if (!currentUser) {
                alert('Для оценки комментариев необходимо авторизоваться')
                return
            }

            // Проверяем, что элемент существует в массиве
            if (!users[index]) return

            // Проверяем, что лайк уже не в процессе загрузки
            if (users[index].isLikeLoading) {
                return
            }

            // Устанавливаем флаг загрузки
            users[index].isLikeLoading = true
            // Рендерим для показа анимации
            renderUsers()

            try {
                // Имитируем запрос к API
                await delay(1000)

                // Переключаем лайк: если уже лайкнуто — снимаем, иначе ставим лайк
                if (users[index].isLiked) {
                    // Снимаем лайк
                    users[index].isLiked = false
                    // Уменьшаем счетчик
                    users[index].likes--
                } else {
                    // Ставим лайк
                    users[index].isLiked = true
                    // Увеличиваем счетчик
                    users[index].likes++
                }
            } catch (error) {
            } finally {
                // Снимаем флаг загрузки
                users[index].isLikeLoading = false
                // Рендерим комменты после обработки лайка
                renderUsers()
            }
        })
    })
}
