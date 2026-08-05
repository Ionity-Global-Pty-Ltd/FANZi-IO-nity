# Troubleshooting

## Application won't start

- Confirm you're running Windows 10/11 64-bit.
- Right-click the exe → **Run as administrator**.
- Check Windows Defender / antivirus quarantine — new independently published
  executables are sometimes flagged; restore/allow it if you trust the source.

## Fans/sensors not detected

- Ensure the app is running with **administrator privileges** — hardware access is
  blocked without elevation.
- Some motherboard vendor software (e.g., other fan control utilities) can lock
  sensor access. Close conflicting fan/RGB control apps and relaunch FANZi IO-nity.
- Update your motherboard chipset/EC drivers.

## RGB devices or Fan RGB not syncing / staying dark

- **Fan LEDs partially lit or dark?** Addressable 5V 3-pin ARGB fans (ASUS AURA ARGB, MSI JRAINBOW, Gigabyte D_LED) require channel resizing in the RGB tab:
  1. Select your motherboard / ARGB controller.
  2. Locate the channel for your header (e.g., `Addressable 1`).
  3. Change **LED Count** from the default (0–2) to match your physical fan setup (e.g. 3 fans × 12 LEDs = 36).
  4. Click **Apply / Save Profile**.
- **Conflicting vendor background services:** Close or disable proprietary RGB control background services that lock SMBus / I2C / USB controllers:
  - ASUS: Stop `LightingService.exe` (Armoury Crate / Aura Sync)
  - Corsair: Stop `iCUEService.exe` (iCUE)
  - MSI: Stop `MSICenterService.exe` (MSI Center / LightKeeper)
  - Gigabyte: Stop `RGBFusion.exe`
  - Razer: Stop `Razer Synapse Service.exe`
- **Orphaned helper processes / blocked port 6742:** Use the [`launcher/Launch-FanziIOnity.bat`](https://github.com/Ionity-Global-Pty-Ltd/FANZi-IO-nity/tree/main/launcher) companion script. The launcher automatically detects and terminates orphaned `OpenRGB.exe` processes before starting the app, preventing port 6742 socket collisions.
- **Direct Mode requirement:** Set the device mode to `Direct` if you want real-time AI thermal synchronization or color animation.

## Dedicated ARGB Fan Controllers (Corsair, Razer, Lian Li)

- **Corsair Commander Core / PRO:** Ensure iCUE service is stopped. OpenRGB will detect individual channel ports once SMBus/USB is unlocked.
- **Razer Chroma Addressable RGB Controller:** Supports up to 6 channels (up to 80 LEDs per channel, 120 total). Set channel counts per port in the RGB tab.
- **Lian Li Uni Hub (SL / AL / TL):** Set mode to `Direct` and ensure the USB motherboard header connection is active.

## App crashes / closes unexpectedly

- Crash reports are saved locally to
  `%APPDATA%\FANZI\crash-logs\crash_<timestamp>_<type>.log` — attach the relevant
  file(s) when reporting an issue.
- A known historical issue produces bursts of
  `UnobservedTaskException` / `SocketException (995)` crash logs referencing the
  OpenRGB SDK connection being aborted mid-session. If you see this pattern,
  restarting the app resolves it; please still report it with your crash logs so
  it can be tracked for a permanent fix.
- **Recommended:** run the app via the
  [resilient launcher](https://github.com/Ionity-Global-Pty-Ltd/FANZi-IO-nity/tree/main/launcher)
  instead of the exe directly — it automatically detects unexpected exits and
  restarts the app for you (bounded, so it won't crash-loop forever), and logs
  every event to `%APPDATA%\FANZI\launcher-logs\` for diagnosis.

## AI Thermal Intelligence seems inaccurate

- Allow a few days of normal usage in **Automatic (AI)** mode so the AEDi AI Engine
  can learn your system's thermal profile.
- Use **Reset to Defaults** (see [Configuration](Configuration)) if behavior seems stuck
  or incorrect, then let it relearn.

## High CPU/GPU usage from the app itself

- Increase the telemetry refresh interval in Monitoring Preferences
  (see [Configuration](Configuration)).

## Still stuck?

Open an [issue](https://github.com/Ionity-Global-Pty-Ltd/FANZi-IO-nity/issues/new/choose)
with your OS version, hardware, and steps to reproduce — or see [Support](Support).
