import { users } from './users.js'
import { renderUsers } from './render.js'

// Обработка клика по лайку
export const setLikeListeners = () => {
    // Находим все лайки по классу
    const likeButtons = document.querySelectorAll('.like-button')
    likeButtons.forEach((button, index) => {
        button.addEventListener('click', (event) => {
            // Предотвращаем всплытие события
            event.stopPropagation()

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
            // Рендерим комменты после каждого нажатия на лайк
            renderUsers()
        })
    })
}
