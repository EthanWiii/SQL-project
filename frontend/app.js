const ASSETS = {
  NOVA: { name: "Nova Systems Ltd.", sector: "Technology", currency: "USD", base: 100, trend: 0.80, volume: 500000, color: "#0f7a55" },
  MAPL: { name: "Maple Bank Corp.", sector: "Financials", currency: "CAD", base: 75, trend: 0.25, volume: 250000, color: "#b7791f" },
  GRNE: { name: "Green Energy Inc.", sector: "Energy", currency: "USD", base: 48, trend: 0.45, volume: 100000, color: "#23896b" },
  AAPL: { name: "Apple Inc.", sector: "Technology", currency: "USD", base: 188, trend: 0.72, volume: 7200000, color: "#475569" },
  MSFT: { name: "Microsoft Corp.", sector: "Technology", currency: "USD", base: 414, trend: 1.15, volume: 5100000, color: "#2563eb" },
  NVDA: { name: "NVIDIA Corp.", sector: "Semiconductors", currency: "USD", base: 132, trend: 1.05, volume: 9800000, color: "#6d8f32" },
  AMZN: { name: "Amazon.com Inc.", sector: "Consumer", currency: "USD", base: 215, trend: 0.62, volume: 6400000, color: "#d97706" },
  JPM: { name: "JPMorgan Chase & Co.", sector: "Financials", currency: "USD", base: 238, trend: 0.48, volume: 3300000, color: "#1d4ed8" },
  XOM: { name: "Exxon Mobil Corp.", sector: "Energy", currency: "USD", base: 108, trend: 0.18, volume: 4400000, color: "#dc2626" },
  TSLA: { name: "Tesla Inc.", sector: "Automotive", currency: "USD", base: 356, trend: 1.30, volume: 8600000, color: "#b91c1c" }
};

const adjustments = [0, 1.2, -0.6, 0.9, -0.3];
const colors = { grid: "#dfe7e3", text: "#73827c", price: "#0f7a55", ma: "#e3a527", fill: "rgba(26, 159, 112, .12)" };
let selectedTicker = "NOVA";
let allData = {};
let chartPoints = [];

