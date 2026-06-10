// Content script — выполняется внутри обычных веб-страниц (http/https).
// Показывает короткий баннер, чтобы было видно, что скрипт внедрился.
(function () {
  if (document.getElementById("__tester_banner")) return;

  const banner = document.createElement("div");
  banner.id = "__tester_banner";
  banner.textContent = "✅ content.js внедрён расширением Tester";
  Object.assign(banner.style, {
    position: "fixed",
    top: "8px",
    right: "8px",
    zIndex: "2147483647",
    padding: "6px 10px",
    background: "#2d4a6b",
    color: "#fff",
    font: "12px -apple-system, sans-serif",
    borderRadius: "6px",
    boxShadow: "0 2px 8px rgba(0,0,0,.3)",
    cursor: "pointer",
  });
  banner.addEventListener("click", () => banner.remove());
  document.documentElement.appendChild(banner);

  setTimeout(() => banner.remove(), 4000);
})();
