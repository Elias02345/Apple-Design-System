"use strict";
const $=ui.byId;
const switcher=document.querySelector(".light-switch");
const frame=document.querySelector(".motion-frame");
Stillform.exclusiveButtons(switcher,button=>{
  const cool=button.dataset.light==="1";
  switcher.classList.toggle("second",cool); frame.classList.toggle("cool",cool);
  $("light-sheet").classList.toggle("cool",cool);
  $("light-label").textContent=cool ? "Cool light" : "Warm light";
});
Stillform.disclosure($("show-setup"),$("setup"));
$("enlarge").onclick=()=>{ $("sheet-label").textContent=$("light-label").textContent; $("light-sheet").showModal(); };
$("dismiss").onclick=()=>$("light-sheet").close();
$("light-sheet").addEventListener("close",()=>$("enlarge").focus());
