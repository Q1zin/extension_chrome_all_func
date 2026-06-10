// Регистрирует свою панель в DevTools. Открой DevTools (F12) → вкладка "Tester".
chrome.devtools.panels.create(
  "Tester",            // имя вкладки
  null,                // иконка (необязательно)
  "panel.html",        // содержимое панели
  (panel) => {
    console.log("DevTools panel 'Tester' created", panel);
  }
);
