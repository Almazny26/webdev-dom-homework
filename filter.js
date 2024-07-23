export function filter(text) {
    return text
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        // Выделение репоста коммента 
        .replaceAll('QUOTE_BEGIN', '<div class="quote">')
        .replaceAll('QUOTE_END', '</div>');
}