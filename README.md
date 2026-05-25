# Pennoa

> Meeting reminders that respect your flow.

A small airplane drifts across your screen ten and five minutes before each meeting, trailing a banner with the meeting title. The plane floats above every application but cannot be clicked, dismissed, or interacted with. You keep working. It passes by.

Local-only. No accounts. No telemetry. macOS first; Windows port to follow.

## Status

Early scaffold. See `prd.md` for the v1 spec and `BRAND.md` for the brand foundation.

## Install

Grab the latest installer from [Releases](../../releases).

- **macOS** — `Pennoa_x.y.z_universal.dmg` (Apple Silicon + Intel)
- **Windows** — `Pennoa_x.y.z_x64-setup.exe` (NSIS) or `Pennoa_x.y.z_x64_en-US.msi`

### macOS: "Apple could not verify this app" warning

Pennoa is not yet signed with an Apple Developer ID, so Gatekeeper blocks the first launch with:

> Apple could not verify "Pennoa.app" is free of malware that may harm your Mac or compromise your privacy.

This is expected for unsigned indie apps. Pick one of:

1. **Right-click → Open** on `Pennoa.app` in `/Applications`, then confirm the prompt. Subsequent launches work normally.
2. **System Settings → Privacy & Security**, scroll down, click **Open Anyway** next to the Pennoa entry.
3. **Terminal** — strip the quarantine attribute:

   ```bash
   xattr -dr com.apple.quarantine /Applications/Pennoa.app
   ```

Proper code signing + notarization is on the roadmap (requires an Apple Developer Program membership).

### Windows: SmartScreen warning

Pennoa is not yet signed with an EV code-signing certificate, so SmartScreen may show **"Windows protected your PC"** on first run. Click **More info → Run anyway**.

## Develop

Prereqs (shared): [Bun](https://bun.sh) (latest), Rust stable (`~/.cargo/bin` on PATH).
- macOS: Xcode Command Line Tools.
- Windows: Visual Studio 2022 Build Tools (Desktop development with C++) and the WebView2 runtime (preinstalled on Win11; download from Microsoft on Win10).

```bash
bun install
bun run tauri:dev
```

## Build

### macOS

```bash
bun run tauri:build
# .dmg lands in src-tauri/target/release/bundle/dmg/
```

### Windows

```powershell
bun install
bun run tauri:build
# .msi  → src-tauri\target\release\bundle\msi\
# .exe  → src-tauri\target\release\bundle\nsis\
```

Cross-compiling macOS → Windows is **not** supported here (tauri-winres needs `llvm-rc`); build on a Windows host or via GitHub Actions on `windows-latest`.

## Releases (CI)

A GitHub Actions workflow at `.github/workflows/release.yml` runs on every push to `master` (also dispatchable manually). It builds on `macos-latest` (Universal Apple Silicon + Intel) and `windows-latest` in parallel via `tauri-apps/tauri-action`, then publishes a release tagged `vX.Y.Z` reading the version from `src-tauri/tauri.conf.json`. Subsequent pushes for the same version update the existing release's assets.

To cut a new release: bump the `version` field in `src-tauri/tauri.conf.json`, merge to `master`. The workflow uses `GITHUB_TOKEN` (no extra secrets needed) and requires `contents: write` permission, which is set in the workflow.

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
