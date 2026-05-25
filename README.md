# Pennoa

> Meeting reminders that respect your flow.

A small airplane drifts across your screen ten and five minutes before each meeting, trailing a banner with the meeting title. The plane floats above every application but cannot be clicked, dismissed, or interacted with. You keep working. It passes by.

Local-only. No accounts. No telemetry. macOS first; Windows port to follow.

## Status

Early scaffold. See `prd.md` for the v1 spec and `BRAND.md` for the brand foundation.

## Develop

Prereqs: Node 20+, Rust stable (`~/.cargo/bin` on PATH), Xcode Command Line Tools (macOS).

```bash
npm install
npm run tauri:dev
```

## Build

```bash
npm run tauri:build
# .dmg lands in src-tauri/target/release/bundle/dmg/
```

## Stack

- Tauri v2 (Rust core, WKWebView UI on macOS)
- Vanilla TypeScript + Vite frontend
- Local JSON store in the OS app-data directory
- Cross-platform from day one — Windows port is incremental

## License

TBD (open-source per PRD).