function tradingDates(count) {
  const dates = [];
  const current = new Date("2025-01-02T12:00:00");
  while (dates.length < count) {
    const day = current.getDay();
    if (day !== 0 && day !== 6) dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  return dates;
}

function createMarketData() {
  const dates = tradingDates(30);
  Object.entries(ASSETS).forEach(([ticker, asset]) => {
    allData[ticker] = dates.map((date, index) => {
      const close = asset.base + index * asset.trend + adjustments[index % 5];
      return {
        date,
        open: close - 0.4 + (index % 3) * 0.15,
        high: close + 1.1,
        low: close - 1.2,
        close,
        volume: 1000000 + index * 25000 + asset.volume
      };
    });
  });
}

function mean(values) { return values.reduce((sum, value) => sum + value, 0) / values.length; }
function sampleStd(values) {
  const avg = mean(values);
  return Math.sqrt(values.reduce((sum, value) => sum + (value - avg) ** 2, 0) / (values.length - 1));
}
function returns(data) { return data.slice(1).map((row, i) => row.close / data[i].close - 1); }
function maSeries(data, windowSize = 20) {
  return data.map((_, index) => index + 1 < windowSize ? null : mean(data.slice(index + 1 - windowSize, index + 1).map(row => row.close)));
}
function money(value, currency = "USD") {
  return new Intl.NumberFormat("en-CA", { style: "currency", currency, minimumFractionDigits: 2 }).format(value);
}
function percent(value, digits = 2, signed = true) {
  const sign = signed && value > 0 ? "+" : "";
  return `${sign}${value.toFixed(digits)}%`;
}
function shortVolume(value) { return `${(value / 1000000).toFixed(2)}M`; }
function dateLabel(date, long = false) {
  return long
    ? new Intl.DateTimeFormat("en-CA", { year: "numeric", month: "long", day: "numeric" }).format(date)
    : new Intl.DateTimeFormat("en-CA", { month: "short", day: "numeric" }).format(date);
}

function metrics(ticker) {
  const data = allData[ticker];
  const last = data.at(-1);
  const previous = data.at(-2);
  const dailyReturns = returns(data);
  const ma20 = mean(data.slice(-20).map(row => row.close));
  return {
    last,
    dailyChange: (last.close / previous.close - 1) * 100,
    cumulative: (last.close / data[0].close - 1) * 100,
    ma20,
    maDistance: (last.close / ma20 - 1) * 100,
    momentum: (last.close / data.at(-6).close - 1) * 100,
    volatility: sampleStd(dailyReturns.slice(-20)) * Math.sqrt(252) * 100,
    dailyReturns,
    avgReturn: mean(dailyReturns) * 100,
    avgVolume: mean(data.map(row => row.volume))
  };
}

function fillTickerSelect() {
  const select = document.querySelector("#tickerSelect");
  select.innerHTML = Object.entries(ASSETS).map(([ticker, asset]) => `<option value="${ticker}">${ticker} · ${asset.name}</option>`).join("");
  select.addEventListener("change", event => { selectedTicker = event.target.value; render(); });
}

function updateOverview() {
  const asset = ASSETS[selectedTicker];
  const stats = metrics(selectedTicker);
  const symbol = asset.currency === "CAD" ? "CA" : "";
  document.querySelector("#tickerBadge").textContent = selectedTicker[0];
  document.querySelector("#tickerBadge").style.background = asset.color;
  document.querySelector("#assetName").textContent = asset.name;
  document.querySelector("#assetTicker").textContent = selectedTicker;
  document.querySelector("#assetMeta").textContent = `${asset.sector} · ${asset.currency}`;
  document.querySelector("#latestPrice").textContent = `${symbol}${money(stats.last.close, asset.currency)}`;
  document.querySelector("#latestDate").textContent = dateLabel(stats.last.date, true);

  const change = document.querySelector("#dailyChange");
  change.textContent = percent(stats.dailyChange);
  change.className = `change-pill ${stats.dailyChange >= 0 ? "positive" : "negative"}`;
  document.querySelector("#cumulativeReturn").textContent = percent(stats.cumulative);
  document.querySelector("#ma20").textContent = `${symbol}${money(stats.ma20, asset.currency)}`;
  document.querySelector("#maDistance").textContent = `Price ${Math.abs(stats.maDistance).toFixed(2)}% ${stats.maDistance >= 0 ? "above" : "below"} average`;
  document.querySelector("#momentum").textContent = percent(stats.momentum);
  document.querySelector("#volatility").textContent = percent(stats.volatility, 2, false);
  document.querySelector("#avgReturn").textContent = `Average ${percent(stats.avgReturn)}`;
  document.querySelector("#avgVolume").textContent = `Average ${shortVolume(stats.avgVolume)}`;
}

function renderSnapshot() {
  document.querySelector("#snapshotList").innerHTML = Object.entries(ASSETS).map(([ticker, asset]) => {
    const stats = metrics(ticker);
    return `<div class="snapshot-item" data-ticker="${ticker}" role="button" tabindex="0">
      <span class="snapshot-symbol">${ticker.slice(0, 2)}</span>
      <div><strong>${ticker}</strong><small>${asset.sector}</small></div>
      <div class="snapshot-quote"><strong>${money(stats.last.close, asset.currency)}</strong><span class="${stats.dailyChange >= 0 ? "positive-text" : "negative-text"}">${percent(stats.dailyChange)}</span></div>
    </div>`;
  }).join("");

  document.querySelectorAll(".snapshot-item").forEach(item => {
    const choose = () => {
      selectedTicker = item.dataset.ticker;
      document.querySelector("#tickerSelect").value = selectedTicker;
      render();
      window.scrollTo({ top: 0, behavior: "smooth" });
    };
    item.addEventListener("click", choose);
    item.addEventListener("keydown", event => { if (event.key === "Enter" || event.key === " ") choose(); });
  });
}

function renderBars(containerId, values, type) {
  const container = document.querySelector(containerId);
  const max = Math.max(...values.map(Math.abs));
  container.innerHTML = type === "return" ? '<div class="bar-zero"></div>' : "";
  values.forEach((value, index) => {
    const slot = document.createElement("div");
    slot.className = "bar-slot";
    slot.title = type === "return" ? `${dateLabel(allData[selectedTicker][index + 1].date)}: ${percent(value * 100)}` : `${dateLabel(allData[selectedTicker][index].date)}: ${value.toLocaleString()}`;
    const bar = document.createElement("span");
    bar.className = `return-bar ${type === "return" ? (value >= 0 ? "up" : "down") : ""}`;
    const normalized = Math.max(3, Math.abs(value) / max * (type === "return" ? 48 : 100));
    bar.style.height = `${normalized}%`;
    slot.appendChild(bar);
    container.appendChild(slot);
  });
}

function renderTable(filter = "") {
  const asset = ASSETS[selectedTicker];
  const data = allData[selectedTicker];
  const needle = filter.trim().toLowerCase();
  document.querySelector("#priceTableBody").innerHTML = [...data].reverse().filter(row => {
    const iso = row.date.toISOString().slice(0, 10);
    return !needle || iso.includes(needle) || dateLabel(row.date, true).includes(needle);
  }).slice(0, 10).map(row => {
    const originalIndex = data.indexOf(row);
    const change = originalIndex ? (row.close / data[originalIndex - 1].close - 1) * 100 : 0;
    return `<tr>
      <td>${row.date.toISOString().slice(0, 10)}</td>
      <td>${money(row.open, asset.currency)}</td>
      <td>${money(row.high, asset.currency)}</td>
      <td>${money(row.low, asset.currency)}</td>
      <td><strong>${money(row.close, asset.currency)}</strong></td>
      <td class="return-cell ${change >= 0 ? "positive-text" : "negative-text"}">${percent(change)}</td>
      <td>${row.volume.toLocaleString()}</td>
    </tr>`;
  }).join("");
}

function chartPalette() {
  const styles = getComputedStyle(document.body);
  return {
    grid: styles.getPropertyValue("--line").trim(),
    text: styles.getPropertyValue("--muted").trim(),
    price: styles.getPropertyValue("--green").trim(),
    fill: document.body.classList.contains("dark") ? "rgba(65,209,156,.12)" : colors.fill,
    ma: colors.ma
  };
}

function drawPriceChart() {
  const canvas = document.querySelector("#priceChart");
  const rect = canvas.getBoundingClientRect();
  const ratio = window.devicePixelRatio || 1;
  canvas.width = rect.width * ratio;
  canvas.height = rect.height * ratio;
  const ctx = canvas.getContext("2d");
  ctx.scale(ratio, ratio);
  const width = rect.width;
  const height = rect.height;
  const pad = { top: 18, right: 50, bottom: 31, left: 18 };
  const data = allData[selectedTicker];
  const ma = maSeries(data);
  const values = [...data.map(row => row.close), ...ma.filter(Boolean)];
  const min = Math.min(...values) * 0.985;
  const max = Math.max(...values) * 1.015;
  const x = i => pad.left + i / (data.length - 1) * (width - pad.left - pad.right);
  const y = value => pad.top + (max - value) / (max - min) * (height - pad.top - pad.bottom);
  const palette = chartPalette();

  ctx.font = "10px Inter, sans-serif";
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  for (let i = 0; i < 5; i++) {
    const yy = pad.top + i / 4 * (height - pad.top - pad.bottom);
    const value = max - i / 4 * (max - min);
    ctx.strokeStyle = palette.grid;
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(pad.left, yy); ctx.lineTo(width - pad.right, yy); ctx.stroke();
    ctx.fillStyle = palette.text;
    ctx.fillText(value.toFixed(0), width - pad.right + 9, yy);
  }
  [0, 7, 14, 21, 29].forEach(i => {
    ctx.fillStyle = palette.text;
    ctx.textAlign = "center";
    ctx.fillText(dateLabel(data[i].date), x(i), height - 11);
  });

  const gradient = ctx.createLinearGradient(0, pad.top, 0, height - pad.bottom);
  gradient.addColorStop(0, palette.fill);
  gradient.addColorStop(1, "rgba(15,122,85,0)");
  ctx.beginPath();
  data.forEach((row, i) => i ? ctx.lineTo(x(i), y(row.close)) : ctx.moveTo(x(i), y(row.close)));
  ctx.lineTo(x(data.length - 1), height - pad.bottom);
  ctx.lineTo(x(0), height - pad.bottom);
  ctx.closePath(); ctx.fillStyle = gradient; ctx.fill();

  ctx.beginPath();
  data.forEach((row, i) => i ? ctx.lineTo(x(i), y(row.close)) : ctx.moveTo(x(i), y(row.close)));
  ctx.strokeStyle = palette.price; ctx.lineWidth = 2.25; ctx.lineJoin = "round"; ctx.stroke();

  ctx.beginPath();
  ma.forEach((value, i) => {
    if (value === null) return;
    if (i === 19) ctx.moveTo(x(i), y(value)); else ctx.lineTo(x(i), y(value));
  });
  ctx.strokeStyle = palette.ma; ctx.lineWidth = 1.7; ctx.setLineDash([5, 4]); ctx.stroke(); ctx.setLineDash([]);
  chartPoints = data.map((row, i) => ({ x: x(i), y: y(row.close), row, ma: ma[i] }));
}

function setupChartInteraction() {
  const canvas = document.querySelector("#priceChart");
  const tooltip = document.querySelector("#chartTooltip");
  canvas.addEventListener("mousemove", event => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const point = chartPoints.reduce((best, item) => Math.abs(item.x - mouseX) < Math.abs(best.x - mouseX) ? item : best, chartPoints[0]);
    tooltip.hidden = false;
    tooltip.style.left = `${point.x}px`;
    tooltip.style.top = `${point.y}px`;
    tooltip.innerHTML = `<strong>${dateLabel(point.row.date, true)}</strong><br>Close ${money(point.row.close, ASSETS[selectedTicker].currency)}${point.ma ? `<br>MA20 ${money(point.ma, ASSETS[selectedTicker].currency)}` : ""}`;
  });
  canvas.addEventListener("mouseleave", () => { tooltip.hidden = true; });
}

function render() {
  updateOverview();
  renderSnapshot();
  const data = allData[selectedTicker];
  renderBars("#returnChart", returns(data), "return");
  renderBars("#volumeChart", data.map(row => row.volume), "volume");
  renderTable(document.querySelector("#tableSearch").value);
  requestAnimationFrame(drawPriceChart);
}

createMarketData();
fillTickerSelect();
setupChartInteraction();
document.querySelector("#tableSearch").addEventListener("input", event => renderTable(event.target.value));
document.querySelector("#themeButton").addEventListener("click", () => {
  document.body.classList.toggle("dark");
  drawPriceChart();
});
window.addEventListener("resize", drawPriceChart);
render();
