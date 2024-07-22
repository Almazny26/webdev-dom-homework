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