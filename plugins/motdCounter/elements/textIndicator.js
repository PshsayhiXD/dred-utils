import { motd_edit } from "../../../utils/constants.js";
import { createElement, qs, are } from "../../../utils/elements/dom.js";

export const createMotdCounter = () => {
  const textarea = motd_edit();
  if (!are(textarea, HTMLTextAreaElement)) return null;
  const id = "motd-counter";
  const className = "motdCounter";
  let counter = qs(`#${id}`);
  if (!counter) counter = createElement("span", { id, className });
  else counter.className = className;
  const lerp = (a, b, v) => Math.round(a + (b - a) * v);
  const update = () => {
    const max = textarea.maxLength || 0;
    const cur = textarea.value.length;
    const t = max ? Math.min(cur / max, 1) : 0;
    const r = lerp(76, 244, t);
    const g = lerp(175, 67, t);
    const b = lerp(80, 54, t);
    counter.textContent = `● ${cur} / ${max}`;
    counter.style.color = `rgb(${r},${g},${b})`;
  };
  textarea.addEventListener("input", update);
  textarea.addEventListener("focus", update, { once: true });
  return { counter, id, className };
};