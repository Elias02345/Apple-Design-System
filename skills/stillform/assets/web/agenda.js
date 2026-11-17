"use strict";
const $=ui.byId;
const firstDay="2026-06-18";
const examples=[
  {id:"paper",name:"Paper delivery",date:firstDay,time:"09:00",minutes:30},
  {id:"proof",name:"Proof review",date:firstDay,time:"11:00",minutes:60},
  {id:"press",name:"Press maintenance",date:firstDay,time:"14:30",minutes:90}
];
function minutes(time) { const [h,m]=time.split(":").map(Number); return h*60+m; }
function dateAtNoon(day) { return new Date(day+"T12:00:00"); }
function isoDay(date) {
  return [date.getFullYear(),String(date.getMonth()+1).padStart(2,"0"),String(date.getDate()).padStart(2,"0")].join("-");
}
function valid(e) {
  return e && typeof e.id==="string" && typeof e.name==="string" && e.name.trim() && /^\d{4}-\d{2}-\d{2}$/.test(e.date)
    && isoDay(dateAtNoon(e.date))===e.date && /^([01]\d|2[0-3]):[0-5]\d$/.test(e.time) && [30,60,90].includes(e.minutes);
}
const stored=ui.read("agenda.bookings",examples);
let bookings=Array.isArray(stored)?stored.filter(valid):examples.slice();
let original, draftID, origin;
$("day").value=firstDay;
function render() {
  const day=$("day").value;
  const list=bookings.filter(e=>e.date===day).sort((a,b)=>a.time.localeCompare(b.time));
  $("day-title").textContent=new Intl.DateTimeFormat(undefined,{weekday:"long",month:"long",day:"numeric",year:"numeric"}).format(dateAtNoon(day));
  $("day-count").textContent=list.length+" "+(list.length===1?"booking":"bookings");
  $("agenda-empty").hidden=list.length!==0;
  $("events").replaceChildren(...list.map(event=>{
    const item=document.createElement("li");
    const time=document.createElement("time"); time.dateTime=event.date+"T"+event.time; time.textContent=event.time;
    const copy=document.createElement("div"), name=document.createElement("strong"), length=document.createElement("small");
    name.textContent=event.name; length.textContent=event.minutes+" minutes"; copy.append(name,document.createElement("br"),length);
    const edit=document.createElement("button"); edit.textContent="Edit"; edit.dataset.id=event.id; edit.setAttribute("aria-label","Edit "+event.name);
    edit.onclick=()=>openEditor(event); item.append(time,copy,edit); return item;
  }));
}
function formData() {
  return {id:draftID,name:$("event-name").value,date:$("event-date").value,time:$("event-time").value,minutes:Number($("duration").value)};
}
function error(message,control) {
  $("event-error").textContent=message; $("event-error").hidden=!message;
  for (const id of ["event-name","event-date","event-time"]) $(id).removeAttribute("aria-invalid");
  if (control) {control.setAttribute("aria-invalid","true");control.focus();}
}
function openEditor(event) {
  origin=event?.id || null;
  draftID=event?.id || crypto.randomUUID();
  $("event-heading").textContent=event?"Edit booking":"New booking";
  $("event-name").value=event?.name || ""; $("event-date").value=event?.date || $("day").value;
  $("event-time").value=event?.time || "10:00"; $("duration").value=String(event?.minutes || 30);
  original=JSON.stringify(formData()); error("");
  $("discard").hidden=true; $("event-form").hidden=false;
  $("event-editor").setAttribute("aria-labelledby","event-heading");
  $("event-editor").showModal(); $("event-name").focus();
}
function cancel() {
  if (original===JSON.stringify(formData())) { $("event-editor").close(); return; }
  $("event-form").hidden=true; $("discard").hidden=false;
  $("event-editor").setAttribute("aria-labelledby","discard-title"); $("keep-editing").focus();
}
$("event-editor").oncancel=e=>{e.preventDefault(); if (!$("discard").hidden) $("keep-editing").click(); else cancel();};
$("keep-editing").onclick=()=>{
  $("discard").hidden=true; $("event-form").hidden=false;
  $("event-editor").setAttribute("aria-labelledby","event-heading"); $("event-name").focus();
};
$("discard-edit").onclick=()=>$("event-editor").close();
$("cancel-edit").onclick=cancel;
$("event-editor").onclose=()=>{
  const button=[...$("events").querySelectorAll("button")].find(b=>b.dataset.id===origin);
  (button || $("new-event")).focus();
};
$("event-form").oninput=()=>error("");
$("event-form").onsubmit=e=>{
  e.preventDefault(); const value=formData(); value.name=value.name.trim();
  if(!value.name) {error("Enter a name for this booking.",$("event-name"));return;}
  if(!$("event-date").validity.valid) {error("Choose a date.",$("event-date"));return;}
  if(!$("event-time").validity.valid) {error("Choose a start time.",$("event-time"));return;}
  const start=minutes(value.time), end=start+value.minutes;
  if(end>1440) {error("Choose a start time that finishes on the same day.",$("event-time"));return;}
  const collision=bookings.find(b=>b.id!==value.id && b.date===value.date && start<minutes(b.time)+b.minutes && end>minutes(b.time));
  if(collision) {error("This time overlaps "+collision.name+". Choose another time.",$("event-time"));return;}
  bookings=[...bookings.filter(b=>b.id!==value.id),value];
  const durable=ui.write("agenda.bookings",bookings);
  $("day").value=value.date; origin=value.id; render(); $("event-editor").close();
  $("agenda-state").textContent=durable?"Booking saved.":"Booking kept for this visit. Browser storage is unavailable.";
};
$("new-event").onclick=()=>openEditor(null);
$("day").onchange=()=>{if($("day").validity.valid) render();};
for(const [id,delta] of [["earlier",-1],["later",1]]) $(id).onclick=()=>{
  const day=dateAtNoon($("day").value || firstDay); day.setDate(day.getDate()+delta); $("day").value=isoDay(day); render();
};
render();
