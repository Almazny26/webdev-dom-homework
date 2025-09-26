// Функция для отправки комментария с автоматическим повтором при ошибке 500
export const postComment = (
    text,
    retryCount = 0,
    maxRetries = 3,
    timeout = 10000,
) => {
    // Получаем данные пользователя из LocalStorage
    const userData = localStorage.getItem('user')
    if (!userData) {
        throw new Error('Пользователь не авторизован')
    }

    const user = JSON.parse(userData)

    const commentData = {
        text: text.trim(),
    }

    // Создаем Promise с таймаутом
    const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
            reject(new Error('Таймаут запроса'))
        }, timeout)
    })

    const fetchPromise = fetch(
        'https://wedev-api.sky.pro/api/v2/dmitry-karabanov/comments',
        {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${user.token}`,
            },
            body: JSON.stringify(commentData),
        },
    )

    return Promise.race([fetchPromise, timeoutPromise])
        .then((response) => {
            // Проверяем статус ответа
            if (response.status === 400) {
                // Обработка 400-й ошибки (некорректные данные)
                return response
                    .json()
                    .then((errorData) => {
                        alert(
                            `Ошибка: ${errorData.error || 'Комментарий должен содержать минимум 3 символа'}`,
                        )
                        throw new Error('400 Bad Request')
                    })
                    .catch((e) => {
                        alert(
                            'Ошибка: комментарий должен содержать минимум 3 символа.',
                        )
                        throw new Error('400 Bad Request')
                    })
            }

            if (response.status === 500) {
                // Обработка 500-й ошибки (ошибка сервера) - только в консоль

                if (retryCount < maxRetries) {
                    // Автоматически повторяем запрос при ошибке 500
                    return postComment(
                        text,
                        retryCount + 1,
                        maxRetries,
                        timeout,
                    )
                } else {
                    // Превышено максимальное количество попыток
                    alert(
                        'Не удалось отправить комментарий после нескольких попыток. Попробуйте позже.',
                    )
                    throw new Error('Превышено количество попыток')
                }
            }

            if (!response.ok) {
                // Обработка других ошибок
                alert(`Произошла ошибка: ${response.status}`)
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            return response.json()
        })
        .catch((error) => {
            if (error.message === 'Таймаут запроса') {
                if (retryCount < maxRetries) {
                    // Повторяем запрос при таймауте
                    return postComment(
                        text,
                        retryCount + 1,
                        maxRetries,
                        timeout,
                    )
                } else {
                    // Превышено максимальное количество попыток
                    alert(
                        'Не удалось отправить комментарий из-за таймаута. Попробуйте позже.',
                    )
                    throw error
                }
            }

            // Для других ошибок (не 500) просто пробрасываем дальше
            throw error
        })
}
