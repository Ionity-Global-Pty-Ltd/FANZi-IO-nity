# Changelog

All notable changes to **FANZi IO-nity** are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [4.0.1] - 2026-10-11

### Fixed
- **OpenRGB SDK never reconnected after "Restart OpenRGB".** OpenRGB opens its SDK port only after hardware detection
  (30 s+ with PawnIO SMBus scans), but FANZi gave up after 18 s, and its port probe waited on a thread-pool thread that
  was busy — so it kept reporting "not listening" while the server was up. The probe now reads the Windows TCP listener
  table (instant, no connection, no thread pool); start-up waits up to 60 s for the port; Restart stops every OpenRGB
  instance, relaunches and reconnects.
- **Orphaned OpenRGB instances.** A second OpenRGB left behind by an older FANZi (or one whose port bind failed) kept
  holding the SMBus / USB devices. FANZi now stops every OpenRGB process except the one serving the SDK port.
- **RGB frames piling up.** A new hardware frame was queued every 100 ms even while OpenRGB was slow; the queued writes
  blocked on the service lock and starved the thread pool, which lagged the whole app. Now one frame is in flight at most,
  a busy service drops the frame, and a device query that OpenRGB never answers is abandoned after 10 s.
- **Laggy dashboard.** The dashboard waited for the slowest panel (process list, power) before showing new sensor
  values. It now never waits: finished panel data is applied in the same pass, unfinished data on the next tick.
  Polling runs on a fixed **1 s** cadence (installs on the old 3 s default are moved to 1 s; a value you chose is kept),
  the process list refreshes every 2 s, power every 3 s, and the game-process scan every 5 s.
- Process handles leaked by the game detector and the network panel are released every sample.

## [4.0.0] - 2026-10-11

### Overview
RGB Studio, Overlay Studio and one live heartbeat for the whole app. Built and verified on the same rig as 3.0
(MAXSUN MS-iCraft X870M, 2 × Patriot DDR5 RGB (ENE DRAM), ZOTAC RTX 3080 AMP Holo, ViewSonic XG270QG).

### Added
- **RGB Studio (RGB tab redesign).** Rotating rainbow hero orb, RGB-outlined cards, and buttons painted in their own colours:
  effect chips (Static, Breathe, Rainbow, Wave, Thermal, CPU load, Performance, Strobe, Dual flash), theme pills drawn with
  each theme's colours, 16 one-click colour swatches, R/G/B sliders in their channel colour and a Swap button.
- **AEDi Lighting AI** (runs offline, no cloud):
  - *Describe a mood* — type "calm ocean", "red galaxy", "fast cyberpunk party", "south africa"… and AEDi builds the effect,
    colours, speed and brightness (27 scenes, 23 colour words, speed / brightness / static modifiers; unknown words get a stable unique palette).
  - *Smart Ambient* — idle → calm breathing, busy → load-paced, game detected → performance, hot → temperature colours.
  - *Thermal Guardian* (on by default) — CPU ≥ 92 °C or GPU ≥ 86 °C turns every device into a red/amber alert until it has cooled 6 °C.
  - *Night dimming* — 22:00–06:30 brightness capped at 35 %.
  - *AEDi suggest* — picks a theme from time of day, load, temperature and game mode.
  - *AI colour harmony* — Complementary, Analogous, Triadic, Split and Monochrome partners for the primary colour.
- **Deep hardware scan.** Cross-checks OpenRGB against Windows: installed DIMMs vs RGB RAM controllers, fan headers that report
  RPM vs fan/ARGB controllers, the motherboard, GPUs, USB devices from 30 RGB vendors and the PawnIO driver — and explains every
  gap (e.g. fan LEDs on a board OpenRGB has no driver for stay on the BIOS effect).
- **Device cards** with type icons (RAM, GPU, Monitor, …), numbered identical sticks ("ENE DRAM · stick 1/2"), live colour strip
  and an **Identify** button that flashes one device white.
- **Overlay Studio.** Show/hide every overlay row (CPU / GPU gauges, CPU history, fan, CPU load, GPU load, **RAM**, **network ↓/↑**,
  health, clock), size 80–160 %, 8 accent presets including **RGB Sync** (follows the live lighting), snap to any screen corner,
  reset. Available in Settings and in the overlay's right-click menu.
- **Overlay button in the title bar** (▣ Overlay, lit while the overlay is open) next to Ctrl+O and the tray menu.

### Fixed
- **Overlay reliability.** The overlay sizes itself to its content, is clamped back onto a visible screen every time it is shown
  (unplugged monitor / resolution change), re-asserts always-on-top, and any failure is logged and shown instead of "nothing happens".
- **Stuttering lists.** Tasks, Network and Power rebuilt their lists with Clear()+Add() on three separate timers (2 s / 2 s / 3 s),
  so rows flashed, scroll position jumped and nothing matched the dashboard. All panels now update **in place** (keyed diff) and on
  **one shared heartbeat** with the dashboard: data is collected in parallel with the sensor poll and applied in the same UI pass.
- The RGB device list no longer flashes on every 15 s watchdog refresh.
- **Upgrading while FANZi runs.** Starting v4 while an older FANZi sits in the tray used to bring the old window back. The newer
  build now asks older instances to exit (v4+ shut down cleanly, restoring automatic fan control) and replaces them.

### Changed
- **Outlined tabs**: every tab has a rounded outline; the selected tab gets the accent-gradient outline and a soft glow.
- Version 4.0.0 everywhere (app, installer, Inno script, READMEs, wiki). 569 unit tests + 3 render suites pass.

## [3.0.0] - 2026-10-11

### Overview
RGB control now reaches every OpenRGB-supported device in the PC, including single-colour GPUs, RGB RAM and monitors.
Verified on real hardware: ZOTAC RTX 3080 AMP Holo, two Patriot DDR5 sticks (ENE DRAM) and a ViewSonic XG270QG.

### Fixed
- **GPU and other mode changes never applied.** OpenRGB.NET 3.1.1 sends direction `0xFFFFFFFF` for modes without a direction, and OpenRGB 1.0 silently rejects those mode packets. Devices stayed in their own effect, and single-colour GPUs never changed colour. FANZi now sends mode changes itself with a correct packet (`OpenRgbModeWriter`) and reads every device back to confirm the change.
- **Single-colour devices** with no per-LED mode, such as ZOTAC RTX 30 GPUs, are now driven through their Static mode colour, at most every 120 ms and only when the colour changes. A mode named "Static" whose colours are mode-specific is no longer mistaken for per-LED.
- A device reporting **0 LEDs** (a RAM stick OpenRGB could not read) no longer drops the OpenRGB connection in a loop. It is listed with "No LEDs reported".
- The in-app **update check** now uses this repository. The 140 MB download streams to a `.part` file with a size check instead of hitting a 15 s timeout, and version strings like "2.1", "v2.1.1" and "2.1.1+commit" compare correctly. A title-bar badge appears when an update is available.
- **OpenRGB errors are visible.** LED write failures are logged and shown as "Connection lost" instead of being dropped silently. Shutdown waits at most 2 s for OpenRGB.

### Added
- FANZi runs OpenRGB with its own config folder (`%LOCALAPPDATA%\FANZI\OpenRGB\config`) with `Server → legacy_workaround` on. It also enables that flag in your own OpenRGB config, keeping a backup. A server that still refuses mode changes is restarted once automatically.
- **Install PawnIO** button: downloads the signed PawnIO driver from github.com/namazso, verifies the signature with WinVerifyTrust and installs it silently. RAM and motherboard RGB need this driver.
- **Conflicting RGB software** warning: SignalRGB, iCUE, Armoury Crate / Aura, MSI Center, RGB Fusion, Razer Synapse, NZXT CAM, G HUB, L-Connect, ZOTAC FireStorm / Spectra and ASRock Polychrome are detected, and a **Close them** button closes them.
- Each device row shows how it is controlled: "Per-LED · Direct", "Single colour · Static" or "Effects only".
- An opt-in hardware test sets every device to red, green and blue and reads the result back from OpenRGB. 527 unit tests pass.

