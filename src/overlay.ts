import { invoke } from "@tauri-apps/api/core";
import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow";
import { DEFAULT_PLANE_SVG } from "./plane";

const SAFETY_CLOSE_MS = 24_000;
const REDUCE_CLOSE_MS = 9_000;

async function shouldReduceMotion(): Promise<boolean> {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return true;
  try {
    return await invoke<boolean>("is_reduce_motion");
  } catch {
    return false;
  }
}

async function loadBannerVariant(): Promise<string> {
  try {
    const v = await invoke<string>("get_banner_variant");
    return v || "pennant";
  } catch {
    return "pennant";
  }
}

async function loadBannerSpeed(): Promise<string> {
  try {
    const v = await invoke<string>("get_banner_speed");
    return v || "normal";
  } catch {
    return "normal";
  }
}

async function loadPlaneSvg(): Promise<string> {
  try {
    const custom = await invoke<string | null>("get_plane_svg");
    if (custom && custom.trim().length > 0) return custom;
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

function renderPlane(content: string, container: HTMLElement): void {
  if (content.startsWith("data:image/")) {
    const img = new Image();
    img.src = content;
    img.alt = "";
    img.style.maxWidth = "100%";
    img.style.maxHeight = "100%";
    container.replaceChildren(img);
  } else {
    container.innerHTML = sanitizeSvg(content);
  }
}

window.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const title = params.get("title") ?? "—";
  const stage = params.get("stage") ?? "t10";

  document.body.dataset.stage = stage;
  document.body.dataset.variant = await loadBannerVariant();
  document.body.dataset.speed = await loadBannerSpeed();
  const titleEl = document.getElementById("title");
  if (titleEl) titleEl.textContent = title;

  const planeEl = document.getElementById("plane");
  if (planeEl) renderPlane(await loadPlaneSvg(), planeEl);

  const reduceMotion = await shouldReduceMotion();
  if (reduceMotion) document.body.dataset.reduceMotion = "1";

  const stageEl = document.getElementById("stage");
  const close = () => getCurrentWebviewWindow().close();

  if (reduceMotion) {
    setTimeout(close, REDUCE_CLOSE_MS);
  } else {
    stageEl?.addEventListener("animationend", () => {
      document.body.classList.add("is-done");
      setTimeout(close, 600);
    });
    setTimeout(close, SAFETY_CLOSE_MS);
  }
});
