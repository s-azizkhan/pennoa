import { invoke } from "@tauri-apps/api/core";
import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow";
import { DEFAULT_PLANE_SVG } from "./plane";

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

async function loadPlaneSvg(): Promise<string> {
  try {
    const custom = await invoke<string | null>("get_plane_svg");
    if (custom && custom.trim().length > 0) return sanitizeSvg(custom);
  } catch {
    /* fall through to default */
  }
  return DEFAULT_PLANE_SVG;
}

function sanitizeSvg(s: string): string {
  return s
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/\s+on\w+\s*=\s*"[^"]*"/gi, "")
    .replace(/\s+on\w+\s*=\s*'[^']*'/gi, "")
    .replace(/javascript:/gi, "");
}

window.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const title = params.get("title") ?? "—";
  const stage = params.get("stage") ?? "t10";

  document.body.dataset.stage = stage;
  const titleEl = document.getElementById("title");
  if (titleEl) titleEl.textContent = title;

  const planeEl = document.getElementById("plane");
  if (planeEl) planeEl.innerHTML = await loadPlaneSvg();

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
