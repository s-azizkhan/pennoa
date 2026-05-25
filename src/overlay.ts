import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow";

window.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const title = params.get("title") ?? "—";
  const stage = params.get("stage") ?? "t10";

  document.body.dataset.stage = stage;
  const titleEl = document.getElementById("title");
  if (titleEl) titleEl.textContent = title;

  const stageEl = document.getElementById("stage");
  const close = () => getCurrentWebviewWindow().close();
  stageEl?.addEventListener("animationend", close);

  // Safety: close after 12s even if animationend never fires.
  setTimeout(close, 12000);
});
