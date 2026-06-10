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

## Файлы

- `manifest.json` — MV3, permission `tabs`, service worker, options page.
- `background.js` — `setUninstallURL`, роутер сообщений.
- `popup.html` / `popup.css` / `popup.js` — UI и вызовы API.
- `options.html` — страница для `openOptionsPage`.
