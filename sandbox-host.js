const frame = document.getElementById("frame");
const out = document.getElementById("out");
let counter = 0;
const pending = {};

window.addEventListener("message", (e) => {
  const cb = pending[e.data.id];
  if (cb) {
    cb(e.data.result);
    delete pending[e.data.id];
  }
});

document.getElementById("run").addEventListener("click", () => {
  const id = ++counter;
  const expr = document.getElementById("expr").value;
  pending[id] = (result) => {
    out.textContent = `${expr} = ${result}`;
  };
  frame.contentWindow.postMessage({ id, expr }, "*");
});
