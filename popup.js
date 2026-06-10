const logEl = document.getElementById("log");
const urlEl = document.getElementById("url");

function log(...parts) {
  const line = parts
    .map((p) => (typeof p === "object" ? JSON.stringify(p) : String(p)))
    .join(" ");
  logEl.textContent = `[${new Date().toLocaleTimeString()}] ${line}\n` + logEl.textContent;
}

function url() {
  return urlEl.value.trim() || "https://example.com";
}

// Активная вкладка текущего окна.
async function activeTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab;
}

const actions = {
  // ── on_extension_open_tab ────────────────────────────────────────────────
  async "tabs.create"() {
    const tab = await chrome.tabs.create({ url: url(), active: true });
    log("tabs.create → tabId", tab.id);
  },

  async "tabs.duplicate"() {
    const tab = await activeTab();
    const dup = await chrome.tabs.duplicate(tab.id);
    log("tabs.duplicate", tab.id, "→", dup.id);
  },

  async "openOptionsPage"() {
    await chrome.runtime.openOptionsPage();
    log("openOptionsPage → options.html");
  },

  async "showUninstallURL"() {
    // URL задаётся в background.js через chrome.runtime.setUninstallURL;
    // браузер откроет его новой вкладкой при удалении расширения.
    log("setUninstallURL установлен в background.js (откроется при удалении)");
  },

  // ── on_extension_open_window ─────────────────────────────────────────────
  async "windows.create"() {
    const win = await chrome.windows.create({
      url: url(),
      type: "normal",
      width: 800,
      height: 600,
      focused: true,
    });
    log("windows.create → windowId", win.id);
  },

  // ── on_extension_navigate_tab (disposition CURRENT_TAB) ──────────────────
  async "tabs.update.url"() {
    const tab = await activeTab();
    await chrome.tabs.update(tab.id, { url: url() });
    log("tabs.update(url) на месте → tabId", tab.id);
  },

  // ── on_extension_activate_tab ────────────────────────────────────────────
  async "tabs.update.active"() {
    const tab = await activeTab();
    await chrome.tabs.update(tab.id, { active: true });
    log("tabs.update(active:true) → tabId", tab.id);
  },

  async "tabs.highlight"() {
    const tab = await activeTab();
    await chrome.tabs.highlight({ windowId: tab.windowId, tabs: tab.index });
    log("tabs.highlight → index", tab.index);
  },

  // ── on_extension_move_tab ────────────────────────────────────────────────
  async "tabs.move.index"() {
    const tab = await activeTab();
    await chrome.tabs.move(tab.id, { index: 0 });
    log("tabs.move → index 0, tabId", tab.id);
  },

  async "tabs.move.window"() {
    const tab = await activeTab();
    // Новое окно как контейнер, затем переносим в него вкладку.
    const win = await chrome.windows.create({ focused: true });
    await chrome.tabs.move(tab.id, { windowId: win.id, index: -1 });
    log("tabs.move → windowId", win.id, "tabId", tab.id);
  },

  // ── on_extension_close_tab ───────────────────────────────────────────────
  async "tabs.remove"() {
    const tab = await activeTab();
    await chrome.tabs.remove(tab.id);
    log("tabs.remove → tabId", tab.id);
  },

  // ── on_extension_update_window ───────────────────────────────────────────
  async "windows.update.focus"() {
    const tab = await activeTab();
    await chrome.windows.update(tab.windowId, { focused: true });
    log("windows.update(focused:true) → windowId", tab.windowId);
  },

  async "windows.update.state"() {
    const tab = await activeTab();
    await chrome.windows.update(tab.windowId, { state: "maximized" });
    log("windows.update(state:maximized) → windowId", tab.windowId);
  },

  async "windows.update.bounds"() {
    const tab = await activeTab();
    // bounds требуют state:"normal".
    await chrome.windows.update(tab.windowId, {
      state: "normal",
      left: 100,
      top: 100,
      width: 700,
      height: 500,
    });
    log("windows.update(bounds) → windowId", tab.windowId);
  },

  // ── on_extension_close_window ────────────────────────────────────────────
  async "windows.remove"() {
    const tab = await activeTab();
    await chrome.windows.remove(tab.windowId);
    log("windows.remove → windowId", tab.windowId);
  },

  // ── Страницы расширения ──────────────────────────────────────────────────
  async "page.options"() {
    await chrome.runtime.openOptionsPage();
    log("options → openOptionsPage");
  },

  async "page.newtab"() {
    await chrome.tabs.create({ url: chrome.runtime.getURL("newtab.html") });
    log("newtab открыт явно (или просто открой новую вкладку)");
  },

  async "page.bookmarks"() {
    await chrome.tabs.create({ url: chrome.runtime.getURL("bookmarks.html") });
    log("bookmarks.html открыт");
  },

  async "page.history"() {
    await chrome.tabs.create({ url: chrome.runtime.getURL("history.html") });
    log("history.html открыт");
  },

  async "page.sandbox"() {
    await chrome.tabs.create({ url: chrome.runtime.getURL("sandbox-host.html") });
    log("sandbox-host.html открыт");
  },

  async "page.sidepanel"() {
    const tab = await activeTab();
    // sidePanel.open требует жеста пользователя — клик по кнопке подходит.
    await chrome.sidePanel.open({ windowId: tab.windowId });
    log("side panel открыт для windowId", tab.windowId);
  },
};

document.querySelectorAll("button[data-action]").forEach((btn) => {
  btn.addEventListener("click", async () => {
    const name = btn.dataset.action;
    try {
      await actions[name]();
    } catch (err) {
      log("ERROR", name, "→", err.message);
    }
  });
});
