document.getElementById("eval").addEventListener("click", () => {
  // Выполняем выражение в контексте инспектируемой страницы.
  chrome.devtools.inspectedWindow.eval(
    "({ url: location.href, title: document.title })",
    (result, isException) => {
      document.getElementById("out").textContent = isException
        ? "Ошибка: " + JSON.stringify(isException)
        : JSON.stringify(result, null, 2);
    }
  );
});
