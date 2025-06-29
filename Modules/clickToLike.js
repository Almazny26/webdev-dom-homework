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
            if (users[index].isLike) {
                // Снимаем лайк
                users[index].isLike = false
                // Уменьшаем счетчик
                users[index].numberLikes--
            } else {
                // Ставим лайк
                users[index].isLike = true
                // Увеличиваем счетчик
                users[index].numberLikes++
            }
            // Рендерим комменты после каждого нажатия на лайк
            renderUsers()
        })
    })
}
