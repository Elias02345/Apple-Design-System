"use strict";
const specimens = [
  { id:"P-014", name:"Ammonite", kind:"Fossil", image:"ammonite.webp", alt:"Amber chambers spiralling through limestone", description:"The cut face shows the internal divisions of a coiled shell. Follow the chamber walls from the small central whorl to the outer rim." },
  { id:"M-032", name:"Azurite", kind:"Mineral", image:"azurite.webp", alt:"Deep blue crystal blades surrounded by green mineral", description:"Blue crystal faces catch the light above a green matrix. Compare the sharp edges with the rounded clusters at their base." },
  { id:"B-008", name:"Fern impression", kind:"Botanical impression", image:"fern.webp", alt:"A delicate branching fern imprint in red stone", description:"Pairs of leaflets branch away from a single stem. Their repeated outline survives as a fine impression in the stone." }
];
const $ = ui.byId;
const savedData = ui.read("cabinet.saved", []);
const saved = new Set(Array.isArray(savedData) ? savedData : []);
const storedNotes = ui.read("cabinet.notes", {});
const notes = storedNotes && typeof storedNotes === "object" && !Array.isArray(storedNotes) ? storedNotes : {};
let savedOnly = false;
let selection;
let opener;
function row(record) {
  const button = document.createElement("button");
  button.className = "record";
  const thumbnail = document.createElement("img");
  thumbnail.src = record.image;
  thumbnail.alt = "";
  const title = document.createElement("strong");
  title.textContent = record.name;
  const classification = document.createElement("span");
  classification.textContent = record.kind;
  const accession = document.createElement("small");
  accession.textContent = record.id;
  const arrow = document.createElement("span");
  arrow.textContent = "↗";
  arrow.setAttribute("aria-hidden","true");
  button.append(thumbnail,title,classification,accession,arrow);
  button.dataset.record = record.id;
  button.addEventListener("click", () => openSpecimen(record, button));
  return button;
}
function render() {
  const query = $("search").value.trim().toLowerCase();
  const matches = specimens.filter(r => (!savedOnly || saved.has(r.id)) && [r.name,r.kind,r.id].some(s => s.toLowerCase().includes(query)));
  $("records").replaceChildren(...matches.map(row));
  $("count").textContent = matches.length + (matches.length === 1 ? " specimen" : " specimens");
  $("empty").hidden = matches.length > 0;
  const filtering = Boolean(query);
  $("empty").querySelector("h3").textContent = filtering ? "No matching specimens" : "Your shelf is empty";
  $("empty").querySelector("p").textContent = filtering ? "Try a name, material or accession number." : "Open a specimen and save it to collect it here.";
}
function bookmarkLabel() {
  $("bookmark").textContent = saved.has(selection.id) ? "Remove from saved" : "Save specimen";
}
function openSpecimen(record, trigger) {
  selection = record;
  opener = trigger;
  $("accession").textContent = record.kind + " / " + record.id;
  $("specimen-name").textContent = record.name;
  $("detail-image").src = record.image;
  $("detail-image").alt = record.alt;
  $("description").textContent = record.description;
  $("observation").value = typeof notes[record.id] === "string" ? notes[record.id] : "";
  $("note-state").textContent = "Notes are kept in this browser.";
  $("save-state").textContent = "";
  bookmarkLabel();
  $("specimen").showModal();
}
$("bookmark").onclick = () => {
  if (saved.has(selection.id)) saved.delete(selection.id); else saved.add(selection.id);
  const durable = ui.write("cabinet.saved", [...saved]);
  bookmarkLabel();
  $("save-state").textContent = durable ? (saved.has(selection.id) ? "Added to your shelf." : "Removed from your shelf.") : "Shelf updated for this visit. Browser storage is unavailable.";
};
$("observation").oninput = () => {
  notes[selection.id] = $("observation").value;
  $("note-state").textContent = ui.write("cabinet.notes", notes) ? "Note saved in this browser." : "Note kept for this visit. Browser storage is unavailable.";
};
$("specimen").addEventListener("close", () => {
  render();
  const next = opener === $("open-feature") ? opener : document.querySelector('[data-record="' + selection.id + '"]');
  (next || $("saved")).focus();
});
$("close-specimen").onclick = () => $("specimen").close();
$("open-feature").onclick = () => openSpecimen(specimens[0], $("open-feature"));
$("search").oninput = render;
function filter(onlySaved) {
  savedOnly = onlySaved;
  ui.select($("all").parentElement, onlySaved ? $("saved") : $("all"));
  render();
}
$("all").onclick = () => filter(false);
$("saved").onclick = () => filter(true);
$("reset").onclick = () => { $("search").value = ""; filter(false); $("search").focus(); };
render();
