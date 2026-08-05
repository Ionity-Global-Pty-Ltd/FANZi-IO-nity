# FANZi IO-nity Launcher

A resilient launcher/updater for `Fanzi.FanControl.exe`, provided as a companion
tool alongside the main application (source-available, unlike the closed-source
app itself).

## Why use it?

The main application requires administrator rights for direct hardware access, and
historical crash logs on this project showed a bug where an unhandled
`SocketException` (OpenRGB SDK connection aborted) could bring the app down
repeatedly in quick succession. This launcher was built to make running the app
more resilient day-to-day:

- ✅ **Self-elevates** — no more manually right-click → Run as administrator.
- ✅ **Checks for updates** — compares your local exe's version against the
  latest [GitHub Release](https://github.com/Ionity-Global-Pty-Ltd/FANZi-IO-nity/releases)
  and downloads the newer build automatically (with an automatic `.bak` backup
  of the previous exe).
- ✅ **RGB Pre-flight Sanitization** — automatically terminates orphaned `OpenRGB.exe` helper processes before launch to clear locked SDK socket `127.0.0.1:6742`.
- ✅ **Vendor Service Conflict Detection** — scans for running vendor lighting background services (`LightingService`, `iCUE`, `MSICenter`, `RGBFusion`, `Razer Synapse`) that lock SMBus/I2C/USB controllers and cause fan RGB drops.
- ✅ **Auto-restarts on crash** — if the app exits unexpectedly, the launcher
  relaunches it automatically, bounded by a restart budget so a crash-loop bug
  can't spin forever or hammer your machine.
- ✅ **Logs everything** — every launch, update, crash, and restart is logged to
  `%APPDATA%\FANZI\launcher-logs\launcher_YYYYMMDD.log` for troubleshooting.
- ✅ **Won't double-launch** — detects if the app is already running and exits
  quietly instead of spawning a second instance.

## Usage

1. Place `Launch-FanziIOnity.ps1`, `Launch-FanziIOnity.bat`, and
   `Fanzi.FanControl.exe` in the same folder (or pass `-ExePath` to point
   elsewhere).
2. Double-click **`Launch-FanziIOnity.bat`** (recommended), or run the
   PowerShell script directly:

   ```powershell
   powershell -ExecutionPolicy Bypass -File .\Launch-FanziIOnity.ps1
   ```

3. Accept the UAC prompt — this is required for hardware/RGB/fan access, same
   as running the app directly.

## Parameters

| Parameter | Default | Description |
|---|---|---|
| `-ExePath` | `Fanzi.FanControl.exe` next to the script | Path to the app executable |
| `-NoUpdateCheck` | (off) | Skip the GitHub Releases update check |
| `-MaxRestarts` | `5` | Max automatic restarts allowed within the restart window |
| `-RestartWindowMinutes` | `10` | Rolling window (minutes) used to evaluate `-MaxRestarts` |
| `-GitHubRepo` | `Ionity-Global-Pty-Ltd/FANZi-IO-nity` | Repo used for the update check |

## Example: skip update checks, allow more restarts

```powershell
powershell -ExecutionPolicy Bypass -File .\Launch-FanziIOnity.ps1 -NoUpdateCheck -MaxRestarts 10
```

## Logs

View recent launcher activity:

```powershell
Get-Content "$env:APPDATA\FANZI\launcher-logs\launcher_$(Get-Date -Format yyyyMMdd).log" -Tail 50
```

Logs older than 30 days are pruned automatically.

## License

Distributed under the same [proprietary license](../LICENSE) as the rest of this
repository. © Ionity Global (Pty) Ltd.
