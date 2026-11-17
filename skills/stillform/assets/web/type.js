"use strict";
const $ = ui.byId;
const families = {serif:"Serif",sans:"Sans serif",mono:"Monospace"};
function valid(value) {
  return value && typeof value.text === "string" && value.text.trim() && Object.hasOwn(families,value.family)
    && Number.isFinite(value.scale) && value.scale >= 2 && value.scale <= 8 && typeof value.italic === "boolean";
}
let saved = ui.read("type.proof",null);
if (!valid(saved)) saved = null;
function current() {
  return {text:$("words").value,family:$("family").value,scale:Number($("scale").value),italic:$("italic").checked};
}
function redraw() {
  const v=current();
  $("proof-title").textContent = v.text.trim() || "Your text";
  $("proof-title").style.fontFamily = "var(--" + v.family + ")";
  $("proof-title").style.setProperty("--size",v.scale + "rem");
  $("proof-title").style.fontStyle = v.italic ? "italic" : "normal";
  $("proof-family").textContent = families[v.family];
  $("scale-value").textContent = v.scale + " rem";
  $("proof-meta").textContent = v.scale + " rem / " + (v.italic ? "Italic" : "Roman");
  $("restore").disabled = !saved || JSON.stringify(v) === JSON.stringify(saved);
}
function restore() {
  if (saved) {
    $("words").value=saved.text; $("family").value=saved.family;
    $("scale").value=saved.scale; $("italic").checked=saved.italic;
  }
  redraw();
}
$("compose").oninput = () => { $("words").setCustomValidity(""); redraw(); $("proof-status").textContent = "Unsaved changes."; };
$("compose").onsubmit = e => {
  e.preventDefault();
  if (!$("words").value.trim()) { $("words").setCustomValidity("Enter some text for the proof."); $("words").reportValidity(); return; }
  saved=current();
  $("proof-status").textContent = ui.write("type.proof",saved) ? "Proof saved in this browser." : "Proof kept for this visit. Browser storage is unavailable.";
  redraw();
};
$("restore").onclick = () => { restore(); $("words").setCustomValidity(""); $("proof-status").textContent = "Saved proof restored."; $("words").focus(); };
restore();
