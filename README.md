# FANZi IO-nity

<p align="center">
  <img src="assets/fanzi-icon.png" alt="FANZi IO-nity" width="96" height="96" />
</p>

<p align="center">
  <strong>AI Thermal Intelligence, Smart Fan Control, RGB Lighting &amp; System Health Monitoring</strong><br/>
  Powered by the AEDi (Antwerp Ecosystem Designs Ionity) AI Engine
</p>

<p align="center">
  <img alt="Version" src="https://img.shields.io/badge/version-4.4.0-blue" />
  <img alt="Platform" src="https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-0078D6" />
  <img alt="License" src="https://img.shields.io/badge/license-Proprietary-red" />
  <img alt="Status" src="https://img.shields.io/badge/status-active-brightgreen" />
</p>

---

## About

**FANZi IO-nity** (internally `Fanzi.FanControl`) is a desktop application (Windows, macOS, Linux) by
**Ionity Global (Pty) Ltd** that brings AI-driven thermal intelligence to your PC — combining
smart fan curve automation, RGB lighting sync, and full system health monitoring in one app.

| | |
|---|---|
| **Product** | FANZi IO-nity |
| **Component** | Fanzi.FanControl |
| **Version** | 4.4.0 |
| **Platform** | Windows 10 / 11 (x64) · macOS 12+ (Apple silicon, Intel) · Linux (x64, arm64) |
| **Publisher** | Ionity Global (Pty) Ltd |
| **License** | Proprietary — All Rights Reserved |
| **Copyright** | © 2018–2026 Ionity Global (Pty) Ltd. All Rights Reserved. |

## Features

