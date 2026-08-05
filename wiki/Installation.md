# Installation

## System Requirements

- **OS:** Windows 10 (64-bit) or Windows 11
- **Architecture:** x64
- **Permissions:** Administrator privileges (required for hardware sensor & fan control access)
- **.NET Runtime:** Self-contained — no separate .NET install required

## Download

1. Go to the [Releases](https://github.com/Ionity-Global-Pty-Ltd/FANZi-IO-nity/releases) page.
2. Download the latest `Fanzi.FanControl.exe` asset (currently v2.1.0).

## Install & Run

1. Run `Fanzi.FanControl.exe`.
2. If prompted by **Windows SmartScreen**, choose **More info → Run anyway** (this is
   expected for new independently published applications).
3. Approve the **User Account Control (UAC)** prompt — administrator rights are needed
   for direct hardware/sensor access (fan controllers, RGB controllers, thermal sensors).
4. On first launch, FANZi IO-nity will scan your system for supported fan headers,
   sensors, and RGB controllers.

## Uninstalling

Close the application and delete the executable and any generated configuration/log
files from its working directory. FANZi IO-nity does not modify system files.

## Next Steps

- See [Features](Features) for what you can do with FANZi IO-nity.
- See [Configuration](Configuration) to set up fan curves, RGB profiles, and monitoring.
- Consider using the [resilient launcher](https://github.com/Ionity-Global-Pty-Ltd/FANZi-IO-nity/tree/main/launcher)
  instead of running the exe directly — it self-elevates, checks for updates, and
  auto-restarts the app if it crashes.
