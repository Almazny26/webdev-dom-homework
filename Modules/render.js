import { users } from './users.js'
import { setLikeListeners } from './clickToLike.js'
import { setCommentClickListeners } from './replyButton.js'

// Контейнер со всеми комментариями
const commentsEl = document.querySelector('.comments')
// Функция для рендера стоковых комментов
export const renderUsers = () => {
    const usersHtml = users
        .map((user, index) => {
            // Разделение цитаты и комментария
            let quotedText = ''
            let actualComment = user.comment

            // Если комментарий начинается с > — значит, это ответ с цитатой
            if (user.comment.startsWith('-')) {
                // Разбиваем весь комментарий на строки по переносу (\n)
                const lines = user.comment.split('\n')

                // Фильтруем строки, которые начинаются с символа '>'
                const quoteLines = lines.filter((line) => line.startsWith('-'))

                // Каждую строку цитаты экранируем
                // И соединяем обратно в текст с тегами <br> для переноса строк в HTML
                quotedText = quoteLines.join('<br>')

                //Обрабатываем основной текст комментария
                actualComment = lines
                    .slice(quoteLines.length)
                    .join('\n')
                    .trim()
                    .replace(/\n/g, '<br>')
            }

            return `<li class="comment" data-index="${index}">
    <div class="comment-header">
      <div>${user.name}</div>
      <div>${user.time}</div>
    </div>
    <div class="comment-body">
      <div class="comment-text">
        ${quotedText ? `<div class="comment-quote">${quotedText}</div>` : ''}
        ${actualComment}
      </div>
    </div>
    <div class="comment-footer">
          <button class="answer">Ответить</button>
      <div class="likes">
        <span class="likes-counter">${user.numberLikes}</span>
        <button class="like-button${user.isLike ? ' -active-like' : ''}" data-index="${index}"></button>
      </div>
    </div>
  </li>`
        })
        .join('')

    commentsEl.innerHTML = usersHtml
    // Обработчик лайка
    setLikeListeners()
    // Обработчик клика на кнопку "Ответить"
    setCommentClickListeners()
}
