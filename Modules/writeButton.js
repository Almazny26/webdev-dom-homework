import { fetchAndRenderTasks } from './fetchAndRenderTasks.js'
import { postComment } from './postComment.js'

const yourNameEl = document.getElementById('yourName')
const yourComment = document.getElementById('yourComment')
const writeEl = document.getElementById('write')

// Переменные для сохранения данных формы
let savedName = ''
let savedComment = ''

// Функция для восстановления данных формы
function restoreFormData() {
    yourNameEl.value = savedName
    yourComment.value = savedComment
}

// Функция для сохранения данных формы
function saveFormData() {
    savedName = yourNameEl.value
    savedComment = yourComment.value
}

// Добавляем обработчики событий input для отслеживания изменений
yourNameEl.addEventListener('input', saveFormData)
yourComment.addEventListener('input', saveFormData)

// Функция для обработки клика на кнопку "Написать"
const handlePostClick = () => {
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
        // Сохраняем данные формы перед отправкой
        saveFormData()

        writeEl.disabled = true
        writeEl.textContent = 'Публикация...'

        // Используем функцию postComment с автоматическим повтором при ошибке 500
        postComment(comment, name)
            .then(() => {
                // После успешного добавления комментария загружаем обновленный список
                return fetchAndRenderTasks()
            })
            .then(() => {
                // Очищаем поля ввода после успешного добавления
                yourNameEl.value = ''
                yourComment.value = ''
                // Очищаем сохраненные данные
                savedName = ''
                savedComment = ''

                writeEl.disabled = false
                writeEl.textContent = 'Написать'
            })
            .catch((error) => {
                // Обработка ошибок сети и других ошибок
                if (
                    error.name === 'TypeError' &&
                    error.message.includes('fetch')
                ) {
                    // Ошибка сети (нет интернета)
                    alert(
                        'Ошибка сети. Проверьте подключение к интернету и попробуйте снова.',
                    )
                } else if (
                    error.message.includes('400') ||
                    error.message.includes('Превышено количество попыток') ||
                    error.message.includes('Таймаут запроса')
                ) {
                    // Ошибки уже обработаны выше, просто восстанавливаем форму
                    restoreFormData()
                } else {
                    // Другие ошибки
                    alert('Произошла неизвестная ошибка. Попробуйте еще раз.')
                    restoreFormData()
                }

                // Восстанавливаем кнопку
                writeEl.disabled = false
                writeEl.textContent = 'Написать'
            })
    }
}

// Добавляем обработчик события клика на кнопку "Написать"
export function write() {
    writeEl.addEventListener('click', handlePostClick)
}
