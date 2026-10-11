# Changelog

Version history for **FANZi IO-nity**. See also the
[Releases](https://github.com/Ionity-Global-Pty-Ltd/FANZi-IO-nity/releases) page for
downloadable builds.

## v4.0.1 (current, 2026-10-11)

- OpenRGB SDK reconnects reliably after Restart (instant port check, 60 s detection wait, orphaned OpenRGB instances stopped).
- No more RGB frame pile-up / thread-pool starvation; device queries time out after 10 s.
- Real-time dashboard: fixed 1 s cadence that never waits for slow panels; leaked process handles fixed.

## v4.0.0 (2026-10-11)

- **RGB Studio**: colourful effect / theme / swatch buttons, AI colour harmony, device cards with Identify.
- **AEDi Lighting AI**: describe-a-mood lighting, Smart Ambient, Thermal Guardian (default on), Night dimming, AEDi suggest.
- **Deep hardware scan**: RAM sticks, fan headers, motherboard, GPU, USB RGB vendors and PawnIO cross-checked against OpenRGB.
- **Overlay Studio**: every row switchable, RAM + network rows, 80–160 % size, 8 accents incl. RGB Sync, snap to corners; title-bar Overlay button.
- **One live heartbeat**: dashboard, Tasks, Network, Power and the overlay update together, in place — no more stutter.
- **Outlined tabs** with an accent-gradient selection.

## v3.0.0 (2026-10-11)

- Full-PC RGB on OpenRGB 1.0 (single-colour GPUs, RGB RAM, monitors), PawnIO installer, conflicting-software detection.

## Launcher v1.1.0 (2026-08-05)

- Added **Pre-flight RGB Process Sanitization** to clean orphaned `OpenRGB.exe` processes and free port `6742`.
- Added **Vendor Service Conflict Scanning** (`LightingService`, `iCUE`, `MSICenter`, `RGBFusion`, `Razer Synapse`).
- Added **ARGB Fan Channel Sizing** guide and documentation for multi-LED fan setups.

## v2.1.0

- AI Thermal Intelligence, Smart Fan Control, RGB Lighting & System Health Monitoring
- Powered by the AEDi (Antwerp Ecosystem Designs Ionity) AI Engine
- Build reference: `3d240445dffde758ba5c0382d4ffbe1d6b359592`

---

_This page is maintained alongside each release. Earlier version history predates the
public repository launch._
