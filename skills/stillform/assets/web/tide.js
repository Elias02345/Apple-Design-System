"use strict";
const $ = ui.byId;
let feet = false;
const stored = ui.read("tide.log", []);
let log = Array.isArray(stored) ? stored.filter(r => r && typeof r.station === "string" && Number.isInteger(r.hour) && Number.isFinite(r.value)) : [];
function level(hour, station) {
  const shift = station === "West pier" ? 2.3 : 0;
  return 1.8 + Math.sin((hour + shift) * Math.PI / 6.1) + .24 * Math.cos((hour + shift) * Math.PI / 4);
}
function format(value) { return (feet ? value * 3.28084 : value).toFixed(2) + (feet ? " ft" : " m"); }
function timeLabel(hour) { return String(hour).padStart(2, "0") + ":00"; }
function xy(hour, station) { return [8 + hour / 23 * 944, 192 - level(hour,station) * 55]; }
function renderChart() {
  const station = $("station").value;
  const hour = Number($("hour").value);
  const value = level(hour,station);
  const points = Array.from({length:139}, (_,i) => xy(i/6,station).join(" "));
  const path = "M" + points.join(" L");
  const [x,y] = xy(hour,station);
  $("curve").setAttribute("d",path);
  $("fill").setAttribute("d",path + " L952 200 L8 200Z");
  $("cursor").setAttribute("d","M" + x + " 0V200");
  $("point").setAttribute("cx",x); $("point").setAttribute("cy",y);
  $("height").textContent = format(value);
  $("direction").textContent = level(hour+.01,station)>value ? "Rising" : "Falling";
  $("clock").textContent = timeLabel(hour);
  $("hour").setAttribute("aria-valuetext",timeLabel(hour) + ", " + format(value));
  $("station-title").textContent = station;
  $("plot-title").textContent = station + " modelled water level. Hourly values appear in the data table.";
}
function renderTable() {
  $("table-caption").textContent = $("station").value + " · " + (feet ? "feet" : "metres");
  $("hours").replaceChildren(...Array.from({length:24}, (_,h) => {
    const row = document.createElement("tr");
    const time = document.createElement("th"); time.scope="row"; time.textContent=timeLabel(h);
    const cell = document.createElement("td"); cell.textContent=format(level(h,$("station").value));
    row.append(time,cell); return row;
  }));
}
function renderLog() {
  $("log-empty").hidden = log.length > 0;
  $("log-list").replaceChildren(...log.map(r => {
    const li=document.createElement("li");
    li.textContent = r.station + " · " + timeLabel(r.hour) + " · " + format(r.value);
    return li;
  }));
}
function refresh() { renderChart(); renderTable(); renderLog(); }
$("station").onchange = refresh;
$("hour").oninput = renderChart;
Stillform.exclusiveButtons($("metres").parentElement, button => {
  feet = button.id === "feet"; refresh();
});
$("log").onclick = () => {
  const station = $("station").value, hour = Number($("hour").value);
  if (log.some(r=>r.station===station && r.hour===hour)) {
    $("log-state").textContent = "This reading is already in the log."; return;
  }
  log.unshift({station,hour,value:level(hour,station)});
  const durable = ui.write("tide.log",log);
  $("log-state").textContent = durable ? "Reading logged." : "Reading kept for this visit. Browser storage is unavailable.";
  renderLog();
};
refresh();
