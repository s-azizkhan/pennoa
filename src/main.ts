import { invoke } from "@tauri-apps/api/core";
import {
  disable as disableAutostart,
  enable as enableAutostart,
  isEnabled as isAutostartEnabled,
} from "@tauri-apps/plugin-autostart";

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
});
