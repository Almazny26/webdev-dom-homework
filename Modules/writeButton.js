import { fetchAndRenderTasks } from './fetchAndRenderTasks.js'

const yourNameEl = document.getElementById('yourName')
const yourComment = document.getElementById('yourComment')
const writeEl = document.getElementById('write')

// Добавляем обработчик события клика на кнопку "Написать"
export function write() {
    writeEl.addEventListener('click', function () {
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
            // Формируем объект с данными комментария для отправки на сервер
            const commentData = {
                // Текст комментария без лишних пробелов
                text: comment.trim(),
                // Имя пользователя без лишних пробелов
                name: name.trim(),
            }
            writeEl.disabled = true
            writeEl.textContent = 'Публикация...'
            // Отправляем POST запрос на сервер для добавления комментария
            fetch(
                'https://wedev-api.sky.pro/api/v1/dmitry-karabanov/comments',
                {
                    // Метод для создания нового комментария
                    method: 'POST',
                    // Преобразуем данные в JSON
                    body: JSON.stringify(commentData),
                },
            )
                .then(() => {
                    // После успешного добавления комментария загружаем обновленный список
                    return fetchAndRenderTasks()
                })
                .then(() => {
                    // Очищаем поля ввода после успешного добавления
                    yourNameEl.value = ''
                    yourComment.value = ''

                    writeEl.disabled = false
                    writeEl.textContent = 'Написать'
                })
        }
    })
}
