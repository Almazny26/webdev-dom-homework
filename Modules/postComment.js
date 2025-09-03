// Функция для отправки комментария с автоматическим повтором при ошибке 500
export const postComment = (
    text,
    name,
    retryCount = 0,
    maxRetries = 3,
    timeout = 10000,
) => {
    const commentData = {
        text: text.trim(),
        name: name.trim(),
        forceError: true,
    }

    // Создаем Promise с таймаутом
    const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
            reject(new Error('Таймаут запроса'))
        }, timeout)
    })

    const fetchPromise = fetch(
        'https://wedev-api.sky.pro/api/v1/dmitry-karabanov/comments',
        {
            method: 'POST',
            body: JSON.stringify(commentData),
        },
    )

    return Promise.race([fetchPromise, timeoutPromise])
        .then((response) => {
            // Проверяем статус ответа
            if (response.status === 400) {
                // Обработка 400-й ошибки (некорректные данные)
                alert(
                    'Ошибка: введены некорректные данные. Проверьте, что имя и комментарий не слишком короткие.',
                )
                throw new Error('400 Bad Request')
            }

            if (response.status === 500) {
                // Обработка 500-й ошибки (ошибка сервера) - только в консоль
                console.log(
                    `Ошибка сервера (попытка ${retryCount + 1}/${maxRetries + 1}). Повторяем запрос...`,
                )

                if (retryCount < maxRetries) {
                    // Автоматически повторяем запрос при ошибке 500
                    return postComment(
                        text,
                        name,
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
                console.log(
                    `Таймаут запроса (попытка ${retryCount + 1}/${maxRetries + 1})`,
                )

                if (retryCount < maxRetries) {
                    // Повторяем запрос при таймауте
                    return postComment(
                        text,
                        name,
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
