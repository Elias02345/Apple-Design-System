"use strict";
const ui = {
  byId(id) { return document.getElementById(id); },
  read(key, fallback) {
    try { return JSON.parse(localStorage.getItem("stillform." + key)) ?? fallback; }
    catch { return fallback; }
  },
  write(key, value) {
    try { localStorage.setItem("stillform." + key, JSON.stringify(value)); return true; }
    catch { return false; }
  },
  select(group, selected) {
    for (const button of group.querySelectorAll("button")) {
      button.setAttribute("aria-pressed", String(button === selected));
    }
  }
};
