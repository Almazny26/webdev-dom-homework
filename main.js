import { getTodos, postTodo } from './api.js';
import { renderComments } from './renderComments.js';
import { filter } from './filter.js';

// Получаем элементы страницы для дальнейшей работы
const inputNameEl = document.getElementById('input-name'); // Поле ввода имени
const inputCommentEl = document.getElementById('input-comment'); // Поле ввода комментария
const writeEl = document.getElementById('write'); // Кнопка для отправки комментария
const loadingMessageEl = document.getElementById('loading-message'); // Сообщение о загрузке
const addingMessageEl = document.getElementById('adding-message'); // Сообщение о добавлении комментария

// Изначально скрываем сообщение о загрузке и добавлении комментария
loadingMessageEl.style.display = 'none';
addingMessageEl.style.display = 'none';

// Функция для получения комментариев с сервера
const getCommentsFromServer = () => {
    // Показываем сообщение о загрузке
    loadingMessageEl.style.display = 'block';

    // Получаем данные комментариев с сервера через getTodos
    getTodos().then((responseData) => {
        // Сохраняем комментарии в массив
        comments = responseData.comments;
        // Отрисовываем комментарии и назначаем обработчики событий
        renderComments({ comments, likeEvent, replyComment });
        // Скрываем сообщение о загрузке
        loadingMessageEl.style.display = 'none';
    })
    .catch((error) => {
        // Скрываем сообщение о загрузке при ошибке и показываем предупреждение
        loadingMessageEl.style.display = 'none';
        alert(`Не удалось загрузить комментарии. Что-то с интернетом.`);
    });
};

// Массив для хранения комментариев
let comments = [];

// Функция для назначения обработчиков кликов на кнопках "нравится"
function likeEvent() {
    // Находим все кнопки "нравится"
    const likes = document.querySelectorAll('.like-button');

    // Назначаем обработчики кликов на каждую кнопку
    for (const likeElement of likes) {
        likeElement.addEventListener('click', (e) => {
            e.stopPropagation(); // Предотвращаем всплытие события

            // Определяем индекс комментария
            const index = likeElement.dataset.index;
            // Определяем направление изменения количества лайков
            const direction = comments[index].isLiked ? -1 : 1;

            // Обновляем количество лайков и состояние кнопки "нравится"
            comments[index].likes += direction;
            comments[index].isLiked = !comments[index].isLiked;

            // Перерисовываем комментарии
            renderComments({ comments, likeEvent, replyComment });
        });
    }
}

// Назначаем обработчик клика на кнопку "Написать"
writeEl.addEventListener('click', function (e) {
    // Проверяем, что оба поля заполнены
    if (inputNameEl.value === '' || inputCommentEl.value === '') {
        if (inputNameEl.value === '') {
            inputNameEl.style.backgroundColor = 'lightcoral'; // Подсвечиваем поле имени при ошибке
        }
        if (inputCommentEl.value === '') {
            inputCommentEl.style.backgroundColor = 'lightcoral'; // Подсвечиваем поле комментария при ошибке
        }
        return;
    }

    // Проверяем, что поля ввода содержат значения
    if (!inputNameEl.value || !inputCommentEl.value) {
        const errorMessage = { error: "В теле запроса не передан text или name" };
        console.error(errorMessage);
        return;
    }

    // Проверяем, что данные можно преобразовать в JSON
    try {
        JSON.parse(JSON.stringify({ text: inputCommentEl.value, name: inputNameEl.value }));
    } catch (error) {
        const errorMessage = { error: "В теле запроса передан не JSON" };
        console.error(errorMessage);
        return;
    }

    // Прячем форму добавления комментария и показываем сообщение о добавлении
    document.querySelector('.add-form').style.display = 'none';
    addingMessageEl.style.display = 'block';

    // Отправляем новый комментарий на сервер
    postTodo({
        text: inputCommentEl.value,
        name: inputNameEl.value
    }).then(() => {
        // После успешной отправки обновляем комментарии с сервера
        getCommentsFromServer();
    })
    .then(() => {
        // Очищаем поля ввода и восстанавливаем отображение формы добавления
        inputNameEl.value = '';
        inputCommentEl.value = '';
        inputNameEl.style.backgroundColor = '';
        inputCommentEl.style.backgroundColor = '';

        document.querySelector('.add-form').style.display = 'block';
        addingMessageEl.style.display = 'none';
    })
    .catch((error) => {
        // В случае ошибки показываем предупреждение и восстанавливаем отображение формы добавления
        alert(`Не удалось добавить комментарий: ${error.message}`);
        document.querySelector('.add-form').style.display = 'block';
        addingMessageEl.style.display = 'none';
    });
});

// Функция обработчика клика на комментариях для создания ответа
function replyComment() {
    // Находим все комментарии на странице
    const commentEl = document.querySelectorAll('.comment');
    commentEl.forEach((el, index) => {
        // Назначаем обработчик клика на каждый комментарий
        el.addEventListener('click', function (e) {
            // Заполняем поле ввода комментария текстом для ответа
            inputCommentEl.value = (`QUOTE_BEGIN>${comments[index].author.name}\n${comments[index].text}QUOTE_END\n`);
        });
    });
}

// Функция для проверки заполненности полей ввода
function checkInputFields() {
    const name = inputNameEl.value.trim();
    const comment = inputCommentEl.value.trim();

    // Если оба поля заполнены, активируем кнопку "Написать"
    if (name && comment) {
        writeEl.classList.remove('disabled');
    } else {
        // Если хотя бы одно поле пустое, деактивируем кнопку "Написать"
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
        // Если хотя бы одно поле не заполнено, делаем кнопку неактивной и серой
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
