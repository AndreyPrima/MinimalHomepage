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
        deleteAllBookmarksBtn,
        backgroundImageInput, clearBackgroundImageBtn,
        addFolderForm, folderNameInput, parentFolderSelectForNewFolder,
        parentFolderSelectForBookmark,
        recentActivitySection, recentActivityContainer, noRecentActivityMessage,
        quickLinksTitle, backToParentFolderBtn;

    let bookmarks = [];
    let recentActivity = [];
    let currentFolderPath = [];

    const STORAGE_KEY_PREFIX = 'advDashV6.2_';
    const STORAGE_KEY_BOOKMARKS = `${STORAGE_KEY_PREFIX}bookmarks_structured`;
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
    const STORAGE_KEY_BACKGROUND_IMAGE = `${STORAGE_KEY_PREFIX}backgroundImageDataUrl`;
    const STORAGE_KEY_RECENT_ACTIVITY = `${STORAGE_KEY_PREFIX}recentActivity`;
    
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
    function generateId() { return Date.now().toString(36) + Math.random().toString(36).substring(2); }

    function getFaviconUrl(url) {
        try {
            if (!url || typeof url !== 'string' || !url.trim().toLowerCase().startsWith('http')) {
                return 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23888888"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zM11 7h2v6h-2V7zm0 8h2v2h-2v-2z"/></svg>';
            }
            const urlObj = new URL(url);
            return `https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${urlObj.origin}&size=32`;
        } catch (e) {
            console.error("Error creating favicon URL for:", url, e);
            return 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23888888"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zM11 7h2v6h-2V7zm0 8h2v2h-2v-2z"/></svg>';
        }
    }
    function isValidHttpUrl(string) { 
        if (!string || typeof string !== 'string') return false;
        try { 
            const url = new URL(string); 
            return url.protocol === "http:" || url.protocol === "https:";
        } catch (_) { 
            return false; 
        }
    }
    function saveToLocalStorage(key, data) { 
        try { 
            localStorage.setItem(key, JSON.stringify(data)); 
        } catch (e) { 
            console.error("Error saving to LS:", key, e); 
        } 
    }
    function loadFromLocalStorage(key, isArray = false) {
        let defaultValue = DEFAULT_SETTINGS[key];
        if (defaultValue === undefined) {
            defaultValue = isArray ? [] : null;
        }
        try {
            const item = localStorage.getItem(key);
            if (item === null) {
                return JSON.parse(JSON.stringify(defaultValue)); // Return a deep copy of default
            }
            try {
                return JSON.parse(item);
            } catch (parseError) {
                console.error(`Error parsing JSON for ${key} from LS. Raw item:`, item, parseError);
                localStorage.removeItem(key); // Remove corrupted item
                return JSON.parse(JSON.stringify(defaultValue)); // Return a deep copy of default
            }
        } catch (e) {
            console.error(`Error loading ${key} from LS (general):`, e);
            return JSON.parse(JSON.stringify(defaultValue)); // Return a deep copy of default
        }
    }
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
        try {
            const now = new Date();
            const format12h = DEFAULT_SETTINGS[STORAGE_KEY_CLOCK_TIME_FORMAT] === '12h';
            clockTime.textContent = now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit', hour12: format12h });
            clockDate.textContent = now.toLocaleDateString('ru-RU', { weekday: 'short', day: 'numeric', month: 'short' });
        } catch (e) {
            console.error("Error updating clock:", e);
        }
    }

    // --- RECENT ACTIVITY ---
    function addRecentActivity(name, url) {
        if (!name || !url || !isValidHttpUrl(url)) return;
        try {
            recentActivity = recentActivity.filter(item => item.url !== url);
            recentActivity.unshift({ name, url, favicon: getFaviconUrl(url), timestamp: Date.now() });
            if (recentActivity.length > MAX_RECENT_ACTIVITY) {
                recentActivity.pop();
            }
            saveToLocalStorage(STORAGE_KEY_RECENT_ACTIVITY, recentActivity);
            renderRecentActivity();
        } catch (e) {
            console.error("Error adding recent activity:", e);
        }
    }

    function renderRecentActivity() {
        if (!recentActivityContainer || !recentActivitySection) return;
        try {
            recentActivityContainer.innerHTML = '';
            const currentRecentActivity = Array.isArray(recentActivity) ? recentActivity : [];

            if (currentRecentActivity.length === 0) {
                if (noRecentActivityMessage) noRecentActivityMessage.style.display = 'block';
                recentActivitySection.style.display = 'none';
                return;
            }
            
            if (noRecentActivityMessage) noRecentActivityMessage.style.display = 'none';
            recentActivitySection.style.display = 'block';

            currentRecentActivity.forEach(item => {
                if (!item || !item.url) return; // Skip invalid items
                const activityLink = document.createElement('a');
                activityLink.href = item.url;
                activityLink.className = 'recent-activity-item';
                activityLink.target = '_blank';
                activityLink.rel = 'noopener noreferrer';
                activityLink.title = `${item.name || 'Untitled'} - ${item.url}`;

                const img = document.createElement('img');
                img.src = item.favicon || getFaviconUrl(item.url);
                img.alt = '';
                img.className = 'favicon';
                img.onerror = function() { this.src = getFaviconUrl('invalid-url'); };
                
                const nameSpan = document.createElement('span');
                nameSpan.className = 'activity-name';
                nameSpan.textContent = item.name || 'Untitled';

                const urlSpan = document.createElement('span');
                urlSpan.className = 'activity-url';
                const displayUrl = item.url.length > 40 ? item.url.substring(0, 37) + '...' : item.url;
                urlSpan.textContent = displayUrl;

                activityLink.appendChild(img);
                activityLink.appendChild(nameSpan);
                activityLink.appendChild(urlSpan);
                recentActivityContainer.appendChild(activityLink);
            });
        } catch (e) {
            console.error("Error rendering recent activity:", e);
            if (noRecentActivityMessage) noRecentActivityMessage.style.display = 'block';
            recentActivitySection.style.display = 'none';
        }
    }

    // --- SEARCH FUNCTIONALITY ---
    function performSearch() { 
        if (!searchInput || !searchEngineSelect) {
            console.error("Search input or select element not found.");
            return;
        }
        try {
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
        } catch (e) {
            console.error("Error performing search:", e);
            alert("An error occurred while trying to search. Please check the console for details.");
        }
    }

    // --- BOOKMARKS & FOLDERS FUNCTIONALITY ---
    function ensureItemIntegrity(item, level = 0) {
        if (level > 10) { 
            console.error("Max recursion depth in ensureItemIntegrity for item:", item);
            return { id: generateId(), type: 'link', name: 'Error Item (Max Depth)', url: '#error' };
        }
        if (!item || typeof item !== 'object') {
            return { id: generateId(), type: 'link', name: 'Invalid Item Data', url: '#error' };
        }
        if (!item.id) item.id = generateId();
        if (!item.type || !['link', 'folder'].includes(item.type)) {
            item.type = (item.url && isValidHttpUrl(item.url)) ? 'link' : 'folder';
        }

        if (item.type === 'folder') {
            item.name = typeof item.name === 'string' ? item.name.trim() : "Unnamed Folder";
            if (item.name === "") item.name = "Unnamed Folder";
            item.children = Array.isArray(item.children) ? item.children.map(child => ensureItemIntegrity(child, level + 1)).filter(Boolean) : [];
        } else if (item.type === 'link') {
            item.name = typeof item.name === 'string' ? item.name.trim() : "Unnamed Link";
            if (item.name === "") item.name = "Unnamed Link";
            if (!item.url || !isValidHttpUrl(item.url)) {
                console.warn("Link item has invalid URL, marking as error:", JSON.stringify(item));
                item.name = `${item.name} (Invalid URL)`;
                item.url = "#error-invalid-url";
            }
        } else {
            console.warn("Unknown item type, converting to placeholder:", JSON.stringify(item));
            return { id: item.id, type: 'link', name: item.name || 'Unknown Item Type', url: '#error' };
        }
        return item;
    }
    
    function getCurrentFolderItems() {
        let currentLevel = bookmarks;
        if (!Array.isArray(currentLevel)) { // Fallback if bookmarks is not an array
            console.error("Bookmarks data is not an array:", bookmarks);
            bookmarks = []; // Reset to empty array
            return [];
        }
        try {
            for (const folderId of currentFolderPath) {
                const folder = currentLevel.find(item => item && item.id === folderId && item.type === 'folder');
                if (folder && Array.isArray(folder.children)) {
                    currentLevel = folder.children;
                } else {
                    console.warn(`Folder with ID ${folderId} not found or invalid in path. Resetting to root.`);
                    currentFolderPath = [];
                    return bookmarks; // Return root bookmarks
                }
            }
            return currentLevel;
        } catch (e) {
            console.error("Error getting current folder items:", e);
            currentFolderPath = []; // Reset path on error
            return bookmarks; // Return root bookmarks
        }
    }
    
    function findItemAndParentArray(id, currentItems = bookmarks, parentArray = { array: bookmarks, isRoot: true }) {
        if (!Array.isArray(currentItems)) return null;
        for (let i = 0; i < currentItems.length; i++) {
            const item = currentItems[i];
            if (!item || typeof item !== 'object') continue; // Skip invalid items

            if (item.id === id) {
                return { item, parentArray: parentArray.isRoot ? parentArray.array : parentArray, index: i };
            }
            if (item.type === 'folder' && Array.isArray(item.children)) {
                const found = findItemAndParentArray(id, item.children, item.children);
                if (found) return found;
            }
        }
        return null;
    }
    
    function getFolderById(id, items = bookmarks) {
        if (!Array.isArray(items)) return null;
        for (const item of items) {
            if (!item || typeof item !== 'object') continue;
            if (item.id === id && item.type === 'folder') return item;
            if (item.type === 'folder' && Array.isArray(item.children)) {
                const found = getFolderById(id, item.children);
                if (found) return found;
            }
        }
        return null;
    }

    function toggleHintsAndMessages() { 
        if (!noBookmarksMessage || !dragDropHintText) return;
        try {
            const itemsToDisplay = getCurrentFolderItems();
            noBookmarksMessage.style.display = (!itemsToDisplay || itemsToDisplay.length === 0) ? 'block' : 'none';
            if (noBookmarksMessage.style.display === 'block' && currentFolderPath.length > 0) {
                 noBookmarksMessage.textContent = "This folder is empty.";
            } else if (noBookmarksMessage.style.display === 'block') {
                 noBookmarksMessage.textContent = "No bookmarks yet. Add some manually or drag & drop links here!";
            }
            dragDropHintText.style.setProperty('--drag-drop-hint-display', DEFAULT_SETTINGS[STORAGE_KEY_SHOW_DRAG_DROP_HINT] ? 'block' : 'none');
        } catch (e) {
            console.error("Error toggling hints/messages:", e);
        }
    }

    function createBookmarkElement(item) { 
        if (!item || !item.type) return null;
        try {
            if (item.type === 'link') {
                if (!item.url || !isValidHttpUrl(item.url)) { // Double check URL validity
                    console.warn("Skipping rendering link with invalid URL:", item);
                    return null;
                }
                const a = document.createElement('a');
                a.href = item.url;
                a.className = 'bookmark-item';
                a.target = '_blank';
                a.rel = 'noopener noreferrer';
                a.draggable = true;
                a.dataset.id = item.id;
                a.dataset.url = item.url;
                a.dataset.name = item.name || "Untitled Link";

                const img = document.createElement('img');
                img.src = getFaviconUrl(item.url);
                img.alt = ''; 
                img.className = 'favicon';
                img.onerror = function() { this.src = getFaviconUrl('invalid-url'); };

                const nameSpan = document.createElement('span');
                nameSpan.className = 'bookmark-name';
                nameSpan.textContent = item.name || "Untitled Link";

                a.appendChild(img);
                a.appendChild(nameSpan);
                a.addEventListener('click', () => { addRecentActivity(item.name, item.url); });
                return a;

            } else if (item.type === 'folder') {
                const div = document.createElement('div');
                div.className = 'bookmark-folder-item';
                div.dataset.id = item.id;
                div.dataset.name = item.name || "Untitled Folder";
                div.setAttribute('role', 'button');
                div.setAttribute('tabindex', '0');

                const icon = document.createElement('i');
                icon.className = 'fas fa-folder folder-icon';
                
                const nameSpan = document.createElement('span');
                nameSpan.className = 'folder-name';
                nameSpan.textContent = item.name || "Untitled Folder";

                div.appendChild(icon);
                div.appendChild(nameSpan);

                div.addEventListener('click', () => openFolder(item.id));
                div.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') openFolder(item.id); });
                return div;
            }
        } catch (e) {
            console.error("Error creating bookmark element for:", item, e);
        }
        return null;
    }

    function openFolder(folderId) {
        if (!folderId) return;
        currentFolderPath.push(folderId);
        renderBookmarks();
    }

    function goBackToParentFolder() {
        if (currentFolderPath.length > 0) {
            currentFolderPath.pop();
            renderBookmarks();
        }
    }

    function renderBookmarks() { 
        if (!bookmarksContainer) return;
        try {
            bookmarksContainer.innerHTML = '';
            const itemsToDisplay = getCurrentFolderItems();

            if (!itemsToDisplay || itemsToDisplay.length === 0) {
                if (noBookmarksMessage) {
                    noBookmarksMessage.textContent = currentFolderPath.length > 0 ? "This folder is empty." : "No bookmarks yet. Add some manually or drag & drop links here!";
                    noBookmarksMessage.style.display = 'block';
                }
            } else {
                if (noBookmarksMessage) noBookmarksMessage.style.display = 'none';
                itemsToDisplay.forEach(item => {
                    const el = createBookmarkElement(item);
                    if (el) bookmarksContainer.appendChild(el);
                });
            }

            if (quickLinksTitle && backToParentFolderBtn) {
                if (currentFolderPath.length > 0) {
                    const currentFolderId = currentFolderPath[currentFolderPath.length - 1];
                    const currentFolder = getFolderById(currentFolderId, bookmarks);
                    quickLinksTitle.textContent = currentFolder ? currentFolder.name : "Quick Links";
                    backToParentFolderBtn.style.display = 'inline-flex';
                } else {
                    quickLinksTitle.textContent = "Quick Links";
                    backToParentFolderBtn.style.display = 'none';
                }
            }
            toggleHintsAndMessages(); 
        } catch (e) {
            console.error("Error rendering bookmarks:", e);
        }
    }

    function renderManageBookmarksList(items = bookmarks, level = 0) {
        if (!manageBookmarksList) return;
        if (level === 0) manageBookmarksList.innerHTML = ''; // Clear only at top level
        if (!Array.isArray(items)) {
            console.warn("renderManageBookmarksList received non-array items:", items);
            return;
        }
        
        try {
            const sortedItems = [...items].sort((a, b) => {
                if (!a || !b) return 0;
                if (a.type === 'folder' && b.type !== 'folder') return -1;
                if (a.type !== 'folder' && b.type === 'folder') return 1;
                return (a.name || "").localeCompare(b.name || "");
            });

            sortedItems.forEach((item) => {
                if (!item || !item.id) return; // Skip invalid items
                const li = document.createElement('li');
                li.style.marginLeft = `${level * 20}px`;

                const infoDiv = document.createElement('div');
                infoDiv.className = 'bookmark-info';
                
                const icon = document.createElement('i');
                icon.className = `fas ${item.type === 'folder' ? 'fa-folder' : 'fa-link'}`;
                infoDiv.appendChild(icon);

                const nameSpan = document.createElement('span');
                nameSpan.textContent = item.name || (item.type === 'folder' ? "Unnamed Folder" : "Unnamed Link");
                infoDiv.appendChild(nameSpan);

                if (item.type === 'link') {
                    const urlSmall = document.createElement('span');
                    urlSmall.className = 'bookmark-url-small';
                    urlSmall.textContent = item.url || "#error-no-url";
                    infoDiv.appendChild(urlSmall);
                }

                const controlsDiv = document.createElement('div');
                controlsDiv.className = 'item-controls';

                const renameBtn = document.createElement('button');
                renameBtn.innerHTML = '<i class="fas fa-edit"></i>';
                renameBtn.className = 'icon-btn rename-item-btn small-btn';
                renameBtn.setAttribute('aria-label', `Rename ${item.name || 'item'}`);
                renameBtn.addEventListener('click', () => promptRenameItem(item.id, item.name, infoDiv, nameSpan));
                
                const deleteBtn = document.createElement('button');
                deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
                deleteBtn.className = 'icon-btn delete-bookmark-btn small-btn';
                deleteBtn.setAttribute('aria-label', `Delete ${item.name || 'item'}`);
                deleteBtn.addEventListener('click', () => deleteItem(item.id));

                controlsDiv.appendChild(renameBtn);
                controlsDiv.appendChild(deleteBtn);
                li.appendChild(infoDiv);
                li.appendChild(controlsDiv);
                manageBookmarksList.appendChild(li);

                if (item.type === 'folder' && Array.isArray(item.children) && item.children.length > 0) {
                    renderManageBookmarksList(item.children, level + 1);
                }
            });
        } catch (e) {
            console.error("Error rendering manage bookmarks list:", e);
        }
    }

    function promptRenameItem(itemId, currentName, infoDiv, nameSpanElement) {
        const originalContentHTML = infoDiv.innerHTML; 
        infoDiv.innerHTML = ''; 

        const input = document.createElement('input');
        input.type = 'text';
        input.value = currentName || "";
        input.className = 'rename-input';
        input.style.flexGrow = '1';

        const saveBtn = document.createElement('button');
        saveBtn.innerHTML = '<i class="fas fa-check"></i>';
        saveBtn.className = 'icon-btn small-btn';
        saveBtn.style.color = 'var(--success-color)';

        const cancelBtn = document.createElement('button');
        cancelBtn.innerHTML = '<i class="fas fa-times"></i>';
        cancelBtn.className = 'icon-btn small-btn';
        cancelBtn.style.color = 'var(--danger-color)';
        
        const tempWrapper = document.createElement('div'); // Use a wrapper for easier replacement
        tempWrapper.style.display = 'flex';
        tempWrapper.style.alignItems = 'center';
        tempWrapper.style.width = '100%';
        tempWrapper.appendChild(input);
        tempWrapper.appendChild(saveBtn);
        tempWrapper.appendChild(cancelBtn);
        infoDiv.appendChild(tempWrapper);
        
        input.focus();
        input.select();

        const restoreOriginalContent = () => {
            infoDiv.innerHTML = originalContentHTML;
            // Re-attach event listener to the new rename button if necessary, or rely on full re-render
            // For simplicity, a full re-render is safer if the original rename button had specific closure data.
            // However, if originalContentHTML contains the original buttons with their listeners, it might be fine.
            // Safest: re-render the list item or the whole list.
             const itemLi = infoDiv.closest('li');
             if(itemLi) {
                 const found = findItemAndParentArray(itemId, bookmarks);
                 if(found) {
                     // This is a bit of a hack, ideally we would re-render just this one item.
                     // For now, just resetting the text. A full list re-render is more robust.
                    // nameSpanElement.textContent = found.item.name;
                    renderManageBookmarksList(); // Re-render the whole list to be safe.
                 }
             }
        };

        const performRename = () => {
            const newName = input.value.trim();
            if (newName && newName !== (currentName || "")) {
                const found = findItemAndParentArray(itemId, bookmarks);
                if (found && found.item) {
                    found.item.name = newName;
                    saveBookmarks();
                    renderAllBookmarks(); 
                    updateFolderDropdowns();
                } else {
                    console.error("Item not found for rename:", itemId);
                    restoreOriginalContent();
                }
            } else {
                 restoreOriginalContent();
            }
        };
        
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') { e.preventDefault(); performRename(); }
            if (e.key === 'Escape') { e.preventDefault(); restoreOriginalContent(); }
        });
        saveBtn.addEventListener('click', performRename);
        cancelBtn.addEventListener('click', restoreOriginalContent);
    }

    function renderAllBookmarks() { renderBookmarks(); renderManageBookmarksList(); }
    function saveBookmarks() { saveToLocalStorage(STORAGE_KEY_BOOKMARKS, bookmarks); }

    function addSingleBookmark(name, url, parentFolderId = 'root', skipSaveAndRender = false) {
        if (!name || !url || !isValidHttpUrl(url)) {
            console.warn("Attempted to add invalid bookmark:", {name, url, parentFolderId});
            return false;
        }
        try {
            const newBookmark = { id: generateId(), type: 'link', name, url };
            let targetArray = bookmarks;

            if (parentFolderId !== 'root') {
                const parentFolder = getFolderById(parentFolderId, bookmarks);
                if (parentFolder && parentFolder.type === 'folder') {
                    if (!Array.isArray(parentFolder.children)) parentFolder.children = [];
                    if (parentFolder.children.some(bm => bm.type === 'link' && bm.url.toLowerCase() === url.toLowerCase())) {
                        console.warn("Duplicate bookmark URL in folder:", url, parentFolderId);
                        return false; // Duplicate in folder
                    }
                    targetArray = parentFolder.children;
                } else {
                    console.warn("Parent folder not found for bookmark:", parentFolderId);
                    return false;
                }
            } else {
                if (bookmarks.some(bm => bm.type === 'link' && bm.url.toLowerCase() === url.toLowerCase() && (!bm.parentId || bm.parentId === 'root'))) {
                     console.warn("Duplicate bookmark URL at root:", url);
                    return false; // Duplicate at root
                }
            }

            targetArray.push(newBookmark);
            if (!skipSaveAndRender) { 
                saveBookmarks(); 
                renderAllBookmarks(); 
                updateFolderDropdowns();
            }
            return true;
        } catch (e) {
            console.error("Error adding single bookmark:", e);
            return false;
        }
    }

    function addFolder(name, parentFolderId = 'root') {
        const trimmedName = name.trim();
        if (!trimmedName) return false;
        try {
            const newFolder = { id: generateId(), type: 'folder', name: trimmedName, children: [] };
            let targetArray = bookmarks;
            if (parentFolderId !== 'root') {
                const parent = getFolderById(parentFolderId, bookmarks);
                if (parent && parent.type === 'folder') {
                    if (!Array.isArray(parent.children)) parent.children = [];
                    if (parent.children.some(f => f.type === 'folder' && f.name.toLowerCase() === trimmedName.toLowerCase())) return false;
                    targetArray = parent.children;
                } else {
                    return false;
                }
            } else {
                if (bookmarks.some(f => f.type === 'folder' && f.name.toLowerCase() === trimmedName.toLowerCase())) return false;
            }

            targetArray.push(newFolder);
            saveBookmarks();
            renderAllBookmarks();
            updateFolderDropdowns();
            return true;
        } catch (e) {
            console.error("Error adding folder:", e);
            return false;
        }
    }

    function deleteItem(itemId) {
        try {
            const found = findItemAndParentArray(itemId, bookmarks);
            if (!found || !found.item) {
                 console.warn("Item to delete not found:", itemId);
                 return;
            }

            const itemNameToDelete = found.item.name || (found.item.type === 'folder' ? "this folder" : "this bookmark");
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
                const pathIndex = currentFolderPath.indexOf(itemId);
                if (pathIndex !== -1) {
                    currentFolderPath = currentFolderPath.slice(0, pathIndex);
                    renderBookmarks();
                }
            }
        } catch (e) {
            console.error("Error deleting item:", e);
        }
    }
    
    function deleteAllUserBookmarks() {
        if (confirm("Are you sure you want to delete ALL bookmarks and folders? This action cannot be undone.")) {
            bookmarks = [];
            currentFolderPath = [];
            saveBookmarks();
            renderAllBookmarks();
            updateFolderDropdowns();
        }
    }

    function loadBookmarks() { 
        try {
            let loadedData = loadFromLocalStorage(STORAGE_KEY_BOOKMARKS, true);
            if (!Array.isArray(loadedData)) { // Check if it's really an array
                console.warn("Bookmarks from LS were not an array. Resetting to default.");
                loadedData = JSON.parse(JSON.stringify(DEFAULT_SETTINGS[STORAGE_KEY_BOOKMARKS]));
            }
            // Ensure integrity of each item
            bookmarks = loadedData.map(item => ensureItemIntegrity(item)).filter(Boolean); // filter(Boolean) removes nulls from ensureItemIntegrity if it returns null for bad items

            renderAllBookmarks(); 
            updateFolderDropdowns();
        } catch (e) {
            console.error("Critical error loading bookmarks, resetting to default:", e);
            bookmarks = JSON.parse(JSON.stringify(DEFAULT_SETTINGS[STORAGE_KEY_BOOKMARKS])).map(item => ensureItemIntegrity(item)).filter(Boolean);
            saveBookmarks(); // Save the reset default to LS
            renderAllBookmarks();
            updateFolderDropdowns();
        }
    }

    function updateFolderDropdowns(selectElements = null, currentItems = bookmarks, level = 0) {
        if (!selectElements) {
             selectElements = [parentFolderSelectForBookmark, parentFolderSelectForNewFolder].filter(Boolean); // Filter out nulls
        }
        if (selectElements.length === 0) return;

        try {
            if (level === 0) {
                selectElements.forEach(select => {
                    if (!select) return;
                    const currentValue = select.value;
                    select.innerHTML = '<option value="root">Root Level</option>';
                    // Try to restore selection, only if the folder still exists or it's 'root'
                    if (currentValue && (currentValue === 'root' || getFolderById(currentValue, bookmarks))) {
                        select.value = currentValue;
                    } else {
                         select.value = 'root'; // Default to root if previous selection invalid
                    }
                });
            }

            if (!Array.isArray(currentItems)) return;

            currentItems.forEach(item => {
                if (!item || item.type !== 'folder') return;
                selectElements.forEach(select => {
                    if (!select) return;
                    const option = document.createElement('option');
                    option.value = item.id;
                    option.textContent = `${'--'.repeat(level)} ${item.name || "Unnamed Folder"}`;
                    select.appendChild(option);
                });
                if (Array.isArray(item.children) && item.children.length > 0) {
                    updateFolderDropdowns(selectElements, item.children, level + 1);
                }
            });
        } catch (e) {
            console.error("Error updating folder dropdowns:", e);
        }
    }

    // --- DRAG & DROP BOOKMARKS ---
    function parseDroppedHtmlForBookmarks(htmlString) { 
        const found = [];
        if (!htmlString || typeof htmlString !== 'string') return found;
        try {
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlString, 'text/html');
            const links = doc.querySelectorAll('a');
            links.forEach(link => {
                const url = link.href;
                let name = link.textContent.trim() || link.title.trim();
                if (isValidHttpUrl(url)) {
                    if (!name) { try { name = new URL(url).hostname.replace(/^www\./, '') || "Untitled"; } catch { name = "Untitled"; }}
                    found.push({name, url});
                }
            });
        } catch (e) { console.error("Error parsing dropped HTML:", e); }
        return found;
    }
    function parseDroppedUriList(uriListString, plainTextString = "") { 
        const found = [];
        if (!uriListString || typeof uriListString !== 'string') return found;
        try {
            const urls = uriListString.split('\n').map(u => u.trim()).filter(u => u && !u.startsWith('#') && isValidHttpUrl(u));
            const titles = (plainTextString || "").split('\n').map(t => t.trim());
            urls.forEach((url, i) => {
                let name = titles[i] || "";
                if (isValidHttpUrl(titles[i])) name = ""; 
                if (!name) { try { name = new URL(url).hostname.replace(/^www\./, '') || "Untitled"; } catch { name = "Untitled"; }}
                found.push({ name, url });
            });
        } catch (e) { console.error("Error parsing dropped URI list:", e); }
        return found;
    }

    // --- SETTINGS MODAL ---
    function openSettingsModal() { 
        if (settingsModal) { 
            try {
                renderManageBookmarksList(); 
                updateFolderDropdowns();
                settingsModal.style.display = 'block'; 
                settingsModal.setAttribute('aria-hidden', 'false'); 
                if(closeSettingsModalBtn) closeSettingsModalBtn.focus(); 
            } catch (e) {
                console.error("Error opening settings modal:", e);
            }
        } 
    }
    function closeSettingsModal() { 
        if (settingsModal) { 
            settingsModal.style.display = 'none'; 
            settingsModal.setAttribute('aria-hidden', 'true'); 
        } 
    }

    // --- SETTINGS APPLICATION FUNCTIONS ---
    function _applyColor(cssVar, colorValue, isPrimaryAccent = false) {
        try {
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
        } catch (e) { console.error(`Error applying color ${cssVar}:`, e); }
    }
    function applyPageBackgroundColor(color) { _applyColor('--bg-primary', color); }
    function applyCardBackgroundColor(color) { _applyColor('--bg-secondary', color); }
    function applyPrimaryTextColor(color) { _applyColor('--text-primary', color); }
    function applyPrimaryAccentColor(color) { _applyColor('--accent-primary', color, true); }
    function applySecondaryAccentColor(color) { _applyColor('--accent-secondary', color); }
    
    function applyFaviconSize(size) { try { document.documentElement.style.setProperty('--favicon-size', `${size}px`); } catch(e){console.error("Error applying favicon size",e);}}
    function applyFontFamily(font) { try { document.documentElement.style.setProperty('--app-font-family', font); } catch(e){console.error("Error applying font",e);}}
    function applyClockVisibility(show) { 
        try {
            DEFAULT_SETTINGS[STORAGE_KEY_SHOW_CLOCK] = show; 
            if (clockWidgetContainer) clockWidgetContainer.style.setProperty('--clock-widget-display', show ? 'flex' : 'none');
            if (show) updateClock(); 
        } catch(e){console.error("Error applying clock visibility",e);}
    }
    function applyClockTimeFormat(format) { 
        try { DEFAULT_SETTINGS[STORAGE_KEY_CLOCK_TIME_FORMAT] = format; updateClock(); } catch(e){console.error("Error applying clock time format",e);}
    }
    function applyQuicklinkGridColumns(cols) { 
        try {
            const value = cols === 'auto-fill' ? 'repeat(auto-fill, minmax(180px, 1fr))' : `repeat(${cols}, 1fr)`;
            document.documentElement.style.setProperty('--quicklink-grid-columns', value);
        } catch(e){console.error("Error applying QL grid columns",e);}
    }
    function applyBorderRadius(radius) { 
        try { document.documentElement.style.setProperty('--border-radius', radius); } catch(e){console.error("Error applying border radius",e);}
    }
    function applyMainTitle(title) { 
        try { if (mainTitleElement) mainTitleElement.textContent = title || DEFAULT_SETTINGS[STORAGE_KEY_MAIN_TITLE]; } catch(e){console.error("Error applying main title",e);}
    }
    function applySearchNewTab(enabled) { DEFAULT_SETTINGS[STORAGE_KEY_SEARCH_NEW_TAB] = enabled; }
    function applyShowDragDropHint(show) {  
        try {
            DEFAULT_SETTINGS[STORAGE_KEY_SHOW_DRAG_DROP_HINT] = show;
            toggleHintsAndMessages(); 
        } catch(e){console.error("Error applying drag/drop hint visibility",e);}
    }
    function applySearxngInstanceUrl(url) { DEFAULT_SETTINGS[STORAGE_KEY_SEARXNG_INSTANCE_URL] = (url || "").trim(); }

    function applyColorPreset(presetName) {
        try {
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
        } catch (e) { console.error("Error applying color preset:", e); }
    }

    function applyBackgroundImage(imageDataUrl) {
        try {
            document.documentElement.style.setProperty('--body-bg-image', imageDataUrl ? `url("${imageDataUrl}")` : 'none');
        } catch (e) { console.error("Error applying background image style:", e); }
    }

    function handleBackgroundImageUpload(event) {
        try {
            const file = event.target.files[0];
            if (file && file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const imageDataUrl = e.target.result;
                    saveToLocalStorage(STORAGE_KEY_BACKGROUND_IMAGE, imageDataUrl);
                    DEFAULT_SETTINGS[STORAGE_KEY_BACKGROUND_IMAGE] = imageDataUrl;
                    applyBackgroundImage(imageDataUrl);
                };
                reader.readAsDataURL(file);
            } else if (file) {
                alert("Please select a valid image file.");
            }
        } catch (e) { console.error("Error handling background image upload:", e); }
    }

    function clearBackgroundImage() {
        try {
            saveToLocalStorage(STORAGE_KEY_BACKGROUND_IMAGE, null);
            DEFAULT_SETTINGS[STORAGE_KEY_BACKGROUND_IMAGE] = null;
            applyBackgroundImage(null);
            if (backgroundImageInput) backgroundImageInput.value = '';
        } catch (e) { console.error("Error clearing background image:", e); }
    }

    // --- LOAD & SAVE SETTINGS ---
    function loadAllSettings() {
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
            { key: STORAGE_KEY_BACKGROUND_IMAGE, applyFunc: (value) => { DEFAULT_SETTINGS[STORAGE_KEY_BACKGROUND_IMAGE] = value; applyBackgroundImage(value); } },
        ];

        settingsConfig.forEach(s => {
            try {
                const value = loadFromLocalStorage(s.key);
                DEFAULT_SETTINGS[s.key] = value; // Ensure DEFAULT_SETTINGS is always up-to-date with loaded value
                if (s.element) {
                    if (s.type === 'checkbox') {
                        s.element.checked = !!value; // Ensure boolean for checkbox
                    } else {
                        s.element.value = value || ""; // Ensure string for value inputs
                    }
                    if (s.key === STORAGE_KEY_SEARXNG_INSTANCE_URL && !value && s.element) {
                        s.element.placeholder = SEARXNG_DEFAULT_PLACEHOLDER;
                    }
                }
                if (s.applyFunc) s.applyFunc(value); 
            } catch (e) {
                console.error(`Error loading/applying setting ${s.key}:`, e);
            }
        });
        try {
            recentActivity = loadFromLocalStorage(STORAGE_KEY_RECENT_ACTIVITY, true);
            if (!Array.isArray(recentActivity)) recentActivity = [];
            renderRecentActivity();
        } catch (e) {
            console.error("Error loading recent activity:", e);
            recentActivity = [];
        }
    }

    function createSaveSettingHandler(key, applyFunc, isCheckbox = false, isInputEventForText = false) {
        return (event) => {
            try {
                const value = isCheckbox ? event.target.checked : event.target.value;
                saveToLocalStorage(key, value);
                DEFAULT_SETTINGS[key] = value; 
                if (applyFunc) applyFunc(value);
                if (key === STORAGE_KEY_SEARXNG_INSTANCE_URL && searxngInstanceUrlInput) {
                    searxngInstanceUrlInput.placeholder = value ? "" : SEARXNG_DEFAULT_PLACEHOLDER;
                }
            } catch (e) {
                console.error(`Error saving setting ${key}:`, e);
            }
        };
    }
    
    // --- INITIALIZATION ---
    function initializeApp() {
        try {
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
            noRecentActivityMessage = recentActivitySection ? recentActivitySection.querySelector('.no-recent-activity-message') : null;
            quickLinksTitle = document.getElementById('quick-links-title');
            backToParentFolderBtn = document.getElementById('back-to-parent-folder-btn');

            // Critical: Load settings and bookmarks first
            loadAllSettings(); 
            loadBookmarks();   
            
            updateClock(); 
            if(DEFAULT_SETTINGS[STORAGE_KEY_SHOW_CLOCK]) setInterval(updateClock, 30000);

            // Event Listeners (ensure elements exist before adding listeners)
            if (searchForm) searchForm.addEventListener('submit', (e) => { e.preventDefault(); performSearch(); });
            else console.error("Search form not found!");
            
            if (addBookmarkForm) { 
                addBookmarkForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    const name = bookmarkNameInput.value.trim();
                    const url = bookmarkUrlInput.value.trim();
                    const parentFolderId = parentFolderSelectForBookmark.value;
                    if (addSingleBookmark(name, url, parentFolderId)) {
                        bookmarkNameInput.value = '';
                        bookmarkUrlInput.value = '';
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
                setTimeout(() => { // Delay focus and value setting until modal is surely visible and populated
                    if (parentFolderSelectForBookmark) parentFolderSelectForBookmark.value = currentFolderPath.length > 0 ? currentFolderPath[currentFolderPath.length-1] : 'root';
                    if (bookmarkNameInput) bookmarkNameInput.focus();
                }, 100); 
            });
            
            if (settingsModal) {
                window.addEventListener('click', (e) => { if (e.target === settingsModal) closeSettingsModal(); });
                window.addEventListener('keydown', (e) => { if (settingsModal.style.display === 'block' && e.key === 'Escape') closeSettingsModal(); });
            }
            
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
            if (searxngInstanceUrlInput) searxngInstanceUrlInput.addEventListener('change', createSaveSettingHandler(STORAGE_KEY_SEARXNG_INSTANCE_URL, applySearxngInstanceUrl));

            if (presetButtonContainer) {
                presetButtonContainer.addEventListener('click', (e) => {
                    if (e.target.classList.contains('preset-btn')) {
                        const presetName = e.target.dataset.preset;
                        if (presetName) applyColorPreset(presetName);
                    }
                });
            }

            if (deleteAllBookmarksBtn) deleteAllBookmarksBtn.addEventListener('click', deleteAllUserBookmarks);
            if (backgroundImageInput) backgroundImageInput.addEventListener('change', handleBackgroundImageUpload);
            if (clearBackgroundImageBtn) clearBackgroundImageBtn.addEventListener('click', clearBackgroundImage);
            if (backToParentFolderBtn) backToParentFolderBtn.addEventListener('click', goBackToParentFolder);
            
            if (quickLinksDropzone) { 
                const originalHintText = dragDropHintText ? dragDropHintText.textContent : "Drag & drop web links or selected bookmarks here!";
                quickLinksDropzone.addEventListener('dragenter', (e) => { e.preventDefault(); e.stopPropagation(); quickLinksDropzone.classList.add('drag-over-active'); if (dragDropHintText) dragDropHintText.textContent = "Drop links here!"; });
                quickLinksDropzone.addEventListener('dragover', (e) => { e.preventDefault(); e.stopPropagation(); e.dataTransfer.dropEffect = 'copy'; quickLinksDropzone.classList.add('drag-over-active'); });
                quickLinksDropzone.addEventListener('dragleave', (e) => { e.preventDefault(); e.stopPropagation(); if (e.target === quickLinksDropzone || !quickLinksDropzone.contains(e.relatedTarget)) { quickLinksDropzone.classList.remove('drag-over-active'); if (dragDropHintText) dragDropHintText.textContent = originalHintText; }});
                quickLinksDropzone.addEventListener('drop', (e) => {
                    e.preventDefault(); e.stopPropagation();
                    quickLinksDropzone.classList.remove('drag-over-active');
                    if (dragDropHintText) dragDropHintText.textContent = originalHintText;
                    let processedBookmarks = [];
                    const htmlData = e.dataTransfer.getData('text/html');
                    if (htmlData) { processedBookmarks = parseDroppedHtmlForBookmarks(htmlData); }
                    else {
                        const uriListData = e.dataTransfer.getData('text/uri-list') || e.dataTransfer.getData('URL');
                        const plainTextData = e.dataTransfer.getData('text/plain');
                        if (uriListData) { processedBookmarks = parseDroppedUriList(uriListData, plainTextData); }
                        else if (plainTextData && isValidHttpUrl(plainTextData.trim())) {
                             let name = "Untitled Link";
                             try { const urlObj = new URL(plainTextData.trim()); name = urlObj.hostname.replace(/^www\./, '') || "Untitled Link"; } catch { /* use default name */ }
                             processedBookmarks.push({ name: name, url: plainTextData.trim() });
                        }
                    }
                    if (processedBookmarks.length > 0) {
                        let addedCount = 0;
                        const parentIdForDrop = currentFolderPath.length > 0 ? currentFolderPath[currentFolderPath.length - 1] : 'root';
                        processedBookmarks.forEach(bm => { if (bm && bm.name && bm.url && isValidHttpUrl(bm.url)) { if (addSingleBookmark(bm.name, bm.url, parentIdForDrop, true)) addedCount++; }});
                        if (addedCount > 0) { saveBookmarks(); renderAllBookmarks(); updateFolderDropdowns(); }
                    } else { console.warn("Could not extract valid link(s) from dropped item."); }
                });
            } 
        } catch (e) {
            console.error("MAJOR ERROR DURING INITIALIZATION:", e);
            alert("A critical error occurred while initializing the dashboard. Some features may not work. Please check the console (F12) for details and consider resetting data or reporting the issue.");
            // Fallback: display a message on the page if possible
            const body = document.querySelector('body');
            if (body) {
                const errorMsgDiv = document.createElement('div');
                errorMsgDiv.textContent = "Critical error during startup. Dashboard may be unstable. Check console (F12).";
                errorMsgDiv.style.color = "red";
                errorMsgDiv.style.backgroundColor = "black";
                errorMsgDiv.style.padding = "20px";
                errorMsgDiv.style.position = "fixed";
                errorMsgDiv.style.top = "0";
                errorMsgDiv.style.left = "0";
                errorMsgDiv.style.width = "100%";
                errorMsgDiv.style.zIndex = "9999";
                errorMsgDiv.style.textAlign = "center";
                body.prepend(errorMsgDiv);
            }
        }
    } 

    initializeApp();
});