# Features

## 🤖 AI Thermal Intelligence

FANZi IO-nity uses the **AEDi AI Engine** to learn your system's thermal behavior over
time and automatically adapt cooling responses — going beyond static fan curves to
predictive, self-tuning thermal management.

## 🌀 Smart Fan Control

- Custom fan curves per sensor and per fan header
- Automatic mode driven by AI thermal predictions
- Manual override mode for full user control
- Per-device profiles (CPU, GPU, case fans, AIO pumps)

## 🌈 RGB Lighting

- Powered by a bundled **OpenRGB** engine (runs as a background helper process,
  communicating with the main app over a local SDK connection)
- Detects motherboard ARGB (ASUS AURA ARGB, MSI JRAINBOW, Gigabyte D_LED), GPU, RAM, ARGB fan hubs (Corsair Commander, Razer Chroma, Lian Li Uni Hub), and supported controllers
- Multi-LED ARGB Fan Channel Sizing (customizable LED counts per header for 12–24 LED daisy-chained fans)
- Automatic pre-flight process isolation & vendor service conflict detection via the companion launcher
- Synchronize RGB lighting effects with live system state (temperature, load)
- Multiple lighting modes per device (Direct, Static, Breathing, Flashing,
  Spectrum Cycle, Rainbow, Chase Fade, Chase, and more — availability depends on
  the detected controller)
- Custom lighting profiles and presets
- Reactive effects tied to thermal or performance events

## 📊 System Health Monitoring

- Real-time CPU, GPU, motherboard, and storage telemetry
- Temperature, fan speed (RPM), voltage, and load monitoring
- At-a-glance system health dashboard

## ⚙️ AEDi AI Engine

The AEDi (Antwerp Ecosystem Designs Ionity) AI Engine is the intelligence layer behind
FANZi IO-nity's predictive automation — continuously analyzing telemetry to optimize
cooling and lighting behavior without manual tuning.

---

See [Configuration](Configuration) for how to set up curves, profiles, and monitoring
preferences.
