import { invoke } from "@tauri-apps/api/core";
import {
  disable as disableAutostart,
  enable as enableAutostart,
  isEnabled as isAutostartEnabled,
} from "@tauri-apps/plugin-autostart";
import { DEFAULT_PLANE_SVG } from "./plane";

const MAX_SVG_BYTES = 256 * 1024;

function sanitizeSvg(s: string): string {
  return s
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/\s+on\w+\s*=\s*"[^"]*"/gi, "")
    .replace(/\s+on\w+\s*=\s*'[^']*'/gi, "")
    .replace(/javascript:/gi, "");
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

async function initPlanePicker(): Promise<void> {
  const preview = $("#plane-preview") as HTMLDivElement;
  const input = $("#plane-upload-input") as HTMLInputElement;
  const resetBtn = $("#plane-reset-btn") as HTMLButtonElement;
  const hint = $("#plane-hint") as HTMLParagraphElement;

  const renderPreview = (svg: string, custom: boolean) => {
    preview.innerHTML = svg;
    preview.dataset.custom = custom ? "1" : "";
    resetBtn.hidden = !custom;
  };

  async function loadCurrent() {
    try {
      const custom = await invoke<string | null>("get_plane_svg");
      if (custom && custom.trim().length > 0) {
        renderPreview(sanitizeSvg(custom), true);
      } else {
        renderPreview(DEFAULT_PLANE_SVG, false);
      }
    } catch (e) {
      console.error("get_plane_svg failed", e);
      renderPreview(DEFAULT_PLANE_SVG, false);
    }
  }

  input.addEventListener("change", async () => {
    const file = input.files?.[0];
    input.value = "";
    if (!file) return;
    if (file.size > MAX_SVG_BYTES) {
      hint.textContent = `Too large (max ${MAX_SVG_BYTES / 1024} KB).`;
      return;
    }
    const text = await file.text();
    if (!text.toLowerCase().includes("<svg")) {
      hint.textContent = "Not an SVG file.";
      return;
    }
    const clean = sanitizeSvg(text);
    try {
      await invoke("set_plane_svg", { svg: clean });
      renderPreview(clean, true);
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
  void initPlanePicker();
});
