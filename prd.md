# Pennoa — Product Requirements Document

> *Meeting reminders that respect your flow.*

| | |
|---|---|
| **Product Name** | Pennoa |
| **Codename** | PlaneBanner |
| **Version** | 1.0 |
| **Status** | Finalized — ready for build |
| **Target Platforms** | macOS · Windows |
| **Distribution** | GitHub Releases (free) |
| **Pricing** | Free, open-source |
| **Data Philosophy** | 100% local. No accounts. No telemetry. No internet required. |
| **Document Date** | 2026-05-25 |

---

## 1. Executive Summary

### 1.1 The Problem
Standard meeting notifications fail at their one job. A corner pop-up doesn't break through deep work, and most users have trained themselves to dismiss alerts reflexively. The result: missed meetings, late joins, and the anxiety of living inside a calendar app to compensate.

### 1.2 The Solution
Pennoa flies a small airplane across your screen ten and five minutes before each meeting, trailing a banner with the meeting title. The plane floats above every application but cannot be clicked, dismissed, or interacted with. You keep working. It passes by. The reminder is brief, distinctive, and impossible to miss without ever stealing focus.

### 1.3 Differentiation

| | Standard Alert | Pennoa |
|---|---|---|
| Form | Static corner pop-up | Cinematic motion across the full screen |
| Interaction | Must dismiss or click | Pure visual event — zero clicks |
| Privacy | Often cloud-backed | Fully local |
| Personality | Generic system chrome | Designed, refined, warm |
| Cost | Bundled with calendar SaaS | Free, open-source |

---

## 2. Target Users

| Persona | Trigger | Need |
|---|---|---|
| **Deep-focus maker** | In flow, missed standup | Peripheral motion that signals without stealing focus |
| **Independent professional** | Ad-hoc schedule, no calendar discipline | Fast manual entry, no account setup |
| **Privacy-first user** | Avoids cloud SaaS | Local-only data, no telemetry |
| **Designer-tier Mac user** | Cares about tool aesthetics | A reminder that matches their Things/Linear/Arc stack |

---

## 3. User Stories

- *Add fast.* Type a meeting title and time. Done in under 15 seconds.
- *See the plane.* Ten minutes before, an airplane drifts across the screen with the meeting title on its banner.
- *Feel the urgency.* Five minutes before, the banner returns in warmer tones at a quicker tempo.
- *Keep working.* Mouse and keyboard pass straight through the banner. Nothing to dismiss.
- *Bulk import.* Drag in an `.ics` export from any calendar to seed reminders.
- *Pause.* One click silences reminders for an hour or until tomorrow.
- *Stay quiet.* The app lives in the menu bar / system tray with a tiny mark.

---

## 4. Core Features

### 4.1 Meeting Management
- **Add** — Title, date, time. Three fields. No more.
- **Edit / Delete** — Direct mutation of upcoming reminders.
- **Repeat** — Daily and weekly only in v1. Complex recurrence deferred to v4.
- **Import** — Drag-and-drop or file-pick `.ics`. Parses VEVENT entries into local store.

### 4.2 Reminders
- **Default cadence** — T−10 and T−5 minutes before each meeting.
- **Custom intervals** — User-overridable per meeting or globally.
- **Visual differentiation:**

| Stage | Palette | Tempo | Mood |
|---|---|---|---|
| T−10 | Sky blue + parchment | Slow, drifting | Calm, ample time |
| T−5 | Amber + poppy | Quicker, lower altitude | Time is short |

### 4.3 The Banner Overlay — *Look, Don't Touch*
- Borderless, semi-transparent overlay window.
- **Always on top** of every other window.
- **Fully non-interactive.** Pointer events pass through. No click target. No dismiss button. No hover state.
- Plays once per trigger. Disappears when the plane exits the screen edge.
- Animation length: 8–10 seconds.
- Plane carries the meeting title only. No links. No actions. No metadata leak.

### 4.4 Menu Bar / System Tray
- Tiny airplane mark in the OS status area.
- Click reveals:
  - *Next: [meeting] in [N] minutes*
  - *Pause for 1 hour*
  - *Pause until tomorrow*
  - *Open Pennoa*
  - *Test banner*
  - *Quit*

### 4.5 Privacy & Offline
- Zero network calls. App functions identically with the machine offline.
- All data stored in local app-support directory in plain `.json` or `.sqlite`.
- No accounts, no IDs, no telemetry, no crash reporting that leaves the device.

---

## 5. UI Concepts

### Main Window — Meeting List
Clean, single-column list. Today first, then upcoming. Header row holds **+** (add) and **↥** (import .ics). Each row: title · time · reminder badge.

### Add / Edit Sheet
Sheet-style modal. Three required fields (title, date, time), one optional (repeat: none / daily / weekly), one optional (custom reminder intervals).

