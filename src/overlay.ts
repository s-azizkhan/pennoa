import { invoke } from "@tauri-apps/api/core";
import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow";

const SAFETY_CLOSE_MS = 12_000;
const REDUCE_CLOSE_MS = 9_000;

async function shouldReduceMotion(): Promise<boolean> {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return true;
  try {
    return await invoke<boolean>("is_reduce_motion");
  } catch {
    return false;
  }
}

window.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const title = params.get("title") ?? "—";
  const stage = params.get("stage") ?? "t10";

  document.body.dataset.stage = stage;
  const titleEl = document.getElementById("title");
  if (titleEl) titleEl.textContent = title;

  const reduceMotion = await shouldReduceMotion();
  if (reduceMotion) document.body.dataset.reduceMotion = "1";

  const stageEl = document.getElementById("stage");
  const close = () => getCurrentWebviewWindow().close();

  if (reduceMotion) {
    setTimeout(close, REDUCE_CLOSE_MS);
  } else {
    stageEl?.addEventListener("animationend", close);
    setTimeout(close, SAFETY_CLOSE_MS);
  }
});
