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

## RGB devices not syncing

- Close other RGB control software (only one app can usually own a controller at a time
  — FANZi IO-nity's bundled OpenRGB engine competes with tools like Aura Sync,
  iCUE, Mystic Light, etc. for the same hardware).
- Reconnect the device and restart FANZi IO-nity — this restarts the bundled
  OpenRGB helper process (visible as a separate `OpenRGB.exe` process in Task Manager).
- No visible lighting change? Confirm ARGB fans/strips are physically connected to
  the motherboard's addressable header — onboard zones without connected ARGB
  hardware will only expose 1–2 LEDs and won't produce a visible effect.
- If a device isn't detected at all, confirm its RGB software (e.g. Aura Sync) isn't
  running and locking the controller, then restart FANZi IO-nity.

## App crashes / closes unexpectedly

- Crash reports are saved locally to
  `%APPDATA%\FANZI\crash-logs\crash_<timestamp>_<type>.log` — attach the relevant
  file(s) when reporting an issue.
- A known historical issue produces bursts of
  `UnobservedTaskException` / `SocketException (995)` crash logs referencing the
  OpenRGB SDK connection being aborted mid-session. If you see this pattern,
  restarting the app resolves it; please still report it with your crash logs so
  it can be tracked for a permanent fix.

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