### Banner Overlay
```
    ┌──────────────────────────────────────────────┐
    │   standup with the team — 10 minutes         │  ✈
    └──────────────────────────────────────────────┘
```
Plane enters from screen-left, banner trails behind, exits screen-right. Cursor and clicks pass through unaffected.

### Menu Bar
```
✈  Pennoa
─────────────────────
Next: Design Review · 23 min
─────────────────────
Pause for 1 hour
Pause until tomorrow
─────────────────────
Open Pennoa
Test banner
Quit
```

---

## 6. Non-Functional Requirements

| Quality | Expectation |
|---|---|
| **Animation performance** | 60 fps banner playback on M-series Mac and modern Windows GPUs. No stutter when other apps under load. |
| **Idle footprint** | < 1% CPU, < 80MB RAM when no banner playing. |
| **Add-meeting time** | Under 15 seconds, keyboard-only. |
| **Trigger reliability** | Banner fires within ±2 seconds of scheduled time as long as app process is alive. |
| **Accessibility** | High-contrast banner text. OS `reduce motion` setting replaces animation with a static centred banner of equal duration. |
| **Install size** | < 30 MB download. |
| **Cold start** | Tray icon visible within 2 seconds of launch. |
| **Offline** | Full functionality without network. |

---

## 7. Success Metrics

| Metric | Target | How measured |
|---|---|---|
| 30-day install retention | > 65% | Self-reported via opt-in survey (no telemetry) |
| Missed-meeting reduction | Majority positive in qualitative feedback | GitHub Discussions, issue tracker |
| Animation playback complaints | Near zero | Issue-tracker tag counts |
| GitHub stars | Steady growth | Public counter |
| Time-to-first-meeting after install | < 60 seconds | Onboarding usability sessions |

---

## 8. Risks & Mitigations

| Risk | Mitigation |
|---|---|
| Animation feels intrusive after weeks of use | Short 8–10s duration · pause shortcuts · per-meeting opt-out · `reduce motion` honoured |
| Banner rendering glitches on uncommon GPUs | Multi-platform CI testing · graceful static fallback · clear bug-report path |
| Users forget to add meetings manually | First-run guided tutorial · `.ics` import surfaced prominently · sample meeting pre-loaded |
| Single-device only by design | Documented as a privacy feature, not a limitation · Phase 4 explores local-folder sync |
| Click-through window blocked by OS-level focus tools | Detect and surface a clear permissions prompt during onboarding |

---

## 9. Roadmap

### Phase 1 — MVP · Core Experience
- Manual add / edit / delete meetings
- Banner overlay with mouse passthrough
- T−10 and T−5 automatic triggers
- Menu bar / system tray icon
- Auto-start at login

### Phase 2 — Import & Control
- `.ics` import (drag-and-drop + file picker)
- Pause: 1 hour / until tomorrow
- Daily and weekly repeat
- Custom reminder intervals
- `reduce motion` accessibility fallback

### Phase 3 — Polish
- Visual customisation: plane style, banner palette
- Optional subtle sound cue
- *Up next* badge on tray icon
- Respect Focus / Do Not Disturb modes

### Phase 4 — Sync & Advanced Recurrence
- Direct CalDAV sync (no third-party middle-man)
- Complex recurrence (e.g., *every third Tuesday*)
- Multi-device sync via local shared folder (iCloud Drive · Dropbox · Syncthing)

---

## 10. Resolved Decisions

| Question | Decision |
|---|---|
| Should clicking the banner do anything? | **No.** The banner is fully non-interactive. No clicks, no dismiss, no join link. |
| Where is the app distributed? | **GitHub Releases** for macOS and Windows. |
| Pricing model? | **Free.** Open-source. No purchase, subscription, or in-app payment. |
| Complex recurring meetings in v1? | **No.** Daily and weekly only. Complex recurrence deferred to Phase 4. |
| Cloud sync in v1? | **No.** Local-only by design. Phase 4 considers local-folder sync. |
| Telemetry / analytics? | **None.** Zero outbound traffic at any time. |

---

## 11. Open Questions (Pre-Build)

- **Banner trajectory** — single horizontal pass left-to-right, or arced curve mimicking real banner flight? Decision impacts physics model.
- **Multi-monitor behaviour** — primary display only, or pass through all displays in sequence?
- **Overlap policy** — if two meetings fire reminders within seconds, do banners queue, stack vertically, or merge into one?
- **Banner persistence on locked screen** — render above lock screen, or suppress until unlock?
- **Auto-update mechanism** — Sparkle (macOS) + WinSparkle (Windows), or manual download per release?

---

*Pennoa · v1.0 PRD · 2026-05-25*
