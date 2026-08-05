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
   (motherboard AURA/RGB headers, GPU, RAM, ARGB fan hubs, peripherals, etc.) via the OpenRGB engine.
2. Select a connected RGB controller/device from the detected list.
3. **Configure ARGB Fan LED Counts (Crucial Step for Fan RGB):**
   - Motherboard ARGB 3-pin +5V headers (e.g. ASUS AURA ARGB, MSI JRAINBOW, Gigabyte D_LED) default to **0–2 LEDs** in generic hardware profiles.
   - Click **Resize Channel / LED Count** for your target header (e.g. `Addressable 1`) and set the total number of LEDs connected.
   - *Example:* If you have 3 daisy-chained ARGB fans with 12 LEDs each, set the header channel count to **36 LEDs**.
   - If left at 1–2 LEDs, only the first LED near the hub will illuminate while the rest of your fans remain unlit.
4. Choose a lighting **mode** (e.g. `Direct` for software-driven AI thermal sync, `Static`, `Breathing`, `Spectrum Cycle`, `Rainbow`, `Chase Fade`).
5. Optionally link the effect to a thermal threshold (e.g. transition from Cyan → Amber → Red as GPU/CPU temperature rises).
6. Save the profile — the selection is stored as `RgbState` on your active profile in `settings.json`.

> [!TIP]
> **Dedicated ARGB Hubs:** For Corsair Commander Core/PRO, Razer Chroma ARGB Hubs, or Lian Li Uni Hubs, ensure each individual channel/port is resized in the controller settings panel to match the physical fan LED specs.

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
