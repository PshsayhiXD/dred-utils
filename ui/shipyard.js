"use strict";

const MAX_FONT = 14;
const MIN_FONT = 10;

const fitTitle = el => {
  el.style.fontSize = MAX_FONT + "px";
  let size = MAX_FONT;
  while (size > MIN_FONT && el.scrollWidth > el.clientWidth) {
    size--;
    el.style.fontSize = size + "px";
  }
  if (el.scrollWidth > el.clientWidth) {
    el.title = el.textContent;
    return;
  }
  el.removeAttribute("title");
};
const apply = () => {
  document.querySelectorAll(".sy-title h3").forEach(fitTitle);
};
apply();
window.addEventListener("resize", apply);