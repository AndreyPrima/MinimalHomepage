document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    const searchEngineSelect = document.getElementById('search-engine');
    const bookmarksContainer = document.getElementById('bookmarks-container');

    // --- Поиск ---
    searchForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Предотвращаем стандартную отправку формы
        const query = searchInput.value.trim();
        if (query) {
            const engine = searchEngineSelect.value;
            let searchUrl;

            switch (engine) {
                case 'duckduckgo':
                    searchUrl = `https://duckduckgo.com/?q=${encodeURIComponent(query)}`;
                    break;
                case 'bing':
                    searchUrl = `https://www.bing.com/search?q=${encodeURIComponent(query)}`;
                    break;
                case 'yandex':
                    searchUrl = `https://yandex.ru/search/?text=${encodeURIComponent(query)}`;
                    break;
                case 'google':
                default:
                    searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
                    break;
            }
            window.open(searchUrl, '_blank'); // Открываем в новой вкладке
            // или window.location.href = searchUrl; // для открытия в текущей
            searchInput.value = ''; // Очищаем поле ввода
        }
    });

    // --- Закладки ---
    // Вы можете хранить закладки в localStorage для персистентности
    // или просто жестко задать их здесь для простоты.

    const defaultBookmarks = [
        { name: "GitHub", url: "https://github.com" },
        { name: "Habr", url: "https://habr.com" },
        { name: "MDN Web Docs", url: "https://developer.mozilla.org/" },
        // Добавьте свои закладки сюда
    ];

    function displayBookmarks(bookmarks) {
        bookmarksContainer.innerHTML = ''; // Очищаем контейнер
        bookmarks.forEach(bookmark => {
            const linkElement = document.createElement('a');
            linkElement.href = bookmark.url;
            linkElement.textContent = bookmark.name;
            linkElement.classList.add('bookmark-link');
            linkElement.target = "_blank"; // Открывать в новой вкладке
            bookmarksContainer.appendChild(linkElement);
        });
    }

    // Загружаем и отображаем закладки
    // Для более продвинутой версии:
    // let userBookmarks = JSON.parse(localStorage.getItem('minimalHomepageBookmarks')) || defaultBookmarks;
    // displayBookmarks(userBookmarks);

    // Пока используем только дефолтные:
    displayBookmarks(defaultBookmarks);


    // --- Ссылка "Settings" ---
    // Пока она никуда не ведет, но вы можете добавить функционал.
    // Например, открывать модальное окно для настройки закладок или темы.
    const settingsLink = document.getElementById('settings-link');
    settingsLink.addEventListener('click', (e) => {
        e.preventDefault();
        alert('Settings clicked! Feature not implemented yet.');
        // Здесь можно будет добавить логику настроек
        // Например, управление закладками через localStorage
    });
});