import { filter } from './filter.js';

// Получаем элемент списка комментариев на странице
const listEl = document.getElementById('list');

// Функция для отрисовки списка комментариев
export const renderComments = ({ comments, likeEvent, replyComment }) => {
    // Создаем HTML для каждого комментария
    const commentsHTML = comments.map((comment, index) => {
        // Преобразуем строку даты в объект Date
        const commentDate = new Date(comment.date);

        // Извлекаем компоненты даты и времени
        const day = commentDate.getDate();
        const month = commentDate.getMonth() + 1;
        const year = commentDate.getFullYear();
        const hours = commentDate.getHours();
        const minutes = commentDate.getMinutes();
        const seconds = commentDate.getSeconds();

        // Форматируем дату и время для отображения
        const formattedDate = `${day < 10 ? '0' : ''}${day}.${month < 10 ? '0' : ''}${month}.${year}`;
        const formattedTime = `${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

        // Создаем HTML-код для комментария
        return `<li class="comment">
            <div class="comment-header">
              <div>${comment.author.name}</div> <!-- Имя автора комментария -->
              <div>${formattedDate} ${formattedTime}</div> <!-- Дата и время комментария -->
            </div>
            <div class="comment-body">
              <div class="comment-text">
                ${filter(comment.text)} <!-- Отфильтрованный текст комментария -->
              </div>
            </div>
            <div class="comment-footer">
              <div class="likes">
                <span class="likes-counter">${comment.likes}</span> <!-- Количество лайков -->
                <button class="like-button ${comment.isLiked ? "-active-like" : ""}" data-index='${index}'></button> <!-- Кнопка для лайков -->
              </div>
            </div>
          </li>`;
    }).join(''); // Объединяем все HTML-коды комментариев в одну строку

    // Вставляем созданный HTML в элемент списка
    listEl.innerHTML = commentsHTML;

    // Назначаем обработчики событий для кнопок "нравится" и комментариев
    likeEvent();
    replyComment();
};
