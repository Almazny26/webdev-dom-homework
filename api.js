export function getTodos(){
   return fetch("https://wedev-api.sky.pro/api/v1/dmitry-karabanov/comments", {
        method: "GET"
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Ошибка при загрузке комментариев');
          }
          return response.json();
        });
}

export function postTodo() {
    return fetch("https://wedev-api.sky.pro/api/v1/dmitry-karabanov/comments", {
        method: "POST",
        body: JSON.stringify({
          text: inputCommentEl.value,
          name: inputNameEl.value,
          forceError: false  // Добавляем параметр forceError для имитации ошибок 500
        })
      })
        .then(response => {
          // Обработка 400-й ошибки
          if (response.status === 400) {
            return response.json().then(error => {
              throw new Error(`${error.error}`);
            });
          }
          // Обработка 500-й ошибки
          if (response.status === 500) {
            throw new Error('Ошибка 500: Серверная ошибка.');
          }
          // Обработка успешного ответа
          if (response.ok) {
            return response.json();
          }
        });
}