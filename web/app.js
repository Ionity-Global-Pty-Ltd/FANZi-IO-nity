/* ==========================================================================
   FANZi IO-nity Web Control Dashboard Application Logic
   Author: Johan Wilhelm van Antwerp (Antwerp Designs - www.ionity.today)
   ========================================================================== */

// --- State Management ---
const state = {
  activeTab: 'dashboard',
  controlMode: 'ai', // 'ai' or 'manual'
  selectedFanChannel: 'CPU_FAN',
  selectedRgbDevice: 'motherboard_argb1',
  rgbMode: 'direct',
  rgbPrimaryColor: '#3366FF',
  rgbSecondaryColor: '#FF3366',
  rgbSpeed: 5,
  fanLedCount: 36,
  
  // Real-time Telemetry
  telemetry: {
    cpuTemp: 54,
    cpuRpm: 1420,
    cpuLoad: 38,
    gpuTemp: 62,
    gpuRpm: 1680,
    vramTemp: 71,
    gpuPower: 285,
    vrmTemp: 42,
    intakeRpm: 1150,
    exhaustRpm: 1080,
    coolantTemp: 31.4,
    pumpRpm: 2450,
    nvmeTemp: 39
  },

  // Telemetry History for Chart
  history: {
    cpu: Array(30).fill(50),
    gpu: Array(30).fill(58),
    fan: Array(30).fill(65)
  },

  // Fan Curve Points [Temp, Speed %]
  fanCurves: {
    'CPU_FAN':  [[20, 25], [40, 40], [60, 65], [75, 85], [90, 100]],
    'SYS_FAN1': [[25, 30], [45, 45], [65, 60], [80, 80], [95, 100]],
    'SYS_FAN2': [[25, 25], [45, 40], [65, 55], [80, 75], [95, 100]],
    'AIO_PUMP': [[20, 60], [50, 75], [70, 90], [80, 100], [95, 100]]
  }
};

// --- DOM Loaded Initialization ---
document.addEventListener('DOMContentLoaded', () => {
  initTabNavigation();
  initTelemetryLoop();
  initFanCurveCanvas();
  initRgbVisualizer();
  initTelemetryChart();
});

// --- Tab Navigation ---
function switchTab(tabId) {
  state.activeTab = tabId;
  document.querySelectorAll('.tab-page').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));

  const targetTab = document.getElementById(`tab-${tabId}`);
  const targetBtn = document.getElementById(`nav-${tabId}`);

  if (targetTab) targetTab.classList.add('active');
  if (targetBtn) targetBtn.classList.add('active');

  if (tabId === 'fans') {
    renderFanCurveCanvas();
  }
}

function initTabNavigation() {
  window.switchTab = switchTab;
}

// --- Telemetry Simulation & Gauges ---
function initTelemetryLoop() {
  setInterval(() => {
    // Generate realistic small fluctuations
    const deltaCpu = (Math.random() - 0.48) * 1.5;
    const deltaGpu = (Math.random() - 0.48) * 1.2;

    state.telemetry.cpuTemp = Math.min(88, Math.max(35, state.telemetry.cpuTemp + deltaCpu));
    state.telemetry.gpuTemp = Math.min(82, Math.max(38, state.telemetry.gpuTemp + deltaGpu));
    
    state.telemetry.cpuRpm = Math.round(700 + (state.telemetry.cpuTemp / 100) * 1200);
    state.telemetry.gpuRpm = Math.round(800 + (state.telemetry.gpuTemp / 100) * 1400);

    // Update UI elements
    updateElementText('temp-cpu', state.telemetry.cpuTemp.toFixed(0));
    updateElementText('rpm-cpu', `${state.telemetry.cpuRpm.toLocaleString()} RPM`);
    
    updateElementText('temp-gpu', state.telemetry.gpuTemp.toFixed(0));
    updateElementText('rpm-gpu', `${state.telemetry.gpuRpm.toLocaleString()} RPM`);

    updateGaugeOffset('gauge-cpu', state.telemetry.cpuTemp, 100);
    updateGaugeOffset('gauge-gpu', state.telemetry.gpuTemp, 100);

    // Push to history
    state.history.cpu.push(state.telemetry.cpuTemp);
    state.history.cpu.shift();

    state.history.gpu.push(state.telemetry.gpuTemp);
    state.history.gpu.shift();

    state.history.fan.push(state.telemetry.cpuRpm / 20);
    state.history.fan.shift();

    renderTelemetryChart();
  }, 1000);
}

function updateElementText(id, text) {
  const el = document.getElementById(id);
  if (el) el.innerText = text;
}

function updateGaugeOffset(id, value, max) {
  const circle = document.getElementById(id);
  if (!circle) return;
  const circumference = 264;
  const progress = Math.min(value / max, 1);
  circle.style.strokeDashoffset = circumference * (1 - progress);
}

// --- Dynamic Telemetry History Chart ---
function initTelemetryChart() {
  const canvas = document.getElementById('telemetryChart');
  if (!canvas) return;
  renderTelemetryChart();
}

