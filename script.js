document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    let searchForm, searchInput, searchEngineSelect, bookmarksContainer, noBookmarksMessage,
        settingsBtn, settingsModal, closeSettingsModalBtn, addBookmarkForm, bookmarkNameInput,
        bookmarkUrlInput, manageBookmarksList, defaultSearchEngineSelect, addBookmarkShortcutBtn,
        clockTime, clockDate, clockWidgetContainer, quickLinksDropzone, dragDropHintText,
        quickLinkIconSizeSelect, accentColorInput, fontFamilySelect, showClockToggle,
        clockTimeFormatSelect, quicklinkGridColumnsSelect, borderRadiusSelect,
        mainTitleTextInput, mainTitleElement;

    let bookmarks = [];
    // Storage Keys
    const STORAGE_KEY_PREFIX = 'dashboardAdvancedV4_';
    const STORAGE_KEY_BOOKMARKS = `${STORAGE_KEY_PREFIX}bookmarks`;
    const STORAGE_KEY_SEARCH_ENGINE = `${STORAGE_KEY_PREFIX}searchEngine`;
    const STORAGE_KEY_QUICKLINK_ICON_SIZE = `${STORAGE_KEY_PREFIX}qlIconSize`;
    const STORAGE_KEY_ACCENT_COLOR = `${STORAGE_KEY_PREFIX}accentColor`;
    const STORAGE_KEY_FONT_FAMILY = `${STORAGE_KEY_PREFIX}fontFamily`;
    const STORAGE_KEY_SHOW_CLOCK = `${STORAGE_KEY_PREFIX}showClock`;
    const STORAGE_KEY_CLOCK_TIME_FORMAT = `${STORAGE_KEY_PREFIX}clockTimeFormat`;
    const STORAGE_KEY_QL_GRID_COLUMNS = `${STORAGE_KEY_PREFIX}qlGridColumns`;
    const STORAGE_KEY_BORDER_RADIUS = `${STORAGE_KEY_PREFIX}borderRadius`;
    const STORAGE_KEY_MAIN_TITLE = `${STORAGE_KEY_PREFIX}mainTitle`;

    // Default Settings Values
    const DEFAULT_SETTINGS = {
        [STORAGE_KEY_BOOKMARKS]: [{ name: "GitHub", url: "https://github.com" }, { name: "MDN Web Docs", url: "https://developer.mozilla.org/" }],
        [STORAGE_KEY_SEARCH_ENGINE]: 'google',
        [STORAGE_KEY_QUICKLINK_ICON_SIZE]: '18',
        [STORAGE_KEY_ACCENT_COLOR]: '#58a6ff',
        [STORAGE_KEY_FONT_FAMILY]: "'Inter', sans-serif",
        [STORAGE_KEY_SHOW_CLOCK]: true,
        [STORAGE_KEY_CLOCK_TIME_FORMAT]: '24h',
        [STORAGE_KEY_QL_GRID_COLUMNS]: 'auto-fill',
        [STORAGE_KEY_BORDER_RADIUS]: '6px',
        [STORAGE_KEY_MAIN_TITLE]: 'Dashboard'
    };

    // --- UTILITY FUNCTIONS ---
    const getFaviconUrl = (url) => {
        try {
            const urlObj = new URL(url);
            return `https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${urlObj.origin}&size=32`;
        } catch (e) {
            return 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23888888"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zM11 7h2v6h-2V7zm0 8h2v2h-2v-2z"/></svg>';
        }
    };
    const isValidHttpUrl = (string) => {
        let url; try { url = new URL(string); } catch (_) { return false; }
        return url.protocol === "http:" || url.protocol === "https:";
    };
    const saveToLocalStorage = (key, data) => { try { localStorage.setItem(key, JSON.stringify(data)); } catch (e) { console.error("Error saving to LS:", e); } };
    const loadFromLocalStorage = (key) => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : DEFAULT_SETTINGS[key];
        } catch (e) { console.error("Error loading from LS:", e); return DEFAULT_SETTINGS[key]; }
    };
    function hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)] : null;
    }
    function lightenColor(hex, percent) {
        hex = hex.replace(/^#/, '');
        const num = parseInt(hex, 16), amt = Math.round(2.55 * percent),
              R = (num >> 16) + amt, G = (num >> 8 & 0x00FF) + amt, B = (num & 0x0000FF) + amt;
        const newHex = (0x1000000 + (R<255?R<1?0:R:255)*0x10000 + (G<255?G<1?0:G:255)*0x100 + (B<255?B<1?0:B:255)).toString(16).slice(1);
        return `#${newHex}`;
    }

    // --- CLOCK WIDGET ---
    function updateClock() {
        if (!clockTime || !clockDate || !DEFAULT_SETTINGS[STORAGE_KEY_SHOW_CLOCK]) return;
        const now = new Date();
        const format12h = DEFAULT_SETTINGS[STORAGE_KEY_CLOCK_TIME_FORMAT] === '12h';
        clockTime.textContent = now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit', hour12: format12h });
        clockDate.textContent = now.toLocaleDateString('ru-RU', { weekday: 'short', day: 'numeric', month: 'short' });
    }

    // --- SEARCH FUNCTIONALITY ---
    const performSearch = () => { /* ... (no changes, kept for brevity) ... */ 
        if (!searchInput || !searchEngineSelect) return;
        const query = searchInput.value.trim();
        if (!query) return;
        const engine = searchEngineSelect.value;
        let url;
        switch (engine) {
            case 'google': url = `https://www.google.com/search?q=${encodeURIComponent(query)}`; break;
            case 'duckduckgo': url = `https://duckduckgo.com/?q=${encodeURIComponent(query)}`; break;
            case 'searxng': url = `https://searx.be/search?q=${encodeURIComponent(query)}`; break;
            case 'brave': url = `https://search.brave.com/search?q=${encodeURIComponent(query)}`; break;
            case 'startpage': url = `https://www.startpage.com/do/search?q=${encodeURIComponent(query)}`; break;
            case 'qwant': url = `https://www.qwant.com/?q=${encodeURIComponent(query)}`; break;
            case 'ecosia': url = `https://www.ecosia.org/search?q=${encodeURIComponent(query)}`; break;
            case 'swisscows': url = `https://swisscows.com/web?query=${encodeURIComponent(query)}`; break;
            case 'metager': url = `https://metager.org/meta/meta.ger3?eingabe=${encodeURIComponent(query)}`; break;
            case 'mojeek': url = `https://www.mojeek.com/search?q=${encodeURIComponent(query)}`; break;
            case 'wolfram': url = `https://www.wolframalpha.com/input/?i=${encodeURIComponent(query)}`; break;
            case 'wikipedia': url = `https://ru.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(query)}`; break;
            case 'youtube': url = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`; break;
            case 'github': url = `https://github.com/search?q=${encodeURIComponent(query)}`; break;
            case 'stackoverflow': url = `https://stackoverflow.com/search?q=${encodeURIComponent(query)}`; break;
            case 'reddit': url = `https://www.reddit.com/search/?q=${encodeURIComponent(query)}`; break;
            case 'npm': url = `https://www.npmjs.com/search?q=${encodeURIComponent(query)}`; break;
            case 'archiveorg': url = `https://archive.org/search.php?query=${encodeURIComponent(query)}`; break;
            case 'openverse': url = `https://openverse.org/search/?q=${encodeURIComponent(query)}`; break;
            case 'unsplash': url = `https://unsplash.com/s/photos/${encodeURIComponent(query)}`; break;
            case 'yandex': url = `https://yandex.ru/search/?text=${encodeURIComponent(query)}`; break;
            case 'bing': url = `https://www.bing.com/search?q=${encodeURIComponent(query)}`; break;
            default: url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
        }
        window.open(url, '_blank');
        // searchInput.value = ''; // User might want to keep it
    };


    // --- BOOKMARKS FUNCTIONALITY ---
    const toggleNoBookmarksMessage = () => {
        if (noBookmarksMessage) noBookmarksMessage.style.display = bookmarks.length === 0 ? 'block' : 'none';
        if (dragDropHintText) dragDropHintText.style.display = 'block'; // Always show hint or based on a setting
    };
    const createBookmarkElement = (bookmark) => { /* ... (no changes) ... */ 
        const a = document.createElement('a');
        a.href = bookmark.url;
        a.className = 'bookmark-item';
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.draggable = true;
        a.dataset.url = bookmark.url;
        a.dataset.name = bookmark.name;

        const img = document.createElement('img');
        img.src = getFaviconUrl(bookmark.url);
        img.alt = ''; // Decorative
        img.className = 'favicon';
        img.onerror = function() { this.src = getFaviconUrl('invalid-url'); };

        const nameSpan = document.createElement('span');
        nameSpan.className = 'bookmark-name';
        nameSpan.textContent = bookmark.name;

        a.appendChild(img);
        a.appendChild(nameSpan);
        return a;
    };
    const renderBookmarks = () => {
        if (!bookmarksContainer) return;
        bookmarksContainer.innerHTML = '';
        bookmarks.forEach(bm => bookmarksContainer.appendChild(createBookmarkElement(bm)));
        toggleNoBookmarksMessage();
    };
    const renderManageBookmarksList = () => { /* ... (no changes) ... */
        if (!manageBookmarksList) return;
        manageBookmarksList.innerHTML = '';
        bookmarks.forEach((bookmark, index) => {
            const li = document.createElement('li');
            const infoDiv = document.createElement('div');
            infoDiv.className = 'bookmark-info';
            infoDiv.textContent = bookmark.name;

            const urlSmall = document.createElement('span');
            urlSmall.className = 'bookmark-url-small';
            urlSmall.textContent = bookmark.url;
            infoDiv.appendChild(urlSmall);

            const deleteBtn = document.createElement('button');
            deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
            deleteBtn.className = 'icon-btn delete-bookmark-btn small-btn';
            deleteBtn.setAttribute('aria-label', `Delete ${bookmark.name}`);
            deleteBtn.dataset.index = index;

            deleteBtn.addEventListener('click', () => {
                bookmarks.splice(index, 1);
                saveBookmarks();
                renderAllBookmarks();
            });

            li.appendChild(infoDiv);
            li.appendChild(deleteBtn);
            manageBookmarksList.appendChild(li);
        });
    };
    const renderAllBookmarks = () => { renderBookmarks(); renderManageBookmarksList(); };
    const saveBookmarks = () => saveToLocalStorage(STORAGE_KEY_BOOKMARKS, bookmarks);
    const addSingleBookmark = (name, url, skipSaveAndRender = false) => {
        if (!name || !url || !isValidHttpUrl(url)) return false;
        if (bookmarks.some(bm => bm.url.toLowerCase() === url.toLowerCase())) return false;
        bookmarks.push({ name, url });
        if (!skipSaveAndRender) { saveBookmarks(); renderAllBookmarks(); }
        return true;
    };
    const loadBookmarks = () => { bookmarks = loadFromLocalStorage(STORAGE_KEY_BOOKMARKS); renderAllBookmarks(); };

    // --- DRAG & DROP BOOKMARKS ---
    const parseDroppedHtmlForBookmarks = (htmlString) => { /* ... (no changes) ... */ 
        const found = [];
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlString, 'text/html');
        const links = doc.querySelectorAll('a');
        links.forEach(link => {
            const url = link.href;
            let name = link.textContent.trim() || link.title.trim();
            if (isValidHttpUrl(url)) {
                if (!name) {
                     try { name = new URL(url).hostname.replace(/^www\./, '') || "Untitled"; } catch { name = "Untitled"; }
                }
                found.push({name, url});
            }
        });
        return found;
    };
    const parseDroppedUriList = (uriListString, plainTextString = "") => { /* ... (no changes) ... */ 
        const urls = uriListString.split('\n').map(u => u.trim()).filter(u => u && !u.startsWith('#') && isValidHttpUrl(u));
        const titles = plainTextString.split('\n').map(t => t.trim());
        const found = [];
        urls.forEach((url, i) => {
            let name = titles[i] || "";
             if (isValidHttpUrl(titles[i])) name = ""; // if title is a URL, ignore it as name

            if (!name) {
                 try { name = new URL(url).hostname.replace(/^www\./, '') || "Untitled"; } catch { name = "Untitled"; }
            }
            found.push({ name, url });
        });
        return found;
    };


    // --- SETTINGS MODAL ---
    const openSettingsModal = () => { if (settingsModal) { settingsModal.style.display = 'block'; settingsModal.setAttribute('aria-hidden', 'false'); closeSettingsModalBtn?.focus(); renderManageBookmarksList(); } };
    const closeSettingsModal = () => { if (settingsModal) { settingsModal.style.display = 'none'; settingsModal.setAttribute('aria-hidden', 'true'); } };

    // --- SETTINGS APPLICATION FUNCTIONS ---
    const applySetting = (key, value) => {
        DEFAULT_SETTINGS[key] = value; // Update runtime default for current session
        document.documentElement.style.setProperty(`--${key.replace(/_/g, '-')}-css`, value); // Generic for CSS vars if named consistently
    };

    function applyFaviconSize(size) { document.documentElement.style.setProperty('--favicon-size', `${size}px`); }
    function applyAccentColor(color) {
        document.documentElement.style.setProperty('--accent-primary', color);
        const rgb = hexToRgb(color);
        if (rgb) {
            document.documentElement.style.setProperty('--accent-primary-hover', lightenColor(color, 15)); // Lighten slightly less
            document.documentElement.style.setProperty('--accent-primary-shadow', `rgba(${rgb.join(',')}, 0.3)`);
            document.documentElement.style.setProperty('--accent-primary-bg-hover', `rgba(${rgb.join(',')}, 0.1)`);
            document.documentElement.style.setProperty('--drag-over-bg', `rgba(${rgb.join(',')}, 0.1)`);
            document.documentElement.style.setProperty('--drag-over-border-color', color);
        }
    }
    function applyFontFamily(font) { document.documentElement.style.setProperty('--app-font-family', font); }
    function applyClockVisibility(show) {
        DEFAULT_SETTINGS[STORAGE_KEY_SHOW_CLOCK] = show; // Update runtime value
        if (clockWidgetContainer) clockWidgetContainer.style.setProperty('--clock-widget-display', show ? 'flex' : 'none');
        if (show) updateClock(); // Update immediately if shown
    }
    function applyClockTimeFormat(format) { DEFAULT_SETTINGS[STORAGE_KEY_CLOCK_TIME_FORMAT] = format; updateClock(); }
    function applyQuicklinkGridColumns(cols) {
        const value = cols === 'auto-fill' ? 'repeat(auto-fill, minmax(180px, 1fr))' : `repeat(${cols}, 1fr)`;
        document.documentElement.style.setProperty('--quicklink-grid-columns', value);
    }
    function applyBorderRadius(radius) { document.documentElement.style.setProperty('--border-radius', radius); }
    function applyMainTitle(title) { if (mainTitleElement) mainTitleElement.textContent = title || DEFAULT_SETTINGS[STORAGE_KEY_MAIN_TITLE]; }

    // --- LOAD & SAVE SETTINGS ---
    const loadAllSettings = () => {
        // Order matters for dependencies (e.g. clock format before updateClock)
        const settingsToLoad = [
            { key: STORAGE_KEY_FONT_FAMILY, applyFunc: applyFontFamily, element: fontFamilySelect },
            { key: STORAGE_KEY_ACCENT_COLOR, applyFunc: applyAccentColor, element: accentColorInput },
            { key: STORAGE_KEY_BORDER_RADIUS, applyFunc: applyBorderRadius, element: borderRadiusSelect },
            { key: STORAGE_KEY_MAIN_TITLE, applyFunc: applyMainTitle, element: mainTitleTextInput },
            { key: STORAGE_KEY_SHOW_CLOCK, applyFunc: applyClockVisibility, element: showClockToggle, type: 'checkbox' },
            { key: STORAGE_KEY_CLOCK_TIME_FORMAT, applyFunc: applyClockTimeFormat, element: clockTimeFormatSelect },
            { key: STORAGE_KEY_SEARCH_ENGINE, applyFunc: (val) => { if(searchEngineSelect) searchEngineSelect.value = val; if(defaultSearchEngineSelect) defaultSearchEngineSelect.value = val; }, element: defaultSearchEngineSelect },
            { key: STORAGE_KEY_QUICKLINK_ICON_SIZE, applyFunc: applyFaviconSize, element: quickLinkIconSizeSelect },
            { key: STORAGE_KEY_QL_GRID_COLUMNS, applyFunc: applyQuicklinkGridColumns, element: quicklinkGridColumnsSelect },
        ];

        settingsToLoad.forEach(s => {
            const value = loadFromLocalStorage(s.key);
            DEFAULT_SETTINGS[s.key] = value; // Ensure runtime defaults are up-to-date
            if (s.element) {
                if (s.type === 'checkbox') s.element.checked = value;
                else s.element.value = value;
            }
            if (s.applyFunc) s.applyFunc(value);
        });
    };

    const createSaveSettingHandler = (key, applyFunc, isCheckbox = false) => {
        return (event) => {
            const value = isCheckbox ? event.target.checked : event.target.value;
            saveToLocalStorage(key, value);
            DEFAULT_SETTINGS[key] = value; // Update runtime for immediate effect
            if (applyFunc) applyFunc(value);
        };
    };
    
    // --- INITIALIZATION ---
    function initializeApp() {
        // Assign DOM Elements
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
        clockWidgetContainer = document.getElementById('clock-widget-container');
        quickLinksDropzone = document.getElementById('quick-links-dropzone');
        dragDropHintText = document.getElementById('drag-drop-hint-text');
        // New settings elements
        quickLinkIconSizeSelect = document.getElementById('quicklink-icon-size-select');
        accentColorInput = document.getElementById('accent-color-input');
        fontFamilySelect = document.getElementById('font-family-select');
        showClockToggle = document.getElementById('show-clock-toggle');
        clockTimeFormatSelect = document.getElementById('clock-time-format-select');
        quicklinkGridColumnsSelect = document.getElementById('quicklink-grid-columns-select');
        borderRadiusSelect = document.getElementById('border-radius-select');
        mainTitleTextInput = document.getElementById('main-title-text-input');
        mainTitleElement = document.getElementById('main-title-element');

        // Initial Data Load & UI Update
        loadAllSettings(); // Load all settings first
        loadBookmarks();   // Load bookmarks
        
        updateClock(); // Initial clock update based on loaded settings
        const clockIntervalSetting = DEFAULT_SETTINGS[STORAGE_KEY_SHOW_CLOCK];
        if(clockIntervalSetting) setInterval(updateClock, 30000);


        // Event Listeners
        if (searchForm) searchForm.addEventListener('submit', (e) => { e.preventDefault(); performSearch(); });
        if (addBookmarkForm) { /* ... (no changes) ... */ 
            addBookmarkForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const name = bookmarkNameInput.value.trim();
                const url = bookmarkUrlInput.value.trim();
                if (addSingleBookmark(name, url)) {
                    bookmarkNameInput.value = '';
                    bookmarkUrlInput.value = '';
                    if (settingsModal && settingsModal.style.display === 'block') {
                        renderManageBookmarksList();
                    }
                } else {
                    alert("Failed to add bookmark. Name and URL are required, URL must be valid and not a duplicate.");
                }
            });
        }

        if (settingsBtn) settingsBtn.addEventListener('click', openSettingsModal);
        if (closeSettingsModalBtn) closeSettingsModalBtn.addEventListener('click', closeSettingsModal);
        if (addBookmarkShortcutBtn) addBookmarkShortcutBtn.addEventListener('click', () => { openSettingsModal(); setTimeout(() => bookmarkNameInput?.focus(), 100); });
        
        window.addEventListener('click', (e) => { if (settingsModal && e.target === settingsModal) closeSettingsModal(); });
        window.addEventListener('keydown', (e) => { if (settingsModal && settingsModal.style.display === 'block' && e.key === 'Escape') closeSettingsModal(); });

        // Settings Event Listeners
        if (defaultSearchEngineSelect) defaultSearchEngineSelect.addEventListener('change', createSaveSettingHandler(STORAGE_KEY_SEARCH_ENGINE, (val) => { if(searchEngineSelect) searchEngineSelect.value = val; }));
        if (quickLinkIconSizeSelect) quickLinkIconSizeSelect.addEventListener('change', createSaveSettingHandler(STORAGE_KEY_QUICKLINK_ICON_SIZE, applyFaviconSize));
        if (accentColorInput) accentColorInput.addEventListener('input', createSaveSettingHandler(STORAGE_KEY_ACCENT_COLOR, applyAccentColor));
        if (fontFamilySelect) fontFamilySelect.addEventListener('change', createSaveSettingHandler(STORAGE_KEY_FONT_FAMILY, applyFontFamily));
        if (showClockToggle) showClockToggle.addEventListener('change', createSaveSettingHandler(STORAGE_KEY_SHOW_CLOCK, applyClockVisibility, true));
        if (clockTimeFormatSelect) clockTimeFormatSelect.addEventListener('change', createSaveSettingHandler(STORAGE_KEY_CLOCK_TIME_FORMAT, applyClockTimeFormat));
        if (quicklinkGridColumnsSelect) quicklinkGridColumnsSelect.addEventListener('change', createSaveSettingHandler(STORAGE_KEY_QL_GRID_COLUMNS, applyQuicklinkGridColumns));
        if (borderRadiusSelect) borderRadiusSelect.addEventListener('change', createSaveSettingHandler(STORAGE_KEY_BORDER_RADIUS, applyBorderRadius));
        if (mainTitleTextInput) mainTitleTextInput.addEventListener('input', createSaveSettingHandler(STORAGE_KEY_MAIN_TITLE, applyMainTitle));
        

        if (quickLinksDropzone) { /* ... (no changes to drop logic itself) ... */
            const originalHintText = dragDropHintText ? dragDropHintText.textContent : "Drag & drop web links or selected bookmarks here!";
            
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

                let processedBookmarks = [];
                const htmlData = e.dataTransfer.getData('text/html');

                if (htmlData) {
                    const parsedFromHtml = parseDroppedHtmlForBookmarks(htmlData);
                    if (Array.isArray(parsedFromHtml)) processedBookmarks = parsedFromHtml;
                } else {
                    const uriListData = e.dataTransfer.getData('text/uri-list') || e.dataTransfer.getData('URL');
                    const plainTextData = e.dataTransfer.getData('text/plain');

                    if (uriListData) {
                        const parsedFromUriList = parseDroppedUriList(uriListData, plainTextData);
                        if (Array.isArray(parsedFromUriList)) processedBookmarks = parsedFromUriList;
                    } else if (plainTextData && isValidHttpUrl(plainTextData.trim())) {
                         let name = "Untitled Link";
                         try {
                             const urlObj = new URL(plainTextData.trim());
                             name = urlObj.hostname.replace(/^www\./, '');
                             if (!name || name.toLowerCase() === urlObj.protocol.slice(0,-1) || name === urlObj.hostname) {
                                 const pathParts = urlObj.pathname.split('/').filter(part => part.length > 0);
                                 if (pathParts.length > 0) {
                                     name = pathParts[pathParts.length - 1];
                                     if (name.includes('.')) name = name.substring(0, name.lastIndexOf('.'));
                                     name = name.replace(/[-_]/g, ' ');
                                     name = name.charAt(0).toUpperCase() + name.slice(1);
                                 }
                                 if (!name || name.length < 2) name = urlObj.hostname.replace(/^www\./, '');
                                 if (!name) name = "Untitled Link";
                             }
                         } catch (err) {
                             const lines = plainTextData.trim().split('\n');
                             if (lines.length > 1 && !isValidHttpUrl(lines[0].trim())) name = lines[0].trim();
                             else name = "Untitled Link";
                         }
                         processedBookmarks.push({ name: name, url: plainTextData.trim() });
                    }
                }

                if (processedBookmarks.length > 0) {
                    let addedCount = 0;
                    processedBookmarks.forEach(bm => {
                        if (bm && typeof bm.name === 'string' && typeof bm.url === 'string' && isValidHttpUrl(bm.url)) {
                            if (addSingleBookmark(bm.name, bm.url, true)) addedCount++;
                        }
                    });
                    if (addedCount > 0) { saveBookmarks(); renderAllBookmarks(); }
                } else {
                    console.warn("Could not extract any valid link(s) from the dropped item.");
                }
            });
        }
    } // end of initializeApp

    initializeApp();
});