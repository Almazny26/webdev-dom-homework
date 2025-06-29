
  // Массив данных о начальных комментах
  const users = [
    {
      name: "Глеб Фокин",
      time: "12.02.22 12:18",
      comment: "Это будет первый комментарий на этой странице",
      numberLikes: 3,
      isLike: false
    },
    {
      name: "Варвара Н.",
      time: "13.02.22 19:22",
      comment: "Мне нравится как оформлена эта страница! ❤",
      numberLikes: 3,
      isLike: true
    }
  ];

  // Тут сделал по ID
  // Получаем доступ к элементам формы по их ID
  const yourNameEl = document.getElementById('yourName');
  const yourComment = document.getElementById('yourComment');
  const writeEl = document.getElementById('write');

  // А тут решил по классам, так проще
  // Контейнер со всеми комментариями
  const commentsEl = document.querySelector('.comments');
  // Все отдельные комментарии
  const commentEl = document.querySelectorAll('.comment');
  // Заголовки комментариев
  const commentHeaderEl = document.querySelectorAll('.comment-header');
  // Тела комментариев
  const commentBodyEl = document.querySelectorAll('.comment-body');
  // Текст комментариев
  const commentTextEl = document.querySelectorAll('.comment-text');
  // Футеры комментариев
  const commentFooterEls = document.querySelectorAll('.comment-footer');


  // Обработка клика по лайку
  const setLikeListeners = () => {
    // Находим все лайки по классу
    const likeButtons = document.querySelectorAll('.like-button');
    likeButtons.forEach((button, index) => {
      button.addEventListener('click', (event) => {
        // Предотвращаем всплытие события
        event.stopPropagation();

        // Переключаем лайк: если уже лайкнуто — снимаем, иначе ставим лайк
        if (users[index].isLike) {
          // Снимаем лайк
          users[index].isLike = false;
          // Уменьшаем счетчик
          users[index].numberLikes--;
        } else {
          // Ставим лайк
          users[index].isLike = true;
          // Увеличиваем счетчик  
          users[index].numberLikes++;
        }
        // Рендерим комменты после каждого нажатия на лайк
        renderUsers();
      });
    });
  };

  // Функция для экранирования HTML
  function escapeHTML(str) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  // Функция для рендера стоковых комментов 
  const renderUsers = () => {

    const usersHtml = users.map((user, index) => {


      // Разделение цитаты и комментария
      let quotedText = '';
      let actualComment = user.comment;

      // Если комментарий начинается с > — значит, это ответ с цитатой
      if (user.comment.startsWith('-')) {

        // Разбиваем весь комментарий на строки по переносу (\n)
        const lines = user.comment.split('\n');

        // Фильтруем строки, которые начинаются с символа '>'
        const quoteLines = lines.filter(line => line.startsWith('-'));

        // Каждую строку цитаты экранируем
        // И соединяем обратно в текст с тегами <br> для переноса строк в HTML
        quotedText = quoteLines.join('<br>');

        //Обрабатываем основной текст комментария
        actualComment = lines
          .slice(quoteLines.length)
          .join('\n')
          .trim()
          .replace(/\n/g, '<br>');
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
    }).join("");

    commentsEl.innerHTML = usersHtml;
    // Обработчик лайка
    setLikeListeners();
    // Обработчик клика на кнопку "Ответить"
    setCommentClickListeners();
  }
  renderUsers();

  // Добавляем обработчик события клика на кнопку "Написать"
  writeEl.addEventListener('click', function (e) {
    // Флаг наличия ошибки
    let hasError = false;
    // Сброс состояния ошибок перед новой проверкой
    yourNameEl.classList.remove("error");
    yourComment.classList.remove("error");
    // Проверка имени
    if (yourNameEl.value.trim() === '') {
      yourNameEl.classList.add("error");
      hasError = true;
    }
    // Проверка комментария
    if (yourComment.value.trim() === '') {
      yourComment.classList.add("error");
      hasError = true;
    }
    // Если есть ошибка — не добавлять комментарий
    if (hasError) return;


    // Получаем значения из полей ввода
    // Имя пользователя
    const name = yourNameEl.value.trim();;
    // Текст комментария
    const comment = yourComment.value.trim();
    // Формируем текущую дату и время в формате "ДД.ММ.ГГ ЧЧ:ММ"
    const date = new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });

    // Проверяем, что оба поля заполнены
    if (name && comment) {
      // Добавляем новый комментарий к существующим с помощью обновления массива данных
      users.push({
        name: escapeHTML(yourNameEl.value.trim()),
        time: date,
        comment: escapeHTML(yourComment.value.trim()),
        numberLikes: 0,
        isLike: false
      });

      renderUsers();

      // Очищаем поля ввода после добавления комментария
      yourNameEl.value = '';
      yourComment.value = '';
    }
  });

  // Добавляем обработчик клика на кнопку "Ответить" для цитирования
  function setCommentClickListeners() {
    // Находим все кнопки "Ответить" после рендера комментариев
    const answerButtons = document.querySelectorAll('.answer');
    // Для каждой кнопки "Ответить" добавляем обработчик события
    answerButtons.forEach((button) => {
      button.addEventListener('click', function (e) {
        e.stopPropagation();
        // Находим родительский элемент комментария, к которому относится эта кнопка
        const commentItem = this.closest('.comment');
        // Получаем индекс комментария из атрибута data-index
        const index = commentItem.getAttribute('data-index');
        // Получаем объект пользователя (комментария) по индексу
        const user = users[index];
        // Формируем цитату: имя и текст комментария, и подставляем в поле для ввода комментария
        yourComment.value = `- ${user.name}: ${user.comment}\n\nОтвет: `;
        // Ставим фокус на поле имени
        yourNameEl.focus();
      });
    });
  }