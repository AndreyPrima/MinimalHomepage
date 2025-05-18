document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements (объявляем здесь, чтобы были доступны глобально в рамках этого скрипта) ---
    let searchForm, searchInput, searchEngineSelect, bookmarksContainer, noBookmarksMessage,
        settingsBtn, settingsModal, closeSettingsModalBtn, addBookmarkForm, bookmarkNameInput,
        bookmarkUrlInput, manageBookmarksList, defaultSearchEngineSelect, addBookmarkShortcutBtn,
        clockTime, clockDate, customCssTextarea, applyCustomCssBtn, clearCustomCssBtn,
        userCustomCssStyleTag, quickLinksDropzone, dragDropHintText;

    let bookmarks = [];
    const STORAGE_KEY_BOOKMARKS = 'homepageBookmarksV3.2';
    const STORAGE_KEY_SEARCH_ENGINE = 'defaultSearchEngineV3.2';
    const STORAGE_KEY_CUSTOM_CSS = 'customUserCssV3.2';

    const DEFAULT_BOOKMARKS = [
        { name: "GitHub", url: "https://github.com" },
        { name: "MDN Web Docs", url: "https://developer.mozilla.org/" },
    ];

    // --- UTILITY FUNCTIONS ---
    const getFaviconUrl = (url) => {
        try {
            const urlObj = new URL(url);
            return `https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${urlObj.origin}&size=32`;
        } catch (e) {
            return 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23888888"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zM11 7h2v6h-2V7zm0 8h2v2h-2v-2z"/></svg>';
        }
    };

    const isValidHttpUrl = (string) => { /* ... (без изменений) ... */ };

    // --- CLOCK WIDGET ---
    function updateClock() { /* ... (без изменений) ... */ }

    // --- LOCAL STORAGE FUNCTIONS ---
    const saveToLocalStorage = (key, data) => { /* ... (без изменений) ... */ };
    const loadFromLocalStorage = (key, defaultValue = null) => { /* ... (без изменений) ... */ };

    // --- SEARCH FUNCTIONALITY ---
    const performSearch = () => { /* ... (без изменений) ... */ };

    // --- BOOKMARKS FUNCTIONALITY ---
    const toggleNoBookmarksMessage = () => { /* ... (без изменений) ... */ };
    const createBookmarkElement = (bookmark) => { /* ... (без изменений) ... */ };
    const renderBookmarks = () => { /* ... (без изменений) ... */ };
    const renderManageBookmarksList = () => { /* ... (без изменений, включая обработчики для delete-btn) ... */ };
    const renderAllBookmarks = () => { /* ... (без изменений) ... */ };
    const saveBookmarks = () => { /* ... (без изменений) ... */ };
    const addSingleBookmark = (name, url, skipSaveAndRender = false) => { /* ... (без изменений) ... */ };
    const loadBookmarks = () => { /* ... (без изменений) ... */ };

    // --- DRAG & DROP BOOKMARKS ---
    const parseDroppedHtmlForBookmarks = (htmlString) => { /* ... (без изменений) ... */ };
    const parseDroppedUriList = (uriListString, plainTextString = "") => { /* ... (без изменений) ... */ };

    // --- SETTINGS MODAL FUNCTIONALITY ---
    const openSettingsModal = () => {
        if (settingsModal) {
            settingsModal.style.display = 'block';
            settingsModal.setAttribute('aria-hidden', 'false');
            if (closeSettingsModalBtn) closeSettingsModalBtn.focus(); // Убедимся, что closeSettingsModalBtn существует
        }
    };
    const closeSettingsModal = () => {
        if (settingsModal) {
            settingsModal.style.display = 'none';
            settingsModal.setAttribute('aria-hidden', 'true');
        }
    };
    
    // --- SETTINGS PERSISTENCE ---
    const loadSettings = () => { /* ... (без изменений) ... */ };
    const saveDefaultSearchEngine = () => { /* ... (без изменений) ... */ };
    
    // --- CUSTOM CSS ---
    const applyCustomCss = () => { /* ... (без изменений) ... */ };
    const clearCustomCss = () => { /* ... (без изменений) ... */ };

    // --- INITIALIZATION ---
    function initializeApp() {
        // --- Assign DOM Elements ---
        searchForm = document.getElementById('search-form');
        searchInput = document.getElementById('search-input');
        searchEngineSelect = document.getElementById('search-engine');
        bookmarksContainer = document.getElementById('bookmarks-container');
        noBookmarksMessage = document.querySelector('.no-bookmarks-message');
        settingsBtn = document.getElementById('settings-btn');
        settingsModal = document.getElementById('settings-modal');
        closeSettingsModalBtn = document.getElementById('close-settings-modal');
        addBookmarkForm = document.getElementById('add-bookmark-form');
        bookmarkNameInput = document.getElementById('bookmark-name');
        bookmarkUrlInput = document.getElementById('bookmark-url');
        manageBookmarksList = document.getElementById('manage-bookmarks-list');
        defaultSearchEngineSelect = document.getElementById('default-search-engine');
        addBookmarkShortcutBtn = document.getElementById('add-bookmark-shortcut-btn');
        clockTime = document.getElementById('time');
        clockDate = document.getElementById('date');
        customCssTextarea = document.getElementById('custom-css');
        applyCustomCssBtn = document.getElementById('apply-custom-css');
        clearCustomCssBtn = document.getElementById('clear-custom-css');
        userCustomCssStyleTag = document.getElementById('user-custom-css');
        quickLinksDropzone = document.getElementById('quick-links-dropzone');
        dragDropHintText = document.getElementById('drag-drop-hint-text');

        // --- Initial Data Load & UI Update ---
        updateClock();
        setInterval(updateClock, 30000);
        loadBookmarks();
        loadSettings();

        // --- Event Listeners (регистрируем ПОСЛЕ того, как элементы найдены) ---
        if (searchForm) {
            searchForm.addEventListener('submit', (e) => { e.preventDefault(); performSearch(); });
        }

        if (addBookmarkForm) {
            addBookmarkForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const name = bookmarkNameInput.value;
                const url = bookmarkUrlInput.value;
                if (addSingleBookmark(name, url)) {
                    bookmarkNameInput.value = '';
                    bookmarkUrlInput.value = '';
                } else {
                    alert("Failed to add bookmark. Please check the name and URL (must be valid and not a duplicate).");
                }
            });
        }

        if (settingsBtn) {
            settingsBtn.addEventListener('click', openSettingsModal);
        }
        if (closeSettingsModalBtn) {
            closeSettingsModalBtn.addEventListener('click', closeSettingsModal);
        }
        if (addBookmarkShortcutBtn) {
            addBookmarkShortcutBtn.addEventListener('click', () => {
                openSettingsModal();
                setTimeout(() => bookmarkNameInput && bookmarkNameInput.focus(), 100);
            });
        }

        window.addEventListener('click', (e) => {
            if (settingsModal && e.target === settingsModal) closeSettingsModal();
        });
        window.addEventListener('keydown', (e) => {
            if (settingsModal && settingsModal.style.display === 'block' && e.key === 'Escape') closeSettingsModal();
        });

        if (defaultSearchEngineSelect) {
            defaultSearchEngineSelect.addEventListener('change', saveDefaultSearchEngine);
        }
        if (applyCustomCssBtn) {
            applyCustomCssBtn.addEventListener('click', applyCustomCss);
        }
        if (clearCustomCssBtn) {
            clearCustomCssBtn.addEventListener('click', clearCustomCss);
        }

        if (quickLinksDropzone) {
            const originalHintText = dragDropHintText ? dragDropHintText.textContent : "Drag & drop here!";
            
            quickLinksDropzone.addEventListener('dragenter', (e) => {
                e.preventDefault(); e.stopPropagation();
                quickLinksDropzone.classList.add('drag-over-active');
                if (dragDropHintText) dragDropHintText.textContent = "Drop links here!";
            });
            quickLinksDropzone.addEventListener('dragover', (e) => {
                e.preventDefault(); e.stopPropagation();
                e.dataTransfer.dropEffect = 'copy';
                quickLinksDropzone.classList.add('drag-over-active');
            });
            quickLinksDropzone.addEventListener('dragleave', (e) => {
                e.preventDefault(); e.stopPropagation();
                if (e.target === quickLinksDropzone || !quickLinksDropzone.contains(e.relatedTarget)) {
                    quickLinksDropzone.classList.remove('drag-over-active');
                    if (dragDropHintText) dragDropHintText.textContent = originalHintText;
                }
            });
            quickLinksDropzone.addEventListener('drop', (e) => {
                e.preventDefault(); e.stopPropagation();
                quickLinksDropzone.classList.remove('drag-over-active');
                if (dragDropHintText) dragDropHintText.textContent = originalHintText;

                let droppedBookmarks = [];
                const htmlData = e.dataTransfer.getData('text/html');

                if (htmlData) {
                    droppedBookmarks = parseDroppedHtmlForBookmarks(htmlData);
                } else {
                    const uriListData = e.dataTransfer.getData('text/uri-list') || e.dataTransfer.getData('URL');
                    const plainTextData = e.dataTransfer.getData('text/plain');
                    if (uriListData) {
                        droppedBookmarks = parseDroppedUriList(uriListData, plainTextData);
                    } else if (plainTextData && isValidHttpUrl(plainTextData.trim())) {
                         let name;
                         try { name = new URL(plainTextData.trim()).hostname.replace(/^www\./, ''); } catch { name = "Untitled"; }
                         droppedBookmarks.push({ name: name, url: plainTextData.trim() });
                    }
                }

                if (droppedBookmarks.length > 0) {
                    let addedCount = 0;
                    droppedBookmarks.forEach(bm => {
                        if (addSingleBookmark(bm.name, bm.url, true)) {
                            addedCount++;
                        }
                    });
                    if (addedCount > 0) {
                        saveBookmarks();
                        renderAllBookmarks();
                        console.log(`Added ${addedCount} new bookmarks.`);
                    } else {
                         console.log("No new valid bookmarks found or all were duplicates.");
                    }
                } else {
                    console.warn("Could not extract valid link(s) from the dropped item.");
                }
            });
        }
    }

    initializeApp();
});