### Includes v2.2.0
Thermal history charts, the interactive fan-curve editor, the sensor heatmap, themed alerts, animated numbers with a Reduce-motion setting, keyboard shortcuts and accessibility improvements.

## [2.1.0] - 2026

### Overview
Current public release. AI Thermal Intelligence, Smart Fan Control, RGB Lighting &
System Health Monitoring, powered by the AEDi AI Engine.

### Notes
- Component: `Fanzi.FanControl`
- Build reference: `3d240445dffde758ba5c0382d4ffbe1d6b359592`

## [Launcher 1.1.0 & Web Studio] - 2026-08-05

### Added
- **Web Control Dashboard & Studio (`web/`):** Interactive browser control panel built with HTML, Vanilla CSS, and JavaScript featuring telemetry gauges, interactive canvas fan curve editing (AEDi AI Automatic vs Manual mode), ARGB Fan channel LED count simulator, and launcher pre-flight diagnostic monitoring. Strictly follows the `#1A1A1A` dark-mode theme, `#FFFFFF` text, `#3366FF` accent color palette, and 8-bit structured design system by Johan Wilhelm van Antwerp (Antwerp Designs — [www.ionity.today](https://www.ionity.today)).
- **`-WebDashboard` Launcher Switch:** Added `-WebDashboard` parameter to `launcher/Launch-FanziIOnity.ps1` to open the web control dashboard automatically on startup.

### Enhanced
- **Pre-flight RGB Process Sanitization:** Launcher now automatically detects and terminates orphaned `OpenRGB.exe` processes prior to launching `Fanzi.FanControl.exe`, clearing TCP port `6742` and eliminating `SocketException 995` connection deadlocks.
- **Vendor Service Conflict Detection:** Launcher actively scans for conflicting proprietary RGB background services (`LightingService`, `iCUEService`, `MSICenterService`, `RGBFusion`, `Razer Synapse Service`) that lock SMBus/I2C/USB fan controllers.
- **ARGB Fan Header Channel Sizing Documentation:** Added comprehensive setup guides in the wiki for multi-LED addressable ARGB fans (ASUS AURA ARGB, MSI JRAINBOW, Gigabyte D_LED, Corsair Commander, Razer Chroma Hubs).

## [Launcher 1.0.0] - 2026-08-05

### Added
- New [`launcher/`](launcher) companion tool (`Launch-FanziIOnity.ps1` /
  `Launch-FanziIOnity.bat`), source-available, distributed alongside the
  closed-source app:
  - Self-elevates to administrator (required for hardware/RGB/fan access)
  - Checks GitHub Releases for a newer build and self-updates the local exe
  - Supervises the running process and automatically restarts it on
    unexpected exit, bounded by a restart budget (default: 5 restarts / 10 min)
  - Logs all launch/update/crash/restart events to
    `%APPDATA%\FANZI\launcher-logs\`

### Fixed / Mitigated
- Verified and documented the RGB pipeline end-to-end (OpenRGB engine →
  ASUS AURA controller); confirmed color control works correctly.
- Mitigated the historical crash-loop pattern seen in local crash logs
  (`UnobservedTaskException` / `SocketException (995)` around the OpenRGB SDK
  connection, ~345 occurrences 2026-07-30 to 2026-08-01, none observed since)
  — the launcher's supervised restart now recovers automatically from this
  class of crash instead of leaving the app down.

---

_For detailed release notes and prior versions, see the [Wiki → Changelog](../../wiki/Changelog)
and the [Releases](../../releases) page._
