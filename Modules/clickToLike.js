import { users } from './users.js'
import { renderUsers } from './render.js'

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

            // Проверяем, что элемент существует в массиве
            if (!users[index]) {
                console.error(
                    `Элемент с индексом ${index} не найден в массиве users`,
                )
                return
            }

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
                console.error('Ошибка при обработке лайка:', error)
            } finally {
                // Снимаем флаг загрузки
                users[index].isLikeLoading = false
                // Рендерим комменты после обработки лайка
                renderUsers()
            }
        })
    })
}
