# Pennoa

> Meeting reminders that respect your flow.

A small airplane drifts across your screen ten and five minutes before each meeting, trailing a banner with the meeting title. The plane floats above every application but cannot be clicked, dismissed, or interacted with. You keep working. It passes by.

Local-only. No accounts. No telemetry. macOS first; Windows port to follow.

## Status

Early scaffold. See `prd.md` for the v1 spec and `BRAND.md` for the brand foundation.

## Develop

Prereqs (shared): Node 20+, Rust stable (`~/.cargo/bin` on PATH).
- macOS: Xcode Command Line Tools.
- Windows: Visual Studio 2022 Build Tools (Desktop development with C++) and the WebView2 runtime (preinstalled on Win11; download from Microsoft on Win10).

```bash
npm install
npm run tauri:dev
```

## Build

### macOS

```bash
npm run tauri:build
# .dmg lands in src-tauri/target/release/bundle/dmg/
```

### Windows

```powershell
npm install
npm run tauri:build
# .msi  → src-tauri\target\release\bundle\msi\
# .exe  → src-tauri\target\release\bundle\nsis\
```

Cross-compiling macOS → Windows is **not** supported here (tauri-winres needs `llvm-rc`); build on a Windows host or via GitHub Actions on `windows-latest`.

## Platform notes

- The Dock icon (macOS) is hidden via `ActivationPolicy::Accessory`; on Windows the taskbar entry is hidden via `skipTaskbar`. The tray icon is the entry point on both platforms.
- Reduce-motion respect: macOS reads `com.apple.universalaccess reduceMotionEnabled`; Windows reads `SPI_GETCLIENTAREAANIMATION`.
- Auto-start: handled by `tauri-plugin-autostart` (LaunchAgent on macOS, registry Run key on Windows).

## Stack

- Tauri v2 (Rust core, WKWebView UI on macOS)
- Vanilla TypeScript + Vite frontend
- Local JSON store in the OS app-data directory
- Cross-platform from day one — Windows port is incremental

## License

TBD (open-source per PRD).
