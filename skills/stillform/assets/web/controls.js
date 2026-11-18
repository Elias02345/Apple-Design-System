"use strict";
const $ = ui.byId;
let jobs = [];
let removed = null;
function renderQueue() {
  $("queue-empty").hidden = jobs.length > 0;
  $("queue").replaceChildren(...jobs.map(job => {
    const li=document.createElement("li");
    const copy=document.createElement("span");
    const title=document.createElement("strong"); title.textContent=job.name;
    const detail=document.createElement("small"); detail.textContent=job.stock + (job.duplex ? " · Two sides" : " · One side");
    copy.append(title,detail);
    const remove=document.createElement("button"); remove.textContent="Remove";
    remove.setAttribute("aria-label","Remove " + job.name);
    remove.onclick=() => {
      removed={job,index:jobs.indexOf(job)}; jobs.splice(removed.index,1); renderQueue();
      $("removed").textContent=job.name + " removed."; $("undo-bar").hidden=false;
      $("job-status").textContent="Print removed."; $("undo").focus();
    };
    li.append(copy,remove); return li;
  }));
}
function busy(active) {
  $("submit-job").disabled=active;
  $("job-name").readOnly=active;
  document.querySelector(".radio-group").disabled=active;
  $("duplex").disabled=active;
  $("submit-job").textContent=active ? "Queuing…" : "Queue print";
  $("progress").hidden=!active; $("cancel-job").hidden=!active;
  $("job").setAttribute("aria-busy",String(active));
}
function invalid(message) {
  $("job-error").hidden=!message; $("job-error").textContent=message;
  $("job-name").setAttribute("aria-invalid",String(Boolean(message)));
}
$("job-name").oninput=() => invalid("");
const request=Stillform.singleTask({
  busy,
  success(job) {
    jobs.push(job); renderQueue(); $("job-name").value=""; $("job-name").focus();
    $("job-status").textContent=job.name + " queued.";
  },
  failure() {
    $("job-status").textContent="Printer offline. Turn it on in Test printer connection, then queue again.";
    $("submit-job").focus();
  }
});
$("job").onsubmit=e => {
  e.preventDefault();
  const name=$("job-name").value.trim();
  if (!name) { invalid("Enter a title so you can identify this print."); $("job-name").focus(); return; }
  const job={name,stock:new FormData($("job")).get("stock"),duplex:$("duplex").checked};
  request.run(signal=>new Promise((resolve,reject)=>{
    $("job-status").textContent="Sending request to the sample printer."; $("cancel-job").focus();
    const timer=setTimeout(()=> {
      if ($("online").checked) resolve(job); else reject(Error("Printer offline"));
    },850);
    signal.addEventListener("abort",()=>{ clearTimeout(timer); reject(signal.reason); },{once:true});
  }));
};
$("cancel-job").onclick=() => { request.cancel(); $("submit-job").focus(); $("job-status").textContent="Request cancelled. Your entries are ready to edit."; };
$("undo").onclick=() => {
  if (!removed) return;
  const index=removed.index;
  jobs.splice(index,0,removed.job); removed=null; renderQueue(); $("undo-bar").hidden=true;
  $("job-status").textContent="Print restored to the queue."; $("queue").children[index].querySelector("button").focus();
};
renderQueue();
