import { users } from './users.js'
import { escapeHTML } from './escapeHTML.js'
import { date } from './date.js'
import { renderUsers } from './render.js'

const yourNameEl = document.getElementById('yourName')
const yourComment = document.getElementById('yourComment')
const writeEl = document.getElementById('write')

// Добавляем обработчик события клика на кнопку "Написать"
export function write() {
    writeEl.addEventListener('click', function () {
        console.log('cxtn')
        // Флаг наличия ошибки
        let hasError = false
        // Сброс состояния ошибок перед новой проверкой
        yourNameEl.classList.remove('error')
        yourComment.classList.remove('error')
        // Проверка имени
        if (yourNameEl.value.trim() === '') {
            yourNameEl.classList.add('error')
            hasError = true
        }
        // Проверка комментария
        if (yourComment.value.trim() === '') {
            yourComment.classList.add('error')
            hasError = true
        }
        // Если есть ошибка — не добавлять комментарий
        if (hasError) return

        // Получаем значения из полей ввода
        // Имя пользователя
        const name = yourNameEl.value.trim()
        // Текст комментария
        const comment = yourComment.value.trim()

        // Проверяем, что оба поля заполнены
        if (name && comment) {
            // Добавляем новый комментарий к существующим с помощью обновления массива данных
            users.push({
                name: escapeHTML(yourNameEl.value.trim()),
                time: date,
                comment: escapeHTML(yourComment.value.trim()),
                numberLikes: 0,
                isLike: false,
            })

            renderUsers()

            // Очищаем поля ввода после добавления комментария
            yourNameEl.value = ''
            yourComment.value = ''
        }
    })
}
