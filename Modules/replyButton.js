import { users } from './users.js'

// Добавляем обработчик клика на кнопку "Ответить" для цитирования
export function setCommentClickListeners() {
    // Находим все кнопки "Ответить" после рендера комментариев
    const answerButtons = document.querySelectorAll('.answer')

    // Для каждой кнопки "Ответить" добавляем обработчик события
    answerButtons.forEach((button) => {
        button.addEventListener('click', function (e) {
            e.stopPropagation()

            // Получаем элементы динамически
            const yourComment = document.getElementById('yourComment')
            const yourNameEl = document.getElementById('yourName')

            if (!yourComment) return

            // Находим родительский элемент комментария, к которому относится эта кнопка
            const commentItem = this.closest('.comment')
            // Получаем индекс комментария из атрибута data-index
            const index = commentItem.getAttribute('data-index')
            // Получаем объект пользователя (комментария) по индексу
            const user = users[index]

            // Формируем цитату: имя и текст комментария, и подставляем в поле для ввода комментария
            yourComment.value = `- ${user.author.name}: ${user.text}\n\nОтвет: `

            // Ставим фокус на поле комментария
            yourComment.focus()
        })
    })
}