- 🤖 **AI Thermal Intelligence** — adaptive learning of thermal behavior to optimize cooling automatically
- 🌀 **Smart Fan Control** — custom fan curves per sensor, per device, with automatic and manual modes
- 🌈 **RGB Lighting & ARGB Studio** — synchronize lighting effects with system state and thermal load, featuring customizable multi-LED ARGB fan channel sizing
- 💻 **Web Control Dashboard** — state-of-the-art browser control panel for live telemetry, interactive canvas fan curve editing, and ARGB fan simulations
- 📊 **System Health Monitoring** — live CPU, GPU, motherboard and storage telemetry
- ⚙️ Powered by the **AEDi AI Engine** by Johan Wilhelm van Antwerp (Antwerp Designs — [www.ionity.today](https://www.ionity.today))

### New in 4.4.0

- **AEDi Cooling Fingerprint (new AI).** Learns the cooler's thermal resistance (°C per CPU watt, per fan-speed band, ambient
  independent) from normal use, tracks how it ages and forecasts *"clean the cooling in ~N days"*. Fans that spin ≥ 15 % slower
  at the same duty are flagged for bearing wear or a blockage. Local only (`%APPDATA%\FANZI\ai`).
- **AEDi Self-Doctor (auto-debugging).** Every 30 s FANZi checks sensors, fans, the RGB link, the MAXSUN Sync service, memory,
  responsiveness and its error log, repairs what it safely can, and saves a redacted diagnostics bundle on error storms.
- **RAM through MAXSUN Sync** (ENE HAL) on MAXSUN boards - OpenRGB keeps off the DRAM SMBus controllers.
- **Use BIOS fan settings** (default on): motherboard headers follow the BIOS Smart Fan curve.
- **Installer upgrades in place**: closes the running FANZi, keeps folder, settings, profiles and AEDi data.

### New in 4.3.3
- **RAM drives through SMBus port 0.** When both PIIX4 ports read the sticks correctly, FANZi now picks port 0 - the port a
  clean OpenRGB detection registers the DIMM controllers on. 4.3.2 picked port 1, which did not reach Patriot DDR5 RGB in
  A2 / B2 (ENE 0x71 / 0x73) on the MAXSUN X870M. Sticks still frozen after an older version: shut down, PSU off 30 s, start again.

### New in 4.3.2
- **RAM lighting fixed.** OpenRGB on AMD boards lists each ENE DRAM stick on *two* SMBus host ports; writing through
  both corrupted the controller until a power-cycle. 4.3 drives one entry per stick, rate-limits SMBus writes and adds
  **Re-sync RAM** plus an SMBus port override to the RGB tab.
- **Typing FX** — keystrokes become light: Ripple, Pulse, Line, Area, Fireworks, Typewriter, Matrix rain, Typing heat,
  on the keyboard where you hit the key and across RAM, GPU, strips and mouse. Only key codes are polled; nothing is logged.
- **Bench tab** — a repeatable all-core cooling benchmark with a 0–100 score, verdict, before/after comparison and CSV export.
- Windows installer + portable, macOS .dmg / .zip and Linux AppImage / .deb / .tar.gz in one release.

## Installation

1. Go to the [Releases](../../releases) page.
2. Windows: download `FANZi-IO-nity-v4.4.0-Installer-win-x64.zip` (run `FANZI-Installer.exe` as Administrator - it upgrades an existing install in place) or the portable `.exe`.
   macOS: `-macOS-arm64.dmg` (Apple silicon) / `-macOS-x64.dmg` (Intel) — right-click → Open the first time (not notarised yet).
   Linux: `-x86_64.AppImage`, `-amd64.deb` / `-arm64.deb` or the `.tar.gz`.
3. Verify against `SHA256SUMS.txt`.

> See the [Wiki → Installation](../../wiki/Installation) page for full setup instructions,
> requirements, and troubleshooting steps.

### Recommended: use the launcher

The [`launcher/`](launcher) folder provides `Launch-FanziIOnity.ps1` /
`Launch-FanziIOnity.bat` — a resilient, source-available companion launcher that:

- Self-elevates (no manual "Run as administrator")
- Performs pre-flight OpenRGB process sanitization (kills orphaned `OpenRGB.exe` processes to clear TCP port 6742)
- Scans for conflicting vendor background services (`LightingService`, `iCUE`, `MSICenter`, `RGBFusion`, `Razer Synapse`)
- Automatically checks GitHub Releases and updates your local exe when a newer build is published
- Auto-restarts the app if it crashes unexpectedly, with a bounded retry budget
- Logs every launch/update/crash/restart for troubleshooting

See [`launcher/README.md`](launcher/README.md) for full usage.

## Documentation

Full documentation lives in the project **[Wiki](../../wiki)**:

- [Home](../../wiki/Home)
- [Installation](../../wiki/Installation)
- [Features](../../wiki/Features)
- [Configuration](../../wiki/Configuration)
- [FAQ](../../wiki/FAQ)
- [Troubleshooting](../../wiki/Troubleshooting)
- [Changelog](../../wiki/Changelog)
- [Support](../../wiki/Support)

## Repository structure

```
FANZi-IO-nity/
├── .github/              # Issue templates & workflows (incl. wiki auto-sync)
├── assets/                # Branding assets (icons, images)
├── docs/                  # Additional project documentation
├── launcher/              # Resilient launcher/updater companion tool (source-available)
├── wiki/                  # Source markdown for the GitHub Wiki (auto-synced on push)
├── CHANGELOG.md           # Version history
├── LICENSE                # Proprietary license terms
└── README.md              # This file
```

Wiki content is authored in [`wiki/`](wiki) and automatically published to the
repository [Wiki](../../wiki) by the `.github/workflows/wiki-sync.yml` workflow
whenever it changes on `main`.

The application binary itself is distributed via [GitHub Releases](../../releases) rather than
committed to source control (it exceeds GitHub's file size limits for regular commits).

## Support

For support, questions, or bug reports, please open an
[issue](../../issues/new/choose) or see the [Wiki → Support](../../wiki/Support) page.

## License

Copyright © 2018–2026 **Ionity Global (Pty) Ltd**. All Rights Reserved.
See [LICENSE](LICENSE) for full terms.
