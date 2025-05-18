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
        presetButtonContainer,
        deleteAllBookmarksBtn, // New
        backgroundImageInput, clearBackgroundImageBtn, // New
        addFolderForm, folderNameInput, parentFolderSelectForNewFolder, // New
        parentFolderSelectForBookmark, // New
        recentActivitySection, recentActivityContainer, noRecentActivityMessage, // New
        quickLinksTitle, backToParentFolderBtn; // New

    let bookmarks = []; // Will now store items with types (link/folder) and potentially children
    let recentActivity = []; // New
    let currentFolderPath = []; // Array of folder IDs representing the path to the current view

    const STORAGE_KEY_PREFIX = 'advDashV6.2_'; // Incremented version for new features
    const STORAGE_KEY_BOOKMARKS = `${STORAGE_KEY_PREFIX}bookmarks_structured`; // New key for new structure
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
    const STORAGE_KEY_BACKGROUND_IMAGE = `${STORAGE_KEY_PREFIX}backgroundImageDataUrl`; // New
    const STORAGE_KEY_RECENT_ACTIVITY = `${STORAGE_KEY_PREFIX}recentActivity`; // New
    
    const MAX_RECENT_ACTIVITY = 10;

    const DEFAULT_SETTINGS = {
        [STORAGE_KEY_BOOKMARKS]: [{id: generateId(), type: 'link', name: "GitHub", url: "https://github.com" }, { id: generateId(), type: 'link', name: "MDN Web Docs", url: "https://developer.mozilla.org/" }],
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
        [STORAGE_KEY_BACKGROUND_IMAGE]: null,
        [STORAGE_KEY_RECENT_ACTIVITY]: [],
    };
    
    const SEARXNG_DEFAULT_PLACEHOLDER = "e.g., https://searx.example.com"; 

    const COLOR_PRESETS = {
        defaultDark: {
            [STORAGE_KEY_PAGE_BG_COLOR]: '#0d1117', [STORAGE_KEY_CARD_BG_COLOR]: '#161b22', [STORAGE_KEY_TEXT_PRIMARY_COLOR]: '#c9d1d9',
            [STORAGE_KEY_ACCENT_COLOR]: '#58a6ff', [STORAGE_KEY_ACCENT_SECONDARY_COLOR]: '#3fb950',
        },
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
    const generateId = () => Date.now().toString(36) + Math.random().toString(36).substring(2);

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
    const saveToLocalStorage = (key, data) => { 
        try { localStorage.setItem(key, JSON.stringify(data)); } catch (e) { console.error("Error saving to LS:", e); } 
    };
    const loadFromLocalStorage = (key, isArray = false) => { 
        try {
            const item = localStorage.getItem(key);
            if (item === null) {
                return DEFAULT_SETTINGS[key] !== undefined ? DEFAULT_SETTINGS[key] : (isArray ? [] : null);
            }
            return JSON.parse(item);
        } catch (e) { 
            console.error(`Error loading ${key} from LS:`, e); 
            return DEFAULT_SETTINGS[key] !== undefined ? DEFAULT_SETTINGS[key] : (isArray ? [] : null);
        }
    };
    function hexToRgb(hex) { 
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)] : null;
    }
    function lightenColor(hex, percent) { 
        hex = hex.replace(/^#/, '');
        if(hex.length === 3) hex = hex.split('').map(c => c + c).join('');
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

    // --- RECENT ACTIVITY ---
    const addRecentActivity = (name, url) => {
        if (!name || !url) return;
        recentActivity = recentActivity.filter(item => item.url !== url); // Remove existing to move to top
        recentActivity.unshift({ name, url, favicon: getFaviconUrl(url), timestamp: Date.now() });
        if (recentActivity.length > MAX_RECENT_ACTIVITY) {
            recentActivity.pop();
        }
        saveToLocalStorage(STORAGE_KEY_RECENT_ACTIVITY, recentActivity);
        renderRecentActivity();
    };

    const renderRecentActivity = () => {
        if (!recentActivityContainer || !recentActivitySection) return;
        recentActivityContainer.innerHTML = '';
        if (recentActivity.length === 0) {
            if (noRecentActivityMessage) noRecentActivityMessage.style.display = 'block';
            recentActivitySection.style.display = 'none';
            return;
        }
        
        if (noRecentActivityMessage) noRecentActivityMessage.style.display = 'none';
        recentActivitySection.style.display = 'block';

        recentActivity.forEach(item => {
            const activityLink = document.createElement('a');
            activityLink.href = item.url;
            activityLink.className = 'recent-activity-item';
            activityLink.target = '_blank';
            activityLink.rel = 'noopener noreferrer';
            activityLink.title = `${item.name} - ${item.url}`;

            const img = document.createElement('img');
            img.src = item.favicon || getFaviconUrl(item.url);
            img.alt = '';
            img.className = 'favicon';
            img.onerror = function() { this.src = getFaviconUrl('invalid-url'); };
            
            const nameSpan = document.createElement('span');
            nameSpan.className = 'activity-name';
            nameSpan.textContent = item.name;

            const urlSpan = document.createElement('span');
            urlSpan.className = 'activity-url';
            urlSpan.textContent = item.url.length > 40 ? item.url.substring(0, 37) + '...' : item.url;


            activityLink.appendChild(img);
            activityLink.appendChild(nameSpan);
            activityLink.appendChild(urlSpan);
            recentActivityContainer.appendChild(activityLink);
        });
    };


    // --- SEARCH FUNCTIONALITY ---
    const performSearch = () => { 
        if (!searchInput || !searchEngineSelect) return;
        const query = searchInput.value.trim();
        if (!query) return;
        const engine = searchEngineSelect.value;
        let url;
        let searchEngineName = searchEngineSelect.options[searchEngineSelect.selectedIndex].text;
        
        if (engine === 'searxng') {
            const instanceUrl = (DEFAULT_SETTINGS[STORAGE_KEY_SEARXNG_INSTANCE_URL] || "").trim();
            if (!instanceUrl || !isValidHttpUrl(instanceUrl) || instanceUrl === SEARXNG_DEFAULT_PLACEHOLDER) {
                alert("SearXNG instance URL is not set or invalid. Please set a valid instance URL in Settings -> Search (e.g., https://your.searx.instance.com). You can find instances on searx.space.");
                return;
            }
            const baseUrl = instanceUrl.endsWith('/') ? instanceUrl.slice(0, -1) : instanceUrl;
            url = `${baseUrl}/search?q=${encodeURIComponent(query)}`;
        } else {
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
        addRecentActivity(`Search: ${query} on ${searchEngineName}`, url);
        const openInNewTab = DEFAULT_SETTINGS[STORAGE_KEY_SEARCH_NEW_TAB];
        window.open(url, openInNewTab ? '_blank' : '_self');
        searchInput.value = '';
    };

    // --- BOOKMARKS & FOLDERS FUNCTIONALITY ---
    
    // Helper to get current folder's items or root items
    const getCurrentFolderItems = () => {
        let currentLevel = bookmarks;
        for (const folderId of currentFolderPath) {
            const folder = currentLevel.find(item => item.id === folderId && item.type === 'folder');
            if (folder) {
                currentLevel = folder.children;
            } else {
                // Path is invalid, reset to root
                currentFolderPath = [];
                return bookmarks;
            }
        }
        return currentLevel;
    };
    
    // Helper to find an item (link or folder) and its parent array by ID, recursively
    const findItemAndParentArray = (id, currentItems = bookmarks, parentArray = bookmarks) => {
        for (let i = 0; i < currentItems.length; i++) {
            const item = currentItems[i];
            if (item.id === id) {
                return { item, parentArray, index: i };
            }
            if (item.type === 'folder' && item.children) {
                const found = findItemAndParentArray(id, item.children, item.children);
                if (found) return found;
            }
        }
        return null;
    };
    
    // Helper to get a folder by ID
    const getFolderById = (id, items = bookmarks) => {
        for (const item of items) {
            if (item.id === id && item.type === 'folder') return item;
            if (item.type === 'folder' && item.children) {
                const found = getFolderById(id, item.children);
                if (found) return found;
            }
        }
        return null;
    };


    const toggleHintsAndMessages = () => { 
        const itemsToDisplay = getCurrentFolderItems();
        if (noBookmarksMessage) noBookmarksMessage.style.display = itemsToDisplay.length === 0 ? 'block' : 'none';
        if (dragDropHintText) {
            dragDropHintText.style.setProperty('--drag-drop-hint-display', DEFAULT_SETTINGS[STORAGE_KEY_SHOW_DRAG_DROP_HINT] ? 'block' : 'none');
        }
    };

    const createBookmarkElement = (item) => { 
        if (item.type === 'link') {
            const a = document.createElement('a');
            a.href = item.url;
            a.className = 'bookmark-item';
            a.target = '_blank';
            a.rel = 'noopener noreferrer';
            a.draggable = true; // Keep draggable for potential future enhancements
            a.dataset.id = item.id;
            a.dataset.url = item.url;
            a.dataset.name = item.name;

            const img = document.createElement('img');
            img.src = getFaviconUrl(item.url);
            img.alt = ''; 
            img.className = 'favicon';
            img.onerror = function() { this.src = getFaviconUrl('invalid-url'); };

            const nameSpan = document.createElement('span');
            nameSpan.className = 'bookmark-name';
            nameSpan.textContent = item.name;

            a.appendChild(img);
            a.appendChild(nameSpan);
            a.addEventListener('click', (e) => {
                addRecentActivity(item.name, item.url);
            });
            return a;

        } else if (item.type === 'folder') {
            const div = document.createElement('div');
            div.className = 'bookmark-folder-item';
            div.dataset.id = item.id;
            div.dataset.name = item.name;
            div.setAttribute('role', 'button');
            div.setAttribute('tabindex', '0');

            const icon = document.createElement('i');
            icon.className = 'fas fa-folder folder-icon';
            
            const nameSpan = document.createElement('span');
            nameSpan.className = 'folder-name';
            nameSpan.textContent = item.name;

            div.appendChild(icon);
            div.appendChild(nameSpan);

            div.addEventListener('click', () => openFolder(item.id));
            div.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    openFolder(item.id);
                }
            });
            return div;
        }
        return null;
    };

    const openFolder = (folderId) => {
        currentFolderPath.push(folderId);
        renderBookmarks();
    };

    const goBackToParentFolder = () => {
        if (currentFolderPath.length > 0) {
            currentFolderPath.pop();
            renderBookmarks();
        }
    };

    const renderBookmarks = () => { 
        if (!bookmarksContainer) return;
        bookmarksContainer.innerHTML = '';
        const itemsToDisplay = getCurrentFolderItems();

        if (itemsToDisplay.length === 0 && currentFolderPath.length === 0 && bookmarks.length === 0) {
             // This is the true "no bookmarks at all" state
             if (noBookmarksMessage) noBookmarksMessage.style.display = 'block';
        } else if (itemsToDisplay.length === 0) {
            if (noBookmarksMessage) {
                noBookmarksMessage.textContent = "This folder is empty.";
                noBookmarksMessage.style.display = 'block';
            }
        } else {
            if (noBookmarksMessage) noBookmarksMessage.style.display = 'none';
        }

        itemsToDisplay.forEach(item => {
            const el = createBookmarkElement(item);
            if (el) bookmarksContainer.appendChild(el);
        });

        // Update Quick Links title and back button
        if (quickLinksTitle) {
            if (currentFolderPath.length > 0) {
                const currentFolderId = currentFolderPath[currentFolderPath.length - 1];
                const currentFolder = getFolderById(currentFolderId, bookmarks); // Search globally
                quickLinksTitle.textContent = currentFolder ? currentFolder.name : "Quick Links";
                if (backToParentFolderBtn) backToParentFolderBtn.style.display = 'inline-flex';
            } else {
                quickLinksTitle.textContent = "Quick Links";
                if (backToParentFolderBtn) backToParentFolderBtn.style.display = 'none';
            }
        }
        toggleHintsAndMessages(); 
    };


    const renderManageBookmarksList = (items = bookmarks, level = 0, parentId = 'root') => {
        // Ensure list is cleared only once at the top level call
        if (level === 0 && manageBookmarksList) manageBookmarksList.innerHTML = '';
        
        items.sort((a, b) => { // Folders first, then alphabetically
            if (a.type === 'folder' && b.type !== 'folder') return -1;
            if (a.type !== 'folder' && b.type === 'folder') return 1;
            return a.name.localeCompare(b.name);
        });

        items.forEach((item) => {
            const li = document.createElement('li');
            li.style.marginLeft = `${level * 20}px`; // Indentation for hierarchy

            const infoDiv = document.createElement('div');
            infoDiv.className = 'bookmark-info';
            
            const icon = document.createElement('i');
            icon.className = `fas ${item.type === 'folder' ? 'fa-folder' : 'fa-link'}`;
            infoDiv.appendChild(icon);

            const nameSpan = document.createElement('span');
            nameSpan.textContent = item.name;
            infoDiv.appendChild(nameSpan);

            if (item.type === 'link') {
                const urlSmall = document.createElement('span');
                urlSmall.className = 'bookmark-url-small';
                urlSmall.textContent = item.url;
                infoDiv.appendChild(urlSmall);
            }

            const controlsDiv = document.createElement('div');
            controlsDiv.className = 'item-controls';

            const renameBtn = document.createElement('button');
            renameBtn.innerHTML = '<i class="fas fa-edit"></i>';
            renameBtn.className = 'icon-btn rename-item-btn small-btn';
            renameBtn.setAttribute('aria-label', `Rename ${item.name}`);
            renameBtn.addEventListener('click', () => promptRenameItem(item.id, item.name, infoDiv, nameSpan));
            
            const deleteBtn = document.createElement('button');
            deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
            deleteBtn.className = 'icon-btn delete-bookmark-btn small-btn';
            deleteBtn.setAttribute('aria-label', `Delete ${item.name}`);
            deleteBtn.addEventListener('click', () => deleteItem(item.id));

            controlsDiv.appendChild(renameBtn);
            controlsDiv.appendChild(deleteBtn);
            li.appendChild(infoDiv);
            li.appendChild(controlsDiv);
            if (manageBookmarksList) manageBookmarksList.appendChild(li);

            if (item.type === 'folder' && item.children && item.children.length > 0) {
                renderManageBookmarksList(item.children, level + 1, item.id);
            }
        });
    };

    const promptRenameItem = (itemId, currentName, infoDiv, nameSpanElement) => {
        const originalContent = infoDiv.innerHTML; // Save original content
        infoDiv.innerHTML = ''; // Clear the infoDiv

        const input = document.createElement('input');
        input.type = 'text';
        input.value = currentName;
        input.className = 'rename-input'; // For styling
        input.style.flexGrow = '1';

        const saveBtn = document.createElement('button');
        saveBtn.innerHTML = '<i class="fas fa-check"></i>';
        saveBtn.className = 'icon-btn small-btn';
        saveBtn.style.color = 'var(--success-color)';

        const cancelBtn = document.createElement('button');
        cancelBtn.innerHTML = '<i class="fas fa-times"></i>';
        cancelBtn.className = 'icon-btn small-btn';
        cancelBtn.style.color = 'var(--danger-color)';
        
        infoDiv.appendChild(input);
        infoDiv.appendChild(saveBtn);
        infoDiv.appendChild(cancelBtn);
        input.focus();
        input.select();

        const performRename = () => {
            const newName = input.value.trim();
            if (newName && newName !== currentName) {
                const found = findItemAndParentArray(itemId, bookmarks);
                if (found && found.item) {
                    found.item.name = newName;
                    saveBookmarks();
                    renderAllBookmarks(); // Re-render everything to reflect changes
                    updateFolderDropdowns(); // If a folder name changed
                } else {
                     infoDiv.innerHTML = originalContent; // Restore on failure
                }
            } else {
                infoDiv.innerHTML = originalContent; // Restore if no change or empty
            }
        };
        
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') performRename();
            if (e.key === 'Escape') infoDiv.innerHTML = originalContent; // Restore
        });
        saveBtn.addEventListener('click', performRename);
        cancelBtn.addEventListener('click', () => { infoDiv.innerHTML = originalContent; });
    };


    const renderAllBookmarks = () => { renderBookmarks(); renderManageBookmarksList(); };
    const saveBookmarks = () => saveToLocalStorage(STORAGE_KEY_BOOKMARKS, bookmarks);

    const addSingleBookmark = (name, url, parentFolderId = 'root', skipSaveAndRender = false) => {
        if (!name || !url || !isValidHttpUrl(url)) return false;

        const newBookmark = { id: generateId(), type: 'link', name, url };
        let targetArray = bookmarks;

        if (parentFolderId !== 'root') {
            const parentFolder = getFolderById(parentFolderId, bookmarks);
            if (parentFolder && parentFolder.type === 'folder') {
                if (!parentFolder.children) parentFolder.children = [];
                 // Check for duplicates within this folder
                if (parentFolder.children.some(bm => bm.type === 'link' && bm.url.toLowerCase() === url.toLowerCase())) return false;
                targetArray = parentFolder.children;
            } else {
                console.warn("Parent folder not found or invalid for bookmark:", parentFolderId);
                return false; // Parent folder not found
            }
        } else {
             // Check for duplicates at root level
            if (bookmarks.some(bm => bm.type === 'link' && bm.url.toLowerCase() === url.toLowerCase() && !bm.parentId)) return false;
        }

        targetArray.push(newBookmark);
        if (!skipSaveAndRender) { 
            saveBookmarks(); 
            renderAllBookmarks(); 
            updateFolderDropdowns();
        }
        return true;
    };

    const addFolder = (name, parentFolderId = 'root') => {
        if (!name.trim()) return false;
        const newFolder = { id: generateId(), type: 'folder', name: name.trim(), children: [] };
        
        let targetArray = bookmarks;
        if (parentFolderId !== 'root') {
            const parent = getFolderById(parentFolderId, bookmarks);
            if (parent && parent.type === 'folder') {
                 if (parent.children.some(f => f.type === 'folder' && f.name.toLowerCase() === newFolder.name.toLowerCase())) return false; // Duplicate folder name
                targetArray = parent.children;
            } else {
                return false; // Parent folder not found
            }
        } else {
             if (bookmarks.some(f => f.type === 'folder' && f.name.toLowerCase() === newFolder.name.toLowerCase())) return false; // Duplicate folder name at root
        }

        targetArray.push(newFolder);
        saveBookmarks();
        renderAllBookmarks();
        updateFolderDropdowns(); // Update dropdowns in settings
        return true;
    };

    const deleteItem = (itemId) => {
        const found = findItemAndParentArray(itemId, bookmarks);
        if (!found) return;

        const itemNameToDelete = found.item.name;
        const itemType = found.item.type;
        let confirmationMessage = `Are you sure you want to delete ${itemType} "${itemNameToDelete}"?`;
        if (itemType === 'folder' && found.item.children && found.item.children.length > 0) {
            confirmationMessage += " This will also delete all its contents.";
        }

        if (confirm(confirmationMessage)) {
            found.parentArray.splice(found.index, 1);
            saveBookmarks();
            renderAllBookmarks();
            updateFolderDropdowns();
            // If the deleted folder was part of the current path, navigate up
            const pathIndex = currentFolderPath.indexOf(itemId);
            if (pathIndex !== -1) {
                currentFolderPath = currentFolderPath.slice(0, pathIndex);
                renderBookmarks(); // Re-render the new current folder or root
            }
        }
    };
    
    const deleteAllUserBookmarks = () => {
        if (confirm("Are you sure you want to delete ALL bookmarks and folders? This action cannot be undone.")) {
            bookmarks = [];
            currentFolderPath = []; // Reset path
            saveBookmarks();
            renderAllBookmarks();
            updateFolderDropdowns();
        }
    };

    const loadBookmarks = () => { 
        bookmarks = loadFromLocalStorage(STORAGE_KEY_BOOKMARKS, true); 
        if (!Array.isArray(bookmarks)) bookmarks = DEFAULT_SETTINGS[STORAGE_KEY_BOOKMARKS]; // Fallback
        renderAllBookmarks(); 
        updateFolderDropdowns();
    };

    // Update folder dropdowns in settings modal
    const updateFolderDropdowns = (selectElements, currentItems = bookmarks, level = 0, currentPathId = 'root') => {
        if (!selectElements) { // Default elements if not provided (called after initial load or major changes)
             selectElements = [parentFolderSelectForBookmark, parentFolderSelectForNewFolder];
        }
        if (level === 0) { // Clear only once at the start for each select
            selectElements.forEach(select => {
                if (select) {
                    const currentValue = select.value; // Preserve selection if possible
                    select.innerHTML = '<option value="root">Root Level</option>';
                    // Try to restore selection, if the option still exists
                    if (getFolderById(currentValue, bookmarks) || currentValue === 'root') {
                        select.value = currentValue;
                    } else {
                         select.value = 'root';
                    }
                }
            });
        }

        currentItems.forEach(item => {
            if (item.type === 'folder') {
                selectElements.forEach(select => {
                    if (select) {
                        const option = document.createElement('option');
                        option.value = item.id;
                        option.textContent = `${'--'.repeat(level)} ${item.name}`;
                        select.appendChild(option);
                    }
                });
                if (item.children && item.children.length > 0) {
                    updateFolderDropdowns(selectElements, item.children, level + 1, item.id);
                }
            }
        });
    };


    // --- DRAG & DROP BOOKMARKS --- (Simplified for adding to current view)
    const parseDroppedHtmlForBookmarks = (htmlString) => { 
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
    const parseDroppedUriList = (uriListString, plainTextString = "") => { 
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
    const openSettingsModal = () => { 
        if (settingsModal) { 
            settingsModal.style.display = 'block'; 
            settingsModal.setAttribute('aria-hidden', 'false'); 
            closeSettingsModalBtn?.focus(); 
            renderManageBookmarksList(); 
            updateFolderDropdowns(); // Ensure dropdowns are up-to-date
        } 
    };
    const closeSettingsModal = () => { 
        if (settingsModal) { 
            settingsModal.style.display = 'none'; 
            settingsModal.setAttribute('aria-hidden', 'true'); 
        } 
    };

    // --- SETTINGS APPLICATION FUNCTIONS ---
    function _applyColor(cssVar, colorValue, isPrimaryAccent = false) {
        document.documentElement.style.setProperty(cssVar, colorValue);
        if (isPrimaryAccent) { 
            const rgb = hexToRgb(colorValue);
            if (rgb) {
                document.documentElement.style.setProperty('--accent-primary-hover', lightenColor(colorValue, 15));
                document.documentElement.style.setProperty('--accent-primary-shadow', `rgba(${rgb.join(',')}, 0.3)`);
                document.documentElement.style.setProperty('--accent-primary-bg-hover', `rgba(${rgb.join(',')}, 0.1)`);
                document.documentElement.style.setProperty('--drag-over-bg', `rgba(${rgb.join(',')}, 0.1)`);
                document.documentElement.style.setProperty('--drag-over-border-color', colorValue);
            }
        } else if (cssVar === '--accent-secondary') { 
             document.documentElement.style.setProperty('--accent-secondary-hover', lightenColor(colorValue, 15));
        }
    }
    function applyPageBackgroundColor(color) { _applyColor('--bg-primary', color); }
    function applyCardBackgroundColor(color) { _applyColor('--bg-secondary', color); }
    function applyPrimaryTextColor(color) { _applyColor('--text-primary', color); }
    function applyPrimaryAccentColor(color) { _applyColor('--accent-primary', color, true); }
    function applySecondaryAccentColor(color) { _applyColor('--accent-secondary', color); }
    
    function applyFaviconSize(size) { document.documentElement.style.setProperty('--favicon-size', `${size}px`); }
    function applyFontFamily(font) { document.documentElement.style.setProperty('--app-font-family', font); }
    function applyClockVisibility(show) { 
        DEFAULT_SETTINGS[STORAGE_KEY_SHOW_CLOCK] = show; 
        if (clockWidgetContainer) clockWidgetContainer.style.setProperty('--clock-widget-display', show ? 'flex' : 'none');
        if (show) updateClock(); 
    }
    function applyClockTimeFormat(format) { 
        DEFAULT_SETTINGS[STORAGE_KEY_CLOCK_TIME_FORMAT] = format; updateClock(); 
    }
    function applyQuicklinkGridColumns(cols) { 
        const value = cols === 'auto-fill' ? 'repeat(auto-fill, minmax(180px, 1fr))' : `repeat(${cols}, 1fr)`;
        document.documentElement.style.setProperty('--quicklink-grid-columns', value);
    }
    function applyBorderRadius(radius) { 
        document.documentElement.style.setProperty('--border-radius', radius); 
    }
    function applyMainTitle(title) { 
        if (mainTitleElement) mainTitleElement.textContent = title || DEFAULT_SETTINGS[STORAGE_KEY_MAIN_TITLE]; 
    }
    function applySearchNewTab(enabled) { DEFAULT_SETTINGS[STORAGE_KEY_SEARCH_NEW_TAB] = enabled; }
    function applyShowDragDropHint(show) {  
        DEFAULT_SETTINGS[STORAGE_KEY_SHOW_DRAG_DROP_HINT] = show;
        toggleHintsAndMessages(); 
    }
    function applySearxngInstanceUrl(url) { DEFAULT_SETTINGS[STORAGE_KEY_SEARXNG_INSTANCE_URL] = url.trim(); }

    function applyColorPreset(presetName) {
        const preset = COLOR_PRESETS[presetName];
        if (!preset) return;

        const colorSettingsMap = {
            [STORAGE_KEY_PAGE_BG_COLOR]: { input: pageBgColorInput, apply: applyPageBackgroundColor },
            [STORAGE_KEY_CARD_BG_COLOR]: { input: cardBgColorInput, apply: applyCardBackgroundColor },
            [STORAGE_KEY_TEXT_PRIMARY_COLOR]: { input: textPrimaryColorInput, apply: applyPrimaryTextColor },
            [STORAGE_KEY_ACCENT_COLOR]: { input: accentColorInput, apply: applyPrimaryAccentColor }, 
            [STORAGE_KEY_ACCENT_SECONDARY_COLOR]: { input: accentSecondaryColorInput, apply: applySecondaryAccentColor },
        };

        for (const key in preset) {
            if (colorSettingsMap[key]) {
                const { input, apply } = colorSettingsMap[key];
                const value = preset[key];
                if (input) input.value = value;
                if (apply) apply(value);
                saveToLocalStorage(key, value);
                DEFAULT_SETTINGS[key] = value; 
            }
        }
    }

    // New: Background Image
    function applyBackgroundImage(imageDataUrl) {
        if (imageDataUrl) {
            document.documentElement.style.setProperty('--body-bg-image', `url("${imageDataUrl}")`);
        } else {
            document.documentElement.style.setProperty('--body-bg-image', 'none');
        }
        saveToLocalStorage(STORAGE_KEY_BACKGROUND_IMAGE, imageDataUrl);
        DEFAULT_SETTINGS[STORAGE_KEY_BACKGROUND_IMAGE] = imageDataUrl;
    }

    function handleBackgroundImageUpload(event) {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                applyBackgroundImage(e.target.result);
            };
            reader.readAsDataURL(file);
        } else if (file) {
            alert("Please select a valid image file.");
        }
    }

    function clearBackgroundImage() {
        applyBackgroundImage(null);
        if (backgroundImageInput) backgroundImageInput.value = ''; // Clear file input
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

            { key: STORAGE_KEY_BACKGROUND_IMAGE, applyFunc: applyBackgroundImage }, // No element to set value for, just apply
        ];

        settingsConfig.forEach(s => {
            const value = loadFromLocalStorage(s.key);
            DEFAULT_SETTINGS[s.key] = value; 
            if (s.element) {
                if (s.type === 'checkbox') s.element.checked = value;
                else s.element.value = value;

                if (s.key === STORAGE_KEY_SEARXNG_INSTANCE_URL && !value) {
                    s.element.placeholder = SEARXNG_DEFAULT_PLACEHOLDER;
                }
            }
            if (s.applyFunc) s.applyFunc(value); 
        });
        // Load recent activity separately as it's not a direct "setting" like others
        recentActivity = loadFromLocalStorage(STORAGE_KEY_RECENT_ACTIVITY, true);
        if (!Array.isArray(recentActivity)) recentActivity = [];
        renderRecentActivity();
    };

    const createSaveSettingHandler = (key, applyFunc, isCheckbox = false, isInputEvent = false) => {
        return (event) => {
            const value = isCheckbox ? event.target.checked : event.target.value;
            saveToLocalStorage(key, value);
            DEFAULT_SETTINGS[key] = value; 
            if (applyFunc) applyFunc(value);
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
        parentFolderSelectForBookmark = document.getElementById('parent-folder-select-for-bookmark');
        
        addFolderForm = document.getElementById('add-folder-form');
        folderNameInput = document.getElementById('folder-name');
        parentFolderSelectForNewFolder = document.getElementById('parent-folder-select-for-new-folder');

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

        deleteAllBookmarksBtn = document.getElementById('delete-all-bookmarks-btn');
        backgroundImageInput = document.getElementById('background-image-input');
        clearBackgroundImageBtn = document.getElementById('clear-background-image-btn');

        recentActivitySection = document.getElementById('recent-activity-section');
        recentActivityContainer = document.getElementById('recent-activity-container');
        noRecentActivityMessage = recentActivitySection.querySelector('.no-recent-activity-message');

        quickLinksTitle = document.getElementById('quick-links-title');
        backToParentFolderBtn = document.getElementById('back-to-parent-folder-btn');

        loadAllSettings(); 
        loadBookmarks();   // This will also call renderAllBookmarks and updateFolderDropdowns
        
        updateClock(); 
        if(DEFAULT_SETTINGS[STORAGE_KEY_SHOW_CLOCK]) setInterval(updateClock, 30000);


        // Event Listeners
        if (searchForm) searchForm.addEventListener('submit', (e) => { e.preventDefault(); performSearch(); });
        
        if (addBookmarkForm) { 
            addBookmarkForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const name = bookmarkNameInput.value.trim();
                const url = bookmarkUrlInput.value.trim();
                const parentFolderId = parentFolderSelectForBookmark.value;
                if (addSingleBookmark(name, url, parentFolderId)) {
                    bookmarkNameInput.value = '';
                    bookmarkUrlInput.value = '';
                    // renderManageBookmarksList and updateFolderDropdowns called by addSingleBookmark
                } else {
                    alert("Failed to add bookmark. Name and URL are required, URL must be valid and not a duplicate within the selected folder.");
                }
            });
        }
        
        if (addFolderForm) {
            addFolderForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const name = folderNameInput.value.trim();
                const parentFolderId = parentFolderSelectForNewFolder.value;
                if (addFolder(name, parentFolderId)) {
                    folderNameInput.value = '';
                } else {
                    alert("Failed to add folder. Name is required and must be unique within the selected parent folder.");
                }
            });
        }

        if (settingsBtn) settingsBtn.addEventListener('click', openSettingsModal);
        if (closeSettingsModalBtn) closeSettingsModalBtn.addEventListener('click', closeSettingsModal);
        if (addBookmarkShortcutBtn) addBookmarkShortcutBtn.addEventListener('click', () => { 
            openSettingsModal(); 
            updateFolderDropdowns(); // Ensure dropdowns are fresh
            setTimeout(() => {
                if (parentFolderSelectForBookmark) parentFolderSelectForBookmark.value = currentFolderPath.length > 0 ? currentFolderPath[currentFolderPath.length-1] : 'root';
                bookmarkNameInput?.focus();
            }, 100); 
        });
        
        window.addEventListener('click', (e) => { if (settingsModal && e.target === settingsModal) closeSettingsModal(); });
        window.addEventListener('keydown', (e) => { if (settingsModal && settingsModal.style.display === 'block' && e.key === 'Escape') closeSettingsModal(); });

        // Settings Event Listeners
        if (defaultSearchEngineSelect) defaultSearchEngineSelect.addEventListener('change', createSaveSettingHandler(STORAGE_KEY_SEARCH_ENGINE, (val) => { if(searchEngineSelect) searchEngineSelect.value = val; DEFAULT_SETTINGS[STORAGE_KEY_SEARCH_ENGINE] = val; }));
        if (quickLinkIconSizeSelect) quickLinkIconSizeSelect.addEventListener('change', createSaveSettingHandler(STORAGE_KEY_QUICKLINK_ICON_SIZE, applyFaviconSize));
        
        if (accentColorInput) accentColorInput.addEventListener('input', createSaveSettingHandler(STORAGE_KEY_ACCENT_COLOR, applyPrimaryAccentColor, false, true));
        if (fontFamilySelect) fontFamilySelect.addEventListener('change', createSaveSettingHandler(STORAGE_KEY_FONT_FAMILY, applyFontFamily));
        if (showClockToggle) showClockToggle.addEventListener('change', createSaveSettingHandler(STORAGE_KEY_SHOW_CLOCK, applyClockVisibility, true));
        if (clockTimeFormatSelect) clockTimeFormatSelect.addEventListener('change', createSaveSettingHandler(STORAGE_KEY_CLOCK_TIME_FORMAT, applyClockTimeFormat));
        if (quicklinkGridColumnsSelect) quicklinkGridColumnsSelect.addEventListener('change', createSaveSettingHandler(STORAGE_KEY_QL_GRID_COLUMNS, applyQuicklinkGridColumns));
        if (borderRadiusSelect) borderRadiusSelect.addEventListener('change', createSaveSettingHandler(STORAGE_KEY_BORDER_RADIUS, applyBorderRadius));
        if (mainTitleTextInput) mainTitleTextInput.addEventListener('input', createSaveSettingHandler(STORAGE_KEY_MAIN_TITLE, applyMainTitle, false, true));
        
        if (pageBgColorInput) pageBgColorInput.addEventListener('input', createSaveSettingHandler(STORAGE_KEY_PAGE_BG_COLOR, applyPageBackgroundColor, false, true));
        if (cardBgColorInput) cardBgColorInput.addEventListener('input', createSaveSettingHandler(STORAGE_KEY_CARD_BG_COLOR, applyCardBackgroundColor, false, true));
        if (textPrimaryColorInput) textPrimaryColorInput.addEventListener('input', createSaveSettingHandler(STORAGE_KEY_TEXT_PRIMARY_COLOR, applyPrimaryTextColor, false, true));
        if (accentSecondaryColorInput) accentSecondaryColorInput.addEventListener('input', createSaveSettingHandler(STORAGE_KEY_ACCENT_SECONDARY_COLOR, applySecondaryAccentColor, false, true));
        if (searchNewTabToggle) searchNewTabToggle.addEventListener('change', createSaveSettingHandler(STORAGE_KEY_SEARCH_NEW_TAB, applySearchNewTab, true));
        if (showDragDropHintToggle) showDragDropHintToggle.addEventListener('change', createSaveSettingHandler(STORAGE_KEY_SHOW_DRAG_DROP_HINT, applyShowDragDropHint, true));
        if (searxngInstanceUrlInput) searxngInstanceUrlInput.addEventListener('change', createSaveSettingHandler(STORAGE_KEY_SEARXNG_INSTANCE_URL, applySearxngInstanceUrl)); // Use 'change' not 'input'

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

        // New Event Listeners
        if (deleteAllBookmarksBtn) deleteAllBookmarksBtn.addEventListener('click', deleteAllUserBookmarks);
        if (backgroundImageInput) backgroundImageInput.addEventListener('change', handleBackgroundImageUpload);
        if (clearBackgroundImageBtn) clearBackgroundImageBtn.addEventListener('click', clearBackgroundImage);
        if (backToParentFolderBtn) backToParentFolderBtn.addEventListener('click', goBackToParentFolder);
        

        if (quickLinksDropzone) { 
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
                // Check if the leave target is outside the dropzone itself
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
                    const parentIdForDrop = currentFolderPath.length > 0 ? currentFolderPath[currentFolderPath.length - 1] : 'root';
                    processedBookmarks.forEach(bm => {
                        if (bm && typeof bm.name === 'string' && typeof bm.url === 'string' && isValidHttpUrl(bm.url)) {
                            if (addSingleBookmark(bm.name, bm.url, parentIdForDrop, true)) addedCount++; 
                        }
                    });
                    if (addedCount > 0) { 
                        saveBookmarks(); 
                        renderAllBookmarks(); 
                        updateFolderDropdowns();
                    }
                } else {
                    console.warn("Could not extract any valid link(s) from the dropped item.");
                }
            });
        } 
    } 

    initializeApp();
});