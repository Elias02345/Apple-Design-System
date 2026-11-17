"use strict";
const $=ui.byId;
const switcher=document.querySelector(".light-switch");
const frame=document.querySelector(".motion-frame");
for (const button of switcher.querySelectorAll("button")) button.onclick=()=>{
  const cool=button.dataset.light==="1";
  ui.select(switcher,button);
  switcher.classList.toggle("second",cool); frame.classList.toggle("cool",cool);
  $("light-sheet").classList.toggle("cool",cool);
  $("light-label").textContent=cool ? "Cool light" : "Warm light";
};
$("show-setup").onclick=()=>{
  const open=$("show-setup").getAttribute("aria-expanded")!=="true";
  $("show-setup").setAttribute("aria-expanded",String(open));
  $("setup").inert=!open; $("setup").classList.toggle("expanded",open);
};
$("enlarge").onclick=()=>{ $("sheet-label").textContent=$("light-label").textContent; $("light-sheet").showModal(); };
$("dismiss").onclick=()=>$("light-sheet").close();
