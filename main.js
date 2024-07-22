import { getTodos, postTodo } from "./api.js";

// Получаем элементы страницы для дальнейшей работы
const listEl = document.getElementById('list');
const inputNameEl = document.getElementById('input-name');
const inputCommentEl = document.getElementById('input-comment');
const writeEl = document.getElementById('write');
const loadingMessageEl = document.getElementById('loading-message');
const addingMessageEl = document.getElementById('adding-message');

// Изначально скрываем сообщение о загрузке
loadingMessageEl.style.display = 'none';

// Функция для получения комментариев с сервера
const getCommentsFromServer = () => {
    // Показываем сообщение о загрузке
    loadingMessageEl.style.display = 'block';

    // Экспорт из api.js
    getTodos().then((responseData) => {
        // Сохраняем комментарии в массив
        comments = responseData.comments;
        // Отображаем комментарии на странице
        renderComments();
        // Скрываем сообщение о загрузке после получения комментариев
        loadingMessageEl.style.display = 'none';
    })
        .catch((error) => {
            loadingMessageEl.style.display = 'none';
            alert(`Не удалось загрузить комментарии. Что-то с интернетом.`);
        });
};

// Массив для хранения комментариев
let comments = [];

// Функция для отображения комментариев
const renderComments = () => {
    // Формируем HTML для каждого комментария
    const commentsHTML = comments.map((comment, index) => {
        // Преобразуем строку времени в объект Date
        const commentDate = new Date(comment.date);

        // Извлекаем необходимые компоненты времени (день, месяц, год, часы, минуты, секунды)
        const day = commentDate.getDate();
        const month = commentDate.getMonth() + 1;
        const year = commentDate.getFullYear();
        const hours = commentDate.getHours();
        const minutes = commentDate.getMinutes();
        const seconds = commentDate.getSeconds();

        // Формируем отформатированную строку времени
        const formattedDate = `${day < 10 ? '0' : ''}${day}.${month < 10 ? '0' : ''}${month}.${year}`;
        const formattedTime = `${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

        // Возвращаем HTML-шаблон для комментария
        return `<li class="comment">
        <div class="comment-header">
          <div>${comment.author.name}</div>
          <div>${formattedDate} ${formattedTime}</div>
        </div>
        <div class="comment-body">
          <div class="comment-text">
            ${filter(comment.text)}
          </div>
        </div>
        <div class="comment-footer">
          <div class="likes">
            <span class="likes-counter">${comment.likes}</span>
            <button class="like-button ${comment.isLiked ? "-active-like" : ""}" data-index='${index}'></button>
          </div>
        </div>
      </li>`;
    }).join('');

    // Вставляем сформированный HTML в элемент списка
    listEl.innerHTML = commentsHTML;

    // Назначаем события на кнопки лайков и ответов на комментарии
    likeEvent();
    replyComment();
};

// Функция для обработки событий лайков
function likeEvent() {
    const likes = document.querySelectorAll('.like-button');

    for (const likeElement of likes) {
        likeElement.addEventListener('click', (e) => {
            e.stopPropagation();

            // Получаем индекс текущего комментария
            const index = likeElement.dataset.index;
            const direction = comments[index].isLiked ? -1 : 1;

            // Обновляем количество лайков и состояние лайка
            comments[index].likes += direction;
            comments[index].isLiked = !comments[index].isLiked;

            // Перерисовываем комментарии
            renderComments();
        });
    }
}

// Обрабатываем нажатие кнопки "Написать"
writeEl.addEventListener('click', function (e) {
    // Проверяем, что поля не пустые
    if (inputNameEl.value === '' || inputCommentEl.value === '') {
        if (inputNameEl.value === '') {
            inputNameEl.style.backgroundColor = 'lightcoral';
        }
        if (inputCommentEl.value === '') {
            inputCommentEl.style.backgroundColor = 'lightcoral';
        }
        return;
    }

    // Проверяем, что в теле запроса переданы text и name
    if (!inputNameEl.value || !inputCommentEl.value) {
        const errorMessage = { error: "В теле запроса не передан text или name" };
        console.error(errorMessage);
        return;
    }

    // Проверяем, что в теле запроса передан JSON
    try {
        JSON.parse(JSON.stringify({ text: inputCommentEl.value, name: inputNameEl.value }));
    } catch (error) {
        const errorMessage = { error: "В теле запроса передан не JSON" };
        console.error(errorMessage);
        return;
    }

    // Скрываем форму и показываем сообщение о добавлении комментария
    document.querySelector('.add-form').style.display = 'none';
    addingMessageEl.style.display = 'block';

    // Сохранение комментария на сервере
    // Экспорт из api.js
    postTodo().then(() => {
        getCommentsFromServer();  // Получаем обновленные комментарии с сервера
    })
        .then(() => {
            // Очищаем поля ввода после добавления комментария
            inputNameEl.value = '';
            inputCommentEl.value = '';
            inputNameEl.style.backgroundColor = '';
            inputCommentEl.style.backgroundColor = '';

            // Показываем форму и скрываем сообщение о добавлении комментария
            document.querySelector('.add-form').style.display = 'block';
            addingMessageEl.style.display = 'none';
        })
        .catch((error) => {
            // Обработка ошибок сети и других ошибок
            alert(`Не удалось добавить комментарий: ${error.message}`);
            document.querySelector('.add-form').style.display = 'block';
            addingMessageEl.style.display = 'none';
        });
});

// Функция обработчика клика на комментах
function replyComment() {
    const commentEl = document.querySelectorAll('.comment');
    commentEl.forEach((el, index) => {
        el.addEventListener('click', function (e) {

            // Дублирование комментария для ответа
            inputCommentEl.value = filter(`QUOTE_BEGIN>${comments[index].author.name}\n${comments[index].text}QUOTE_END\n`);
        });
    });
};

// Функция для фильтрации HTML-тегов
function filter(text) {
    return text
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')

        // Выделение репоста коммента 
        .replaceAll('QUOTE_BEGIN', '<div class="quote">')
        .replaceAll('QUOTE_END', '</div>');
}

// Проверка заполненности полей и активация/деактивация кнопки "Написать"
function checkInputFields() {
    const name = inputNameEl.value.trim();
    const comment = inputCommentEl.value.trim();

    if (name && comment) {
        writeEl.classList.remove('disabled');
    } else {
        writeEl.classList.add('disabled');
    }
}

// Слушатели событий для полей ввода
inputNameEl.addEventListener('input', checkInputFields);
inputCommentEl.addEventListener('input', checkInputFields);

// Получение комментариев при загрузке страницы
getCommentsFromServer();

// **************************************** ДОПОЛНИТЕЛЬНО ********************************

// Функция для обновления состояния кнопки "Написать"
function updateWriteButton() {
    const isNameFilled = inputNameEl.value.trim() !== '';
    const isCommentFilled = inputCommentEl.value.trim() !== '';

    // Если оба поля заполнены, делаем кнопку активной
    if (isNameFilled && isCommentFilled) {
        writeEl.disabled = false;
        writeEl.classList.remove('disabled');
    } else {
        // Если хотя бы одно из полей не заполнено, делаем кнопку неактивной и серой
        writeEl.disabled = true;
        writeEl.classList.add('disabled');
    }
}

// Назначаем обработчики событий для полей ввода
inputNameEl.addEventListener('input', updateWriteButton);
inputNameEl.addEventListener('change', updateWriteButton);
inputCommentEl.addEventListener('input', updateWriteButton);
inputCommentEl.addEventListener('change', updateWriteButton);
inputCommentEl.addEventListener('keydown', updateWriteButton);

// **************************************** ДОПОЛНИТЕЛЬНО ********************************