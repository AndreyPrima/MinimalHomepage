document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    let searchForm, searchInput, searchEngineSelect, bookmarksContainer, noBookmarksMessage,
        settingsBtn, settingsModal, closeSettingsModalBtn, addBookmarkForm, bookmarkNameInput,
        bookmarkUrlInput, manageBookmarksList, defaultSearchEngineSelect, addBookmarkShortcutBtn,
        clockTime, clockDate, clockWidgetContainer, quickLinksDropzone, dragDropHintText,
        quickLinkIconSizeSelect, accentColorInput, fontFamilySelect, showClockToggle,
        clockTimeFormatSelect, quicklinkGridColumnsSelect, borderRadiusSelect,
        mainTitleTextInput, mainTitleElement,
        pageBgColorInput, cardBgColorInput, textPrimaryColorInput, accentSecondaryColorInput,
        searchNewTabToggle, showDragDropHintToggle, searxngInstanceUrlInput,
        presetButtonContainer;

    let bookmarks = [];
    const STORAGE_KEY_PREFIX = 'advDashV6.1_'; // Incremented version
    const STORAGE_KEY_BOOKMARKS = `${STORAGE_KEY_PREFIX}bookmarks`;
    const STORAGE_KEY_SEARCH_ENGINE = `${STORAGE_KEY_PREFIX}searchEngine`;
    const STORAGE_KEY_QUICKLINK_ICON_SIZE = `${STORAGE_KEY_PREFIX}qlIconSize`;
    const STORAGE_KEY_ACCENT_COLOR = `${STORAGE_KEY_PREFIX}accentPrimaryColor`;
    const STORAGE_KEY_FONT_FAMILY = `${STORAGE_KEY_PREFIX}fontFamily`;
    const STORAGE_KEY_SHOW_CLOCK = `${STORAGE_KEY_PREFIX}showClock`;
    const STORAGE_KEY_CLOCK_TIME_FORMAT = `${STORAGE_KEY_PREFIX}clockTimeFormat`;
    const STORAGE_KEY_QL_GRID_COLUMNS = `${STORAGE_KEY_PREFIX}qlGridColumns`;
    const STORAGE_KEY_BORDER_RADIUS = `${STORAGE_KEY_PREFIX}borderRadius`;
    const STORAGE_KEY_MAIN_TITLE = `${STORAGE_KEY_PREFIX}mainTitle`;
    const STORAGE_KEY_PAGE_BG_COLOR = `${STORAGE_KEY_PREFIX}pageBgColor`;
    const STORAGE_KEY_CARD_BG_COLOR = `${STORAGE_KEY_PREFIX}cardBgColor`;
    const STORAGE_KEY_TEXT_PRIMARY_COLOR = `${STORAGE_KEY_PREFIX}textPrimaryColor`;
    const STORAGE_KEY_ACCENT_SECONDARY_COLOR = `${STORAGE_KEY_PREFIX}accentSecondaryColor`;
    const STORAGE_KEY_SEARCH_NEW_TAB = `${STORAGE_KEY_PREFIX}searchNewTab`;
    const STORAGE_KEY_SHOW_DRAG_DROP_HINT = `${STORAGE_KEY_PREFIX}showDragDropHint`;
    const STORAGE_KEY_SEARXNG_INSTANCE_URL = `${STORAGE_KEY_PREFIX}searxngInstanceUrl`;

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
        [STORAGE_KEY_MAIN_TITLE]: 'Dashboard',
        [STORAGE_KEY_PAGE_BG_COLOR]: '#0d1117',
        [STORAGE_KEY_CARD_BG_COLOR]: '#161b22',
        [STORAGE_KEY_TEXT_PRIMARY_COLOR]: '#c9d1d9',
        [STORAGE_KEY_ACCENT_SECONDARY_COLOR]: '#3fb950',
        [STORAGE_KEY_SEARCH_NEW_TAB]: true,
        [STORAGE_KEY_SHOW_DRAG_DROP_HINT]: true,
        [STORAGE_KEY_SEARXNG_INSTANCE_URL]: '', 
    };
    
    const SEARXNG_DEFAULT_PLACEHOLDER = "e.g., https://searx.example.com"; 

    const COLOR_PRESETS = {
        defaultDark: {
            [STORAGE_KEY_PAGE_BG_COLOR]: '#0d1117', [STORAGE_KEY_CARD_BG_COLOR]: '#161b22', [STORAGE_KEY_TEXT_PRIMARY_COLOR]: '#c9d1d9',
            [STORAGE_KEY_ACCENT_COLOR]: '#58a6ff', [STORAGE_KEY_ACCENT_SECONDARY_COLOR]: '#3fb950',
        },
        // Nordic Light removed
        oceanicBlue: {
            [STORAGE_KEY_PAGE_BG_COLOR]: '#0f2027', [STORAGE_KEY_CARD_BG_COLOR]: '#203a43', [STORAGE_KEY_TEXT_PRIMARY_COLOR]: '#e0e0e0',
            [STORAGE_KEY_ACCENT_COLOR]: '#2c5364', [STORAGE_KEY_ACCENT_SECONDARY_COLOR]: '#1488cc',
        },
        forestGreen: {
            [STORAGE_KEY_PAGE_BG_COLOR]: '#1a2a24', [STORAGE_KEY_CARD_BG_COLOR]: '#2d4239', [STORAGE_KEY_TEXT_PRIMARY_COLOR]: '#d8d8c0',
            [STORAGE_KEY_ACCENT_COLOR]: '#52796f', [STORAGE_KEY_ACCENT_SECONDARY_COLOR]: '#84a98c',
        },
        monochromeDark: {
            [STORAGE_KEY_PAGE_BG_COLOR]: '#121212', [STORAGE_KEY_CARD_BG_COLOR]: '#1e1e1e', [STORAGE_KEY_TEXT_PRIMARY_COLOR]: '#e0e0e0',
            [STORAGE_KEY_ACCENT_COLOR]: '#bb86fc', [STORAGE_KEY_ACCENT_SECONDARY_COLOR]: '#03dac6',
        }
    };

    // --- UTILITY FUNCTIONS ---
    const getFaviconUrl = (url) => { /* ... (no changes) ... */ 
        try {
            const urlObj = new URL(url);
            return `https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${urlObj.origin}&size=32`;
        } catch (e) {
            return 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23888888"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zM11 7h2v6h-2V7zm0 8h2v2h-2v-2z"/></svg>';
        }
    };
    const isValidHttpUrl = (string) => { /* ... (no changes) ... */ 
        let url; try { url = new URL(string); } catch (_) { return false; }
        return url.protocol === "http:" || url.protocol === "https:";
    };
    const saveToLocalStorage = (key, data) => { /* ... (no changes) ... */ 
        try { localStorage.setItem(key, JSON.stringify(data)); } catch (e) { console.error("Error saving to LS:", e); } 
    };
    const loadFromLocalStorage = (key) => { /* ... (no changes) ... */ 
        try {
            const item = localStorage.getItem(key);
            return item === null ? DEFAULT_SETTINGS[key] : JSON.parse(item);
        } catch (e) { 
            console.error(`Error loading ${key} from LS:`, e); 
            return DEFAULT_SETTINGS[key]; 
        }
    };
    function hexToRgb(hex) { /* ... (no changes) ... */ 
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)] : null;
    }
    function lightenColor(hex, percent) { /* ... (no changes) ... */ 
        hex = hex.replace(/^#/, '');
        if(hex.length === 3) hex = hex.split('').map(c => c + c).join('');
        const num = parseInt(hex, 16), amt = Math.round(2.55 * percent),
              R = (num >> 16) + amt, G = (num >> 8 & 0x00FF) + amt, B = (num & 0x0000FF) + amt;
        const newHex = (0x1000000 + (R<255?R<1?0:R:255)*0x10000 + (G<255?G<1?0:G:255)*0x100 + (B<255?B<1?0:B:255)).toString(16).slice(1);
        return `#${newHex}`;
    }

    // --- CLOCK WIDGET ---
    function updateClock() { /* ... (no changes) ... */ 
        if (!clockTime || !clockDate || !DEFAULT_SETTINGS[STORAGE_KEY_SHOW_CLOCK]) return;
        const now = new Date();
        const format12h = DEFAULT_SETTINGS[STORAGE_KEY_CLOCK_TIME_FORMAT] === '12h';
        clockTime.textContent = now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit', hour12: format12h });
        clockDate.textContent = now.toLocaleDateString('ru-RU', { weekday: 'short', day: 'numeric', month: 'short' });
    }

    // --- SEARCH FUNCTIONALITY ---
    const performSearch = () => { 
        if (!searchInput || !searchEngineSelect) return;
        const query = searchInput.value.trim();
        if (!query) return;
        const engine = searchEngineSelect.value;
        let url;
        
        if (engine === 'searxng') {
            const instanceUrl = (DEFAULT_SETTINGS[STORAGE_KEY_SEARXNG_INSTANCE_URL] || "").trim();
            if (!instanceUrl || !isValidHttpUrl(instanceUrl) || instanceUrl === SEARXNG_DEFAULT_PLACEHOLDER) {
                alert("SearXNG instance URL is not set or invalid. Please set a valid instance URL in Settings -> Search (e.g., https://your.searx.instance.com). You can find instances on searx.space.");
                return;
            }
            const baseUrl = instanceUrl.endsWith('/') ? instanceUrl.slice(0, -1) : instanceUrl;
            url = `${baseUrl}/search?q=${encodeURIComponent(query)}`;
        } else {
            // Switch for other engines (no changes here, kept for brevity)
            switch (engine) {
                case 'google': url = `https://www.google.com/search?q=${encodeURIComponent(query)}`; break;
                case 'duckduckgo': url = `https://duckduckgo.com/?q=${encodeURIComponent(query)}`; break;
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
        }
        const openInNewTab = DEFAULT_SETTINGS[STORAGE_KEY_SEARCH_NEW_TAB];
        window.open(url, openInNewTab ? '_blank' : '_self');
    };


    // --- BOOKMARKS FUNCTIONALITY ---
    const toggleHintsAndMessages = () => { /* ... (no changes) ... */ 
        if (noBookmarksMessage) noBookmarksMessage.style.display = bookmarks.length === 0 ? 'block' : 'none';
        if (dragDropHintText) {
            dragDropHintText.style.setProperty('--drag-drop-hint-display', DEFAULT_SETTINGS[STORAGE_KEY_SHOW_DRAG_DROP_HINT] ? 'block' : 'none');
        }
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
        img.alt = ''; 
        img.className = 'favicon';
        img.onerror = function() { this.src = getFaviconUrl('invalid-url'); };

        const nameSpan = document.createElement('span');
        nameSpan.className = 'bookmark-name';
        nameSpan.textContent = bookmark.name;

        a.appendChild(img);
        a.appendChild(nameSpan);
        return a;
    };
    const renderBookmarks = () => { /* ... (no changes) ... */ 
        if (!bookmarksContainer) return;
        bookmarksContainer.innerHTML = '';
        bookmarks.forEach(bm => bookmarksContainer.appendChild(createBookmarkElement(bm)));
        toggleHintsAndMessages(); 
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
    const addSingleBookmark = (name, url, skipSaveAndRender = false) => { /* ... (no changes) ... */ 
        if (!name || !url || !isValidHttpUrl(url)) return false;
        if (bookmarks.some(bm => bm.url.toLowerCase() === url.toLowerCase())) return false;
        bookmarks.push({ name, url });
        if (!skipSaveAndRender) { 
            saveBookmarks(); 
            renderAllBookmarks(); 
        }
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
             if (isValidHttpUrl(titles[i])) name = ""; 

            if (!name) {
                 try { name = new URL(url).hostname.replace(/^www\./, '') || "Untitled"; } catch { name = "Untitled"; }
            }
            found.push({ name, url });
        });
        return found;
    };


    // --- SETTINGS MODAL ---
    const openSettingsModal = () => { /* ... (no changes) ... */ 
        if (settingsModal) { 
            settingsModal.style.display = 'block'; 
            settingsModal.setAttribute('aria-hidden', 'false'); 
            closeSettingsModalBtn?.focus(); 
            renderManageBookmarksList(); 
        } 
    };
    const closeSettingsModal = () => { /* ... (no changes) ... */ 
        if (settingsModal) { 
            settingsModal.style.display = 'none'; 
            settingsModal.setAttribute('aria-hidden', 'true'); 
        } 
    };

    // --- SETTINGS APPLICATION FUNCTIONS ---
    function _applyColor(cssVar, colorValue, isPrimaryAccent = false) {
        document.documentElement.style.setProperty(cssVar, colorValue);
        if (isPrimaryAccent) { // Primary accent also updates derived colors
            const rgb = hexToRgb(colorValue);
            if (rgb) {
                document.documentElement.style.setProperty('--accent-primary-hover', lightenColor(colorValue, 15));
                document.documentElement.style.setProperty('--accent-primary-shadow', `rgba(${rgb.join(',')}, 0.3)`);
                document.documentElement.style.setProperty('--accent-primary-bg-hover', `rgba(${rgb.join(',')}, 0.1)`);
                document.documentElement.style.setProperty('--drag-over-bg', `rgba(${rgb.join(',')}, 0.1)`);
                document.documentElement.style.setProperty('--drag-over-border-color', colorValue);
            }
        } else if (cssVar === '--accent-secondary') { // Secondary accent has its own hover
             document.documentElement.style.setProperty('--accent-secondary-hover', lightenColor(colorValue, 15));
        }
    }
    function applyPageBackgroundColor(color) { _applyColor('--bg-primary', color); }
    function applyCardBackgroundColor(color) { _applyColor('--bg-secondary', color); }
    function applyPrimaryTextColor(color) { _applyColor('--text-primary', color); }
    function applyPrimaryAccentColor(color) { _applyColor('--accent-primary', color, true); }
    function applySecondaryAccentColor(color) { _applyColor('--accent-secondary', color); }
    
    function applyFaviconSize(size) { /* ... (no changes) ... */ document.documentElement.style.setProperty('--favicon-size', `${size}px`); }
    function applyFontFamily(font) { /* ... (no changes) ... */ document.documentElement.style.setProperty('--app-font-family', font); }
    function applyClockVisibility(show) { /* ... (no changes) ... */ 
        DEFAULT_SETTINGS[STORAGE_KEY_SHOW_CLOCK] = show; 
        if (clockWidgetContainer) clockWidgetContainer.style.setProperty('--clock-widget-display', show ? 'flex' : 'none');
        if (show) updateClock(); 
    }
    function applyClockTimeFormat(format) { /* ... (no changes) ... */ 
        DEFAULT_SETTINGS[STORAGE_KEY_CLOCK_TIME_FORMAT] = format; updateClock(); 
    }
    function applyQuicklinkGridColumns(cols) { /* ... (no changes) ... */ 
        const value = cols === 'auto-fill' ? 'repeat(auto-fill, minmax(180px, 1fr))' : `repeat(${cols}, 1fr)`;
        document.documentElement.style.setProperty('--quicklink-grid-columns', value);
    }
    function applyBorderRadius(radius) { /* ... (no changes) ... */ 
        document.documentElement.style.setProperty('--border-radius', radius); 
    }
    function applyMainTitle(title) { /* ... (no changes) ... */ 
        if (mainTitleElement) mainTitleElement.textContent = title || DEFAULT_SETTINGS[STORAGE_KEY_MAIN_TITLE]; 
    }
    function applySearchNewTab(enabled) { /* ... (no changes) ... */ DEFAULT_SETTINGS[STORAGE_KEY_SEARCH_NEW_TAB] = enabled; }
    function applyShowDragDropHint(show) {  /* ... (no changes) ... */ 
        DEFAULT_SETTINGS[STORAGE_KEY_SHOW_DRAG_DROP_HINT] = show;
        toggleHintsAndMessages(); 
    }
    function applySearxngInstanceUrl(url) { /* ... (no changes) ... */ DEFAULT_SETTINGS[STORAGE_KEY_SEARXNG_INSTANCE_URL] = url.trim(); }

    function applyColorPreset(presetName) {
        const preset = COLOR_PRESETS[presetName];
        if (!preset) return;

        const colorSettingsMap = {
            [STORAGE_KEY_PAGE_BG_COLOR]: { input: pageBgColorInput, apply: applyPageBackgroundColor },
            [STORAGE_KEY_CARD_BG_COLOR]: { input: cardBgColorInput, apply: applyCardBackgroundColor },
            [STORAGE_KEY_TEXT_PRIMARY_COLOR]: { input: textPrimaryColorInput, apply: applyPrimaryTextColor },
            [STORAGE_KEY_ACCENT_COLOR]: { input: accentColorInput, apply: applyPrimaryAccentColor }, // Primary Accent
            [STORAGE_KEY_ACCENT_SECONDARY_COLOR]: { input: accentSecondaryColorInput, apply: applySecondaryAccentColor },
        };

        for (const key in preset) {
            if (colorSettingsMap[key]) {
                const { input, apply } = colorSettingsMap[key];
                const value = preset[key];
                if (input) input.value = value;
                if (apply) apply(value);
                saveToLocalStorage(key, value);
                DEFAULT_SETTINGS[key] = value; // Update runtime default
            }
        }
    }


    // --- LOAD & SAVE SETTINGS ---
    const loadAllSettings = () => {
        const settingsConfig = [
            { key: STORAGE_KEY_FONT_FAMILY, applyFunc: applyFontFamily, element: fontFamilySelect },
            { key: STORAGE_KEY_MAIN_TITLE, applyFunc: applyMainTitle, element: mainTitleTextInput },
            { key: STORAGE_KEY_BORDER_RADIUS, applyFunc: applyBorderRadius, element: borderRadiusSelect },
            
            { key: STORAGE_KEY_PAGE_BG_COLOR, applyFunc: applyPageBackgroundColor, element: pageBgColorInput },
            { key: STORAGE_KEY_CARD_BG_COLOR, applyFunc: applyCardBackgroundColor, element: cardBgColorInput },
            { key: STORAGE_KEY_TEXT_PRIMARY_COLOR, applyFunc: applyPrimaryTextColor, element: textPrimaryColorInput },
            { key: STORAGE_KEY_ACCENT_COLOR, applyFunc: applyPrimaryAccentColor, element: accentColorInput },
            { key: STORAGE_KEY_ACCENT_SECONDARY_COLOR, applyFunc: applySecondaryAccentColor, element: accentSecondaryColorInput },
            
            { key: STORAGE_KEY_SHOW_CLOCK, applyFunc: applyClockVisibility, element: showClockToggle, type: 'checkbox' },
            { key: STORAGE_KEY_CLOCK_TIME_FORMAT, applyFunc: applyClockTimeFormat, element: clockTimeFormatSelect },
            
            { key: STORAGE_KEY_SEARCH_ENGINE, applyFunc: (val) => { if(searchEngineSelect) searchEngineSelect.value = val; if(defaultSearchEngineSelect) defaultSearchEngineSelect.value = val; DEFAULT_SETTINGS[STORAGE_KEY_SEARCH_ENGINE] = val; }, element: defaultSearchEngineSelect },
            { key: STORAGE_KEY_SEARXNG_INSTANCE_URL, applyFunc: applySearxngInstanceUrl, element: searxngInstanceUrlInput},
            { key: STORAGE_KEY_SEARCH_NEW_TAB, applyFunc: applySearchNewTab, element: searchNewTabToggle, type: 'checkbox'},
            
            { key: STORAGE_KEY_QUICKLINK_ICON_SIZE, applyFunc: applyFaviconSize, element: quickLinkIconSizeSelect },
            { key: STORAGE_KEY_QL_GRID_COLUMNS, applyFunc: applyQuicklinkGridColumns, element: quicklinkGridColumnsSelect },
            { key: STORAGE_KEY_SHOW_DRAG_DROP_HINT, applyFunc: applyShowDragDropHint, element: showDragDropHintToggle, type: 'checkbox'},
        ];

        settingsConfig.forEach(s => {
            const value = loadFromLocalStorage(s.key);
            DEFAULT_SETTINGS[s.key] = value; 
            if (s.element) {
                if (s.type === 'checkbox') s.element.checked = value;
                else s.element.value = value;

                // Special handling for SearXNG placeholder if loaded value is empty
                if (s.key === STORAGE_KEY_SEARXNG_INSTANCE_URL && !value) {
                    s.element.placeholder = SEARXNG_DEFAULT_PLACEHOLDER;
                }
            }
            if (s.applyFunc) s.applyFunc(value); 
        });
    };

    const createSaveSettingHandler = (key, applyFunc, isCheckbox = false) => {
        return (event) => {
            const value = isCheckbox ? event.target.checked : event.target.value;
            saveToLocalStorage(key, value);
            DEFAULT_SETTINGS[key] = value; 
            if (applyFunc) applyFunc(value);
             // Update placeholder for SearXNG if it becomes empty after a change
            if (key === STORAGE_KEY_SEARXNG_INSTANCE_URL && searxngInstanceUrlInput) {
                searxngInstanceUrlInput.placeholder = value ? "" : SEARXNG_DEFAULT_PLACEHOLDER;
            }
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
        
        quickLinkIconSizeSelect = document.getElementById('quicklink-icon-size-select');
        accentColorInput = document.getElementById('accent-color-input');
        fontFamilySelect = document.getElementById('font-family-select');
        showClockToggle = document.getElementById('show-clock-toggle');
        clockTimeFormatSelect = document.getElementById('clock-time-format-select');
        quicklinkGridColumnsSelect = document.getElementById('quicklink-grid-columns-select');
        borderRadiusSelect = document.getElementById('border-radius-select');
        mainTitleTextInput = document.getElementById('main-title-text-input');
        mainTitleElement = document.getElementById('main-title-element');
        
        pageBgColorInput = document.getElementById('page-bg-color-input');
        cardBgColorInput = document.getElementById('card-bg-color-input');
        textPrimaryColorInput = document.getElementById('text-primary-color-input');
        accentSecondaryColorInput = document.getElementById('accent-secondary-color-input');
        searchNewTabToggle = document.getElementById('search-new-tab-toggle');
        showDragDropHintToggle = document.getElementById('show-drag-drop-hint-toggle');
        searxngInstanceUrlInput = document.getElementById('searxng-instance-url-input');
        presetButtonContainer = document.querySelector('.preset-buttons');


        loadAllSettings(); 
        loadBookmarks();   
        
        updateClock(); 
        if(DEFAULT_SETTINGS[STORAGE_KEY_SHOW_CLOCK]) setInterval(updateClock, 30000);


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
        if (defaultSearchEngineSelect) defaultSearchEngineSelect.addEventListener('change', createSaveSettingHandler(STORAGE_KEY_SEARCH_ENGINE, (val) => { if(searchEngineSelect) searchEngineSelect.value = val; DEFAULT_SETTINGS[STORAGE_KEY_SEARCH_ENGINE] = val; }));
        if (quickLinkIconSizeSelect) quickLinkIconSizeSelect.addEventListener('change', createSaveSettingHandler(STORAGE_KEY_QUICKLINK_ICON_SIZE, applyFaviconSize));
        
        if (accentColorInput) accentColorInput.addEventListener('input', createSaveSettingHandler(STORAGE_KEY_ACCENT_COLOR, applyPrimaryAccentColor));
        if (fontFamilySelect) fontFamilySelect.addEventListener('change', createSaveSettingHandler(STORAGE_KEY_FONT_FAMILY, applyFontFamily));
        if (showClockToggle) showClockToggle.addEventListener('change', createSaveSettingHandler(STORAGE_KEY_SHOW_CLOCK, applyClockVisibility, true));
        if (clockTimeFormatSelect) clockTimeFormatSelect.addEventListener('change', createSaveSettingHandler(STORAGE_KEY_CLOCK_TIME_FORMAT, applyClockTimeFormat));
        if (quicklinkGridColumnsSelect) quicklinkGridColumnsSelect.addEventListener('change', createSaveSettingHandler(STORAGE_KEY_QL_GRID_COLUMNS, applyQuicklinkGridColumns));
        if (borderRadiusSelect) borderRadiusSelect.addEventListener('change', createSaveSettingHandler(STORAGE_KEY_BORDER_RADIUS, applyBorderRadius));
        if (mainTitleTextInput) mainTitleTextInput.addEventListener('input', createSaveSettingHandler(STORAGE_KEY_MAIN_TITLE, applyMainTitle));
        
        if (pageBgColorInput) pageBgColorInput.addEventListener('input', createSaveSettingHandler(STORAGE_KEY_PAGE_BG_COLOR, applyPageBackgroundColor));
        if (cardBgColorInput) cardBgColorInput.addEventListener('input', createSaveSettingHandler(STORAGE_KEY_CARD_BG_COLOR, applyCardBackgroundColor));
        if (textPrimaryColorInput) textPrimaryColorInput.addEventListener('input', createSaveSettingHandler(STORAGE_KEY_TEXT_PRIMARY_COLOR, applyPrimaryTextColor));
        if (accentSecondaryColorInput) accentSecondaryColorInput.addEventListener('input', createSaveSettingHandler(STORAGE_KEY_ACCENT_SECONDARY_COLOR, applySecondaryAccentColor));
        if (searchNewTabToggle) searchNewTabToggle.addEventListener('change', createSaveSettingHandler(STORAGE_KEY_SEARCH_NEW_TAB, applySearchNewTab, true));
        if (showDragDropHintToggle) showDragDropHintToggle.addEventListener('change', createSaveSettingHandler(STORAGE_KEY_SHOW_DRAG_DROP_HINT, applyShowDragDropHint, true));
        if (searxngInstanceUrlInput) searxngInstanceUrlInput.addEventListener('change', createSaveSettingHandler(STORAGE_KEY_SEARXNG_INSTANCE_URL, applySearxngInstanceUrl));

        if (presetButtonContainer) {
            presetButtonContainer.addEventListener('click', (e) => {
                if (e.target.classList.contains('preset-btn')) {
                    const presetName = e.target.dataset.preset;
                    if (presetName) {
                        applyColorPreset(presetName);
                    }
                }
            });
        }
        

        if (quickLinksDropzone) { /* ... (Drop logic, no changes needed here for brevity) ... */
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
                    if (addedCount > 0) { 
                        saveBookmarks(); 
                        renderAllBookmarks(); 
                    }
                } else {
                    console.warn("Could not extract any valid link(s) from the dropped item.");
                }
            });
        } 
    } 

    initializeApp();
});