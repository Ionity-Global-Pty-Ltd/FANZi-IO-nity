# Configuration

## Fan Curves

1. Open FANZi IO-nity and select a fan header/device from the dashboard.
2. Choose **Automatic (AI)** to let the AEDi AI Engine manage the curve, or
   **Manual** to define your own temperature → speed points.
3. Save the profile — it will persist across restarts.

## RGB Profiles

FANZi IO-nity's RGB lighting is powered by a bundled **OpenRGB** engine, launched
automatically as a background helper process alongside the main app and connected
over its local SDK server (`127.0.0.1:6742`). No RGB effect is applied until you
configure one — a fresh install starts with no active lighting profile.

1. Open the **RGB** tab. On launch, FANZi IO-nity scans all detected controllers
   (motherboard AURA/RGB headers, GPU, RAM, peripherals, etc.) via the OpenRGB engine.
2. Select a connected RGB controller/device from the detected list.
3. Choose a lighting **mode** (varies per device, e.g. `Direct`, `Static`, `Breathing`,
   `Flashing`, `Spectrum Cycle`, `Rainbow`, `Chase Fade`, `Chase`) and a color.
4. Optionally link the effect to a thermal or performance threshold.
5. Save the profile — the selection is stored as `RgbState` on your active profile
   in `settings.json` (see [Troubleshooting](Troubleshooting) for the file location).

> **Note:** a motherboard's onboard AURA/RGB zone will report only a handful of LEDs
> (sometimes just 1–2) until addressable ARGB fans or LED strips are physically
> connected to its `Addressable` headers. If nothing visibly lights up, first check
> that ARGB hardware is actually plugged into the header the effect targets.

## Monitoring Preferences

- Choose which sensors appear on the main dashboard.
- Set alert thresholds for temperature, fan failure, or abnormal load.
- Configure how often telemetry refreshes.

## AI Learning Mode

FANZi IO-nity's AI Thermal Intelligence improves over time. Leave **Automatic (AI)**
mode enabled for a few days of normal use so the AEDi AI Engine can learn your
system's thermal patterns before fine-tuning further.

## Backup & Reset

- Profiles are stored locally in the application's working directory.
- Use **Reset to Defaults** in Settings to restore factory fan curves and lighting.

---

Having issues? See [Troubleshooting](Troubleshooting) or the [FAQ](FAQ).
