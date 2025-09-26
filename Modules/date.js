// Формируем текущую дату и время в формате "ДД.ММ.ГГ ЧЧ:ММ"
export const date =
    new Date().toLocaleDateString() +
    ' ' +
    new Date().toLocaleTimeString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit',
    })
