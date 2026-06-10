# Tabs & Windows Function Tester

Chrome-расширение (Manifest V3) — стенд для тестирования действий
`chrome.tabs` / `chrome.windows`. В popup по кнопке вызывается соответствующий API,
результат пишется в лог внизу.

## Установка

1. `chrome://extensions` → включить **Developer mode**.
2. **Load unpacked** → выбрать эту папку.
3. Кликнуть иконку расширения, чтобы открыть popup.

## Покрытые события и источники

| Событие | Кнопки / API |
|---|---|
| `on_extension_open_tab` | `chrome.tabs.create`, `chrome.tabs.duplicate`, `chrome.runtime.openOptionsPage`, страница `chrome.runtime.setUninstallURL` |
| `on_extension_open_window` | `chrome.windows.create` |
| `on_extension_navigate_tab` | `chrome.tabs.update` с `url` (CURRENT_TAB) |
| `on_extension_activate_tab` | `chrome.tabs.update` с `active:true`, `chrome.tabs.highlight` |
| `on_extension_move_tab` | `chrome.tabs.move` (в т.ч. в другое окно) |
| `on_extension_close_tab` | `chrome.tabs.remove` |
| `on_extension_update_window` | `chrome.windows.update` (focus / state / bounds) |
| `on_extension_close_window` | `chrome.windows.remove` |

## Типы страниц расширения

| Тип | Файл(ы) | Как проверить |
|---|---|---|
| Popup | `popup.html` | клик по иконке |
| Options | `options.html` | кнопка «options» / правый клик по иконке → Options |
| Side panel | `sidepanel.html` | кнопка «side panel» (`chrome.sidePanel.open`) |
| New Tab override | `newtab.html` | открыть новую вкладку (Ctrl/Cmd+T) |
| Custom HTML | `bookmarks.html`, `history.html` | кнопки в секции «Страницы» |
| DevTools page + panel | `devtools.html` → `panel.html` | открыть DevTools (F12) → вкладка **Tester** |
| Content script | `content.js` | зайти на любой http/https сайт — появится баннер |
| Sandbox page | `sandbox.html` (+ host `sandbox-host.html`) | кнопка «sandbox host» |

⚠️ **Override может быть только один на расширение.** Сейчас занят `newtab`.
Чтобы заменить менеджер закладок или историю — поменяй ключ в
`chrome_url_overrides` (`bookmarks` / `history`) вместо `newtab`.

## Файлы

- `manifest.json` — MV3: `tabs` + `sidePanel`, host permissions, service worker,
  options, side_panel, newtab override, devtools, content script, sandbox.
- `background.js` — `setUninstallURL`, роутер сообщений.
- `popup.html` / `popup.css` / `popup.js` — UI, вызовы API, открытие страниц.
- `options.html`, `sidepanel.html`, `newtab.html`, `bookmarks.html`,
  `history.html` — страницы расширения.
- `devtools.html` / `devtools.js` / `panel.html` / `panel.js` — DevTools-панель.
- `content.js` — content script (баннер на страницах).
- `sandbox.html` / `sandbox-host.html` / `sandbox-host.js` — sandbox + демо postMessage.
