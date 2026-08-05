# Changelog

All notable changes to **FANZi IO-nity** are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

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