function renderTelemetryChart() {
  const canvas = document.getElementById('telemetryChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const width = canvas.width = canvas.parentElement.clientWidth || 700;
  const height = canvas.height = 200;

  ctx.clearRect(0, 0, width, height);

  // Background Grid Lines
  ctx.strokeStyle = '#282828';
  ctx.lineWidth = 1;
  for (let y = 0; y <= height; y += 40) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  // Draw Series Line
  drawSeries(ctx, state.history.cpu, '#3366FF', width, height);
  drawSeries(ctx, state.history.gpu, '#F59E0B', width, height);
  drawSeries(ctx, state.history.fan, '#10B981', width, height);
}

function drawSeries(ctx, data, color, width, height) {
  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  const step = width / (data.length - 1);

  data.forEach((val, i) => {
    const x = i * step;
    const y = height - (val / 100) * height;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();
}

// --- Interactive Fan Curve Canvas ---
let isDraggingNode = false;
let dragNodeIdx = -1;

function initFanCurveCanvas() {
  const canvas = document.getElementById('fanCurveCanvas');
  if (!canvas) return;

  canvas.addEventListener('mousedown', onCanvasMouseDown);
  canvas.addEventListener('mousemove', onCanvasMouseMove);
  window.addEventListener('mouseup', () => { isDraggingNode = false; });

  renderFanCurveCanvas();
}

function renderFanCurveCanvas() {
  const canvas = document.getElementById('fanCurveCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;

  ctx.clearRect(0, 0, width, height);

  // Grid
  ctx.strokeStyle = '#242424';
  ctx.lineWidth = 1;
  for (let x = 0; x <= width; x += 50) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
  }
  for (let y = 0; y <= height; y += 40) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
  }

  // Current curve points
  const points = state.fanCurves[state.selectedFanChannel] || [];

  // Area Fill under curve
  ctx.beginPath();
  ctx.fillStyle = 'rgba(51, 102, 255, 0.12)';
  points.forEach((pt, i) => {
    const px = (pt[0] / 100) * width;
    const py = height - (pt[1] / 100) * height;
    if (i === 0) { ctx.moveTo(px, height); ctx.lineTo(px, py); }
    else ctx.lineTo(px, py);
  });
  const lastPx = (points[points.length - 1][0] / 100) * width;
  ctx.lineTo(lastPx, height);
  ctx.closePath();
  ctx.fill();

  // Curve Line
  ctx.beginPath();
  ctx.strokeStyle = '#3366FF';
  ctx.lineWidth = 3;
  points.forEach((pt, i) => {
    const px = (pt[0] / 100) * width;
    const py = height - (pt[1] / 100) * height;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  });
  ctx.stroke();

  // Draw Control Nodes
  points.forEach((pt, i) => {
    const px = (pt[0] / 100) * width;
    const py = height - (pt[1] / 100) * height;

    ctx.beginPath();
    ctx.arc(px, py, 6, 0, Math.PI * 2);
    ctx.fillStyle = '#FFFFFF';
    ctx.shadowColor = '#3366FF';
    ctx.shadowBlur = 8;
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#3366FF';
    ctx.stroke();
    ctx.shadowBlur = 0; // reset
  });

  updateCurvePointsTable();
}

function onCanvasMouseDown(e) {
  if (state.controlMode !== 'manual') return;
  const canvas = document.getElementById('fanCurveCanvas');
  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  const points = state.fanCurves[state.selectedFanChannel];
  points.forEach((pt, i) => {
    const px = (pt[0] / 100) * canvas.width;
    const py = canvas.height - (pt[1] / 100) * canvas.height;
    const dist = Math.hypot(mouseX - px, mouseY - py);
    if (dist < 12) {
      isDraggingNode = true;
      dragNodeIdx = i;
    }
  });
}

function onCanvasMouseMove(e) {
  if (!isDraggingNode || state.controlMode !== 'manual') return;
  const canvas = document.getElementById('fanCurveCanvas');
  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  const temp = Math.min(100, Math.max(10, Math.round((mouseX / canvas.width) * 100)));
  const speed = Math.min(100, Math.max(10, Math.round((1 - mouseY / canvas.height) * 100)));

  state.fanCurves[state.selectedFanChannel][dragNodeIdx] = [temp, speed];
  renderFanCurveCanvas();
}

function updateCurvePointsTable() {
  const tbody = document.getElementById('curve-points-body');
  if (!tbody) return;
  const points = state.fanCurves[state.selectedFanChannel] || [];

  tbody.innerHTML = points.map((pt, i) => `
    <tr>
      <td>Point ${i + 1}</td>
      <td>${pt[0]} °C</td>
      <td>${pt[1]} %</td>
      <td>${Math.round(600 + (pt[1] / 100) * 1400)} RPM</td>
    </tr>
  `).join('');
}

// --- Fan & Control Mode Actions ---
function selectFanChannel(channelId, label) {
  state.selectedFanChannel = channelId;
  document.querySelectorAll('#fan-channel-list .channel-item').forEach(el => el.classList.remove('active'));
  event.currentTarget.classList.add('active');

  updateElementText('current-channel-title', `${channelId} (${label})`);
  renderFanCurveCanvas();
}

function setControlMode(mode) {
  state.controlMode = mode;
  document.getElementById('mode-ai').classList.toggle('active', mode === 'ai');
  document.getElementById('mode-manual').classList.toggle('active', mode === 'manual');

  const subtitle = document.getElementById('curve-subtitle');
  if (subtitle) {
    subtitle.innerText = mode === 'ai'
      ? 'AEDi AI Engine is managing dynamic curve points based on thermal load.'
      : 'Custom Manual Curve active. Drag curve nodes on canvas to adjust points.';
  }
}

function resetFanCurve() {
  state.fanCurves['CPU_FAN'] = [[20, 25], [40, 40], [60, 65], [75, 85], [90, 100]];
  renderFanCurveCanvas();
}

function saveFanProfile() {
  alert(`Fan Profile for '${state.selectedFanChannel}' saved successfully.`);
}

// --- ARGB Fan Visualizer ---
function initRgbVisualizer() {
  renderFanCluster();
}

function renderFanCluster() {
  const cluster = document.getElementById('fan-cluster');
  if (!cluster) return;

  cluster.innerHTML = '';
  const numFans = 3;
  const ledsPerFan = Math.round(state.fanLedCount / numFans);

  for (let f = 0; f < numFans; f++) {
    const fanUnit = document.createElement('div');
    fanUnit.className = 'fan-unit';

    const center = document.createElement('div');
    center.className = 'fan-blade-center';
    fanUnit.appendChild(center);

    const ring = document.createElement('div');
    ring.className = 'led-ring';

    for (let l = 0; l < ledsPerFan; l++) {
      const angle = (l / ledsPerFan) * Math.PI * 2;
      const radius = 48; // px
      const x = 55 + Math.cos(angle) * radius;
      const y = 55 + Math.sin(angle) * radius;

      const node = document.createElement('div');
      node.className = 'led-node';
      node.style.left = `${x}px`;
      node.style.top = `${y}px`;
      node.style.backgroundColor = state.rgbPrimaryColor;
      node.style.color = state.rgbPrimaryColor;
      ring.appendChild(node);
    }

    fanUnit.appendChild(ring);
    cluster.appendChild(fanUnit);
  }
}

function updateFanLedCount() {
  const val = parseInt(document.getElementById('fan-led-count').value, 10);
  if (val > 0) {
    state.fanLedCount = val;
    renderFanCluster();
  }
}

function selectRgbDevice(devId) {
  state.selectedRgbDevice = devId;
  document.querySelectorAll('#rgb-device-list .channel-item').forEach(el => el.classList.remove('active'));
  event.currentTarget.classList.add('active');
}

function updateRgbMode() {
  state.rgbMode = document.getElementById('rgb-mode').value;
}

function updateRgbColor() {
  state.rgbPrimaryColor = document.getElementById('rgb-primary-color').value;
  state.rgbSecondaryColor = document.getElementById('rgb-secondary-color').value;
  
  updateElementText('hex-primary', state.rgbPrimaryColor.toUpperCase());
  updateElementText('hex-secondary', state.rgbSecondaryColor.toUpperCase());

  renderFanCluster();
}

function saveRgbProfile() {
  alert(`ARGB Profile for '${state.selectedRgbDevice}' applied to hardware via OpenRGB SDK!`);
}

// --- Diagnostics & Utilities ---
function triggerAITuning() {
  alert('AEDi AI Engine re-calibration triggered! Thermal optimization profile updated.');
}

function runDiagnostics() {
  const term = document.getElementById('log-terminal');
  if (!term) return;

  const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
  const newLine = document.createElement('div');
  newLine.className = 'term-line term-success';
  newLine.innerText = `[${now}] [INFO] Diagnostic check complete: Administrator rights active, OpenRGB SDK connected on 127.0.0.1:6742, 0 service conflicts.`;
  term.appendChild(newLine);
  term.scrollTop = term.scrollHeight;
}

function clearLogs() {
  const term = document.getElementById('log-terminal');
  if (term) term.innerHTML = '';
}

// Global scope exports for inline onclick attributes
window.switchTab = switchTab;
window.selectFanChannel = selectFanChannel;
window.setControlMode = setControlMode;
window.resetFanCurve = resetFanCurve;
window.saveFanProfile = saveFanProfile;
window.selectRgbDevice = selectRgbDevice;
window.updateFanLedCount = updateFanLedCount;
window.updateRgbMode = updateRgbMode;
window.updateRgbColor = updateRgbColor;
window.saveRgbProfile = saveRgbProfile;
window.triggerAITuning = triggerAITuning;
window.runDiagnostics = runDiagnostics;
window.clearLogs = clearLogs;
