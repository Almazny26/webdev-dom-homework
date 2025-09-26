import { fetchAndRenderTasks } from './fetchAndRenderTasks.js'
import { postComment } from './postComment.js'

// Переменные для сохранения данных формы
let savedName = ''
let savedComment = ''

// Функция для восстановления данных формы
function restoreFormData() {
    const yourNameEl = document.getElementById('yourName')
    const yourComment = document.getElementById('yourComment')
    if (yourNameEl) yourNameEl.value = savedName
    if (yourComment) yourComment.value = savedComment
}

// Функция для сохранения данных формы
function saveFormData() {
    const yourNameEl = document.getElementById('yourName')
    const yourComment = document.getElementById('yourComment')
    if (yourNameEl) savedName = yourNameEl.value
    if (yourComment) savedComment = yourComment.value
}

// Функция для обработки клика на кнопку "Написать"
const handlePostClick = () => {
    const yourNameEl = document.getElementById('yourName')
    const yourComment = document.getElementById('yourComment')
    const writeEl = document.getElementById('write')

    if (!yourNameEl || !yourComment || !writeEl) {
        return
    }

    // Флаг наличия ошибки
    let hasError = false
    // Сброс состояния ошибок перед новой проверкой
    yourNameEl.classList.remove('error')
    yourComment.classList.remove('error')

    // Проверка комментария (в API v2 проверяем только текст комментария)
    if (yourComment.value.trim() === '') {
        yourComment.classList.add('error')
        hasError = true
    }

    // Проверка минимальной длины комментария (API требует минимум 3 символа)
    if (yourComment.value.trim().length < 3) {
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
        postComment(comment)
            .then(() => {
                // После успешного добавления комментария загружаем обновленный список
                return fetchAndRenderTasks()
            })
            .then(() => {
                // После успешной отправки оставляем имя авторизованного пользователя,
                // очищаем только текст комментария
                const currentUser = JSON.parse(
                    localStorage.getItem('user') || '{}',
                )
                if (currentUser && currentUser.name && yourNameEl) {
                    yourNameEl.value = currentUser.name
                }
                if (yourComment) {
                    yourComment.value = ''
                }
                // Обновляем сохраненные данные
                savedName = yourNameEl ? yourNameEl.value : ''
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
    const writeEl = document.getElementById('write')
    const yourNameEl = document.getElementById('yourName')
    const yourComment = document.getElementById('yourComment')

    if (!writeEl) {
        return
    }

    // Добавляем обработчики событий input для отслеживания изменений
    if (yourNameEl) {
        yourNameEl.addEventListener('input', saveFormData)
    }
    if (yourComment) {
        yourComment.addEventListener('input', saveFormData)
    }

    writeEl.addEventListener('click', handlePostClick)
}
