import { invoke } from "@tauri-apps/api/core";
import {
  disable as disableAutostart,
  enable as enableAutostart,
  isEnabled as isAutostartEnabled,
} from "@tauri-apps/plugin-autostart";
import { DEFAULT_PLANE_SVG, PLANE_PRESETS } from "./plane";

const MAX_SVG_BYTES = 2 * 1024 * 1024;

function sanitizeSvg(s: string): string {
  return s
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/\s+on\w+\s*=\s*"[^"]*"/gi, "")
    .replace(/\s+on\w+\s*=\s*'[^']*'/gi, "")
    .replace(/javascript:/gi, "");
}

function renderPlaneInto(content: string, container: HTMLElement): void {
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

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result ?? ""));
    r.onerror = () => reject(r.error);
    r.readAsDataURL(file);
  });
}

type Repeat = "none" | "daily" | "weekly";

interface Meeting {
  id: string;
  title: string;
  starts_at: string;
  repeat: Repeat;
  reminder_offsets_secs: number[];
}

const $ = <T extends HTMLElement = HTMLElement>(sel: string) =>
  document.querySelector(sel) as T;

let editingId: string | null = null;

function escapeHtml(s: string): string {
  return s.replace(/[&<>"]/g, (c) => {
    switch (c) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      default:
        return "&quot;";
    }
  });
}

