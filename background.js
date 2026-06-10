// Service worker: lifecycle setup + logging.

// on_extension_open_tab (источник): страница, которая откроется в новой вкладке
// при удалении расширения. Браузер сам открывает её через chrome.tabs.create.
const UNINSTALL_URL = "https://example.com/uninstall-feedback";

function registerUninstallURL() {
  chrome.runtime.setUninstallURL(UNINSTALL_URL, () => {
    if (chrome.runtime.lastError) {
      console.warn("setUninstallURL failed:", chrome.runtime.lastError.message);
    } else {
      console.log("Uninstall URL set:", UNINSTALL_URL);
    }
  });
}

chrome.runtime.onInstalled.addListener(registerUninstallURL);
chrome.runtime.onStartup.addListener(registerUninstallURL);

// Чтобы actions, которым удобнее жить в worker'е, тоже работали — простой роутер.
chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg && msg.type === "openOptionsPage") {
    chrome.runtime.openOptionsPage(() => sendResponse({ ok: !chrome.runtime.lastError }));
    return true; // async response
  }
  return false;
});