function formatWhen(d: Date): string {
  const now = new Date();
  const sameDay =
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate();
  if (sameDay) {
    return `Today · ${d.toLocaleTimeString(undefined, {
      hour: "numeric",
      minute: "2-digit",
    })}`;
  }
  return d.toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function pad2(n: number): string {
  return n < 10 ? `0${n}` : `${n}`;
}

function toLocalDateValue(d: Date): string {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

function toLocalTimeValue(d: Date): string {
  return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
}

async function refresh(): Promise<void> {
  const meetings = await invoke<Meeting[]>("list_meetings");
  const list = $("#meetings") as HTMLUListElement;
  list.innerHTML = "";
  if (meetings.length === 0) {
    const li = document.createElement("li");
    li.className = "meeting-list__empty";
    li.textContent = "No meetings yet.";
    list.appendChild(li);
    return;
  }
  for (const m of meetings) {
    const li = document.createElement("li");
    li.className = "meeting";
    li.dataset.id = m.id;
    const when = new Date(m.starts_at);
    const repeatBadge =
      m.repeat !== "none"
        ? ` <span class="meeting__badge">${m.repeat}</span>`
        : "";
    li.innerHTML = `
      <div class="meeting__title">${escapeHtml(m.title)}</div>
      <div class="meeting__meta">${escapeHtml(formatWhen(when))}${repeatBadge}</div>
    `;
    li.addEventListener("click", () => openModal(m));
    list.appendChild(li);
  }
}

function openModal(m?: Meeting): void {
  editingId = m?.id ?? null;
  const form = $("#form") as HTMLFormElement;
  form.reset();
  ($("#modal-title") as HTMLHeadingElement).textContent = m
    ? "Edit meeting"
    : "New meeting";
  const delBtn = $("#delete-btn") as HTMLButtonElement;
  delBtn.hidden = !m;

  const titleInput = form.elements.namedItem("title") as HTMLInputElement;
  const dateInput = form.elements.namedItem("date") as HTMLInputElement;
  const timeInput = form.elements.namedItem("time") as HTMLInputElement;
  const repeatSelect = form.elements.namedItem("repeat") as HTMLSelectElement;

  if (m) {
    const d = new Date(m.starts_at);
    titleInput.value = m.title;
    dateInput.value = toLocalDateValue(d);
    timeInput.value = toLocalTimeValue(d);
    repeatSelect.value = m.repeat;
  } else {
    const soon = new Date(Date.now() + 10 * 60 * 1000);
    dateInput.value = toLocalDateValue(soon);
    timeInput.value = toLocalTimeValue(soon);
    repeatSelect.value = "none";
  }

  ($("#modal") as HTMLDivElement).hidden = false;
  titleInput.focus();
}

function closeModal(): void {
  ($("#modal") as HTMLDivElement).hidden = true;
  editingId = null;
}

async function onSubmit(e: SubmitEvent): Promise<void> {
  e.preventDefault();
  const form = e.target as HTMLFormElement;
  const fd = new FormData(form);
  const title = String(fd.get("title") ?? "").trim();
  const date = String(fd.get("date") ?? "");
  const time = String(fd.get("time") ?? "");
  const repeat = String(fd.get("repeat") ?? "none") as Repeat;
  if (!title || !date || !time) return;
  const local = new Date(`${date}T${time}`);
  if (Number.isNaN(local.getTime())) return;
  const starts_at = local.toISOString();
  const payload = { title, starts_at, repeat, reminder_offsets_secs: null };
  if (editingId) {
    await invoke("update_meeting", { input: { id: editingId, ...payload } });
  } else {
    await invoke("add_meeting", { input: payload });
  }
  closeModal();
  await refresh();
}

async function onDelete(): Promise<void> {
  if (!editingId) return;
  await invoke("delete_meeting", { id: editingId });
  closeModal();
  await refresh();
}

async function initSpeedPicker(): Promise<void> {
  const picker = $("#speed-picker") as HTMLDivElement;
  const options = picker.querySelectorAll<HTMLButtonElement>(
    ".speed-picker__option",
  );

  function markActive(speed: string) {
    options.forEach((o) => {
      o.classList.toggle(
        "speed-picker__option--active",
        o.dataset.speed === speed,
      );
    });
  }

  let current = "normal";
  try {
    current = (await invoke<string>("get_banner_speed")) || "normal";
  } catch (e) {
    console.error("get_banner_speed failed", e);
  }
  markActive(current);

  options.forEach((opt) => {
    opt.addEventListener("click", async () => {
      const speed = opt.dataset.speed;
      if (!speed) return;
      try {
        await invoke("set_banner_speed", { speed });
        markActive(speed);
      } catch (e) {
        console.error("set_banner_speed failed", e);
      }
    });
  });
}

async function initVariantPicker(): Promise<void> {
  const picker = $("#variant-picker") as HTMLDivElement;
  const options = picker.querySelectorAll<HTMLButtonElement>(
    ".variant-picker__option",
  );

  function markActive(variant: string) {
    options.forEach((o) => {
      o.classList.toggle(
        "variant-picker__option--active",
        o.dataset.variant === variant,
      );
    });
  }

  let current = "pennant";
  try {
    current = (await invoke<string>("get_banner_variant")) || "pennant";
  } catch (e) {
    console.error("get_banner_variant failed", e);
  }
  markActive(current);

  options.forEach((opt) => {
    opt.addEventListener("click", async () => {
      const variant = opt.dataset.variant;
      if (!variant) return;
      try {
        await invoke("set_banner_variant", { variant });
        markActive(variant);
      } catch (e) {
        console.error("set_banner_variant failed", e);
      }
    });
  });
}

async function initPlanePicker(): Promise<void> {
  const presetGrid = $("#plane-presets") as HTMLDivElement;
  const preview = $("#plane-preview") as HTMLDivElement;
  const input = $("#plane-upload-input") as HTMLInputElement;
  const resetBtn = $("#plane-reset-btn") as HTMLButtonElement;
  const hint = $("#plane-hint") as HTMLParagraphElement;

  presetGrid.innerHTML = PLANE_PRESETS.map(
    (p) => `
      <button
        type="button"
        class="plane-preset"
        data-preset="${p.id}"
        title="${p.name}"
      >
        <span class="plane-preset__icon">${p.svg}</span>
        <span class="plane-preset__name">${p.name}</span>
      </button>
    `,
  ).join("");

  const presetButtons =
    presetGrid.querySelectorAll<HTMLButtonElement>(".plane-preset");

  function markActive(svg: string | null) {
    presetButtons.forEach((b) => {
      const id = b.dataset.preset;
      const match = PLANE_PRESETS.find((p) => p.id === id);
      const isActive = match ? match.svg === svg : false;
      b.classList.toggle("plane-preset--active", isActive);
    });
  }

  const renderPreview = (content: string, custom: boolean) => {
    renderPlaneInto(content, preview);
    preview.dataset.custom = custom ? "1" : "";
    resetBtn.hidden = !custom && content === DEFAULT_PLANE_SVG;
    markActive(custom ? null : content);
  };

  async function loadCurrent() {
    try {
      const stored = await invoke<string | null>("get_plane_svg");
      if (stored && stored.trim().length > 0) {
        const isPreset = PLANE_PRESETS.some((p) => p.svg === stored);
        renderPreview(stored, !isPreset);
      } else {
        renderPreview(DEFAULT_PLANE_SVG, false);
      }
    } catch (e) {
      console.error("get_plane_svg failed", e);
      renderPreview(DEFAULT_PLANE_SVG, false);
    }
  }

  presetButtons.forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.preset;
      const preset = PLANE_PRESETS.find((p) => p.id === id);
      if (!preset) return;
      try {
        if (preset.id === PLANE_PRESETS[0].id) {
          await invoke("clear_plane_svg");
        } else {
          await invoke("set_plane_svg", { svg: preset.svg });
        }
        renderPreview(preset.svg, false);
        hint.textContent = `${preset.name} selected.`;
      } catch (e) {
        hint.textContent = String(e);
      }
    });
  });

  input.addEventListener("change", async () => {
    const file = input.files?.[0];
    input.value = "";
    if (!file) return;
    if (file.size > MAX_SVG_BYTES) {
      hint.textContent = `Too large (max ${Math.round(MAX_SVG_BYTES / 1024)} KB).`;
      return;
    }

    const isSvg =
      file.type === "image/svg+xml" || /\.svg$/i.test(file.name);
    const isRaster =
      file.type === "image/png" ||
      file.type === "image/jpeg" ||
      file.type === "image/webp" ||
      /\.(png|jpe?g|webp)$/i.test(file.name);

    let payload: string;
    if (isSvg) {
      const text = await file.text();
      if (!text.toLowerCase().includes("<svg")) {
        hint.textContent = "Not a valid SVG.";
        return;
      }
      payload = sanitizeSvg(text);
    } else if (isRaster) {
      payload = await readAsDataUrl(file);
    } else {
      hint.textContent = "Unsupported format. SVG, PNG, JPEG, or WebP only.";
      return;
    }

    try {
      await invoke("set_plane_svg", { svg: payload });
      renderPreview(payload, true);
      hint.textContent = "Custom plane saved.";
    } catch (e) {
      hint.textContent = String(e);
    }
  });

  resetBtn.addEventListener("click", async () => {
    try {
      await invoke("clear_plane_svg");
      renderPreview(DEFAULT_PLANE_SVG, false);
      hint.textContent = "Default plane restored.";
    } catch (e) {
      hint.textContent = String(e);
    }
  });

  await loadCurrent();
}

async function initAutostartToggle(): Promise<void> {
  const toggle = $("#autostart-toggle") as HTMLInputElement;
  try {
    toggle.checked = await isAutostartEnabled();
  } catch (e) {
    console.error("autostart status failed", e);
    toggle.disabled = true;
    return;
  }
  toggle.addEventListener("change", async () => {
    try {
      if (toggle.checked) {
        await enableAutostart();
      } else {
        await disableAutostart();
      }
    } catch (e) {
      console.error("autostart toggle failed", e);
      toggle.checked = !toggle.checked;
    }
  });
}

window.addEventListener("DOMContentLoaded", () => {
  $("#add-btn").addEventListener("click", () => openModal());
  $("#cancel-btn").addEventListener("click", closeModal);
  $("#delete-btn").addEventListener("click", () => {
    void onDelete();
  });
  ($("#form") as HTMLFormElement).addEventListener("submit", (e) => {
    void onSubmit(e as SubmitEvent);
  });
  ($("#modal") as HTMLDivElement).addEventListener("click", (e) => {
    if (e.target === e.currentTarget) closeModal();
  });
  void refresh();
  void initAutostartToggle();
  void initSpeedPicker();
  void initVariantPicker();
  void initPlanePicker();
});
