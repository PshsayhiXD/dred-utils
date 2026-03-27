import { team_players_inner_codes } from "../../utils/constants.js";
import { getLatestChat, isDuplicatedText } from "../../utils/drednot.js";
import { getUserTagStyles } from "./styleDB.js";
import { createElement, qs, qsa } from "../../utils/elements/dom.js";

export const renderLatestChatUserStyle = styles => {
  const latest = getLatestChat();
  if (!latest?.element || !latest?.username) return;
  if (latest.element.dataset.styleApplied === "1") return;
  const usernameEl = latest.element.querySelector("bdi");
  if (!usernameEl) return;
  const text = usernameEl.textContent;
  const perCharStyles = styles.filter(s => s.perChar);
  const flatStyles = styles.filter(s => !s.perChar).map(s => s.name);
  flatStyles.forEach(c => usernameEl.classList.add(c));
  if (!perCharStyles.length) {
    usernameEl.textContent = text;
    latest.element.dataset.styleApplied = "1";
    return;
  }
  usernameEl.innerHTML = [...text].map(
    (c, i) =>
      `<span class="${perCharStyles.map(s => s.name).join(" ")}" style="animation-delay:${i * 0.05}s;">${c}</span>`
  ).join("");
  latest.element.dataset.styleApplied = "1";
};

export const renderTeamMenuTagStyle = async () => {
  const nodes = Array.from(team_players_inner_codes());
  for (const codeEl of nodes) {
    const text = codeEl.textContent?.trim();
    if (!text) continue;
    const parent = codeEl.parentElement;
    if (!parent || parent.nodeType !== 1) continue;
    if (getComputedStyle(parent).position === "static") {
      parent.style.position = "relative";
    }
    qsa(parent, "code[data-username-overlay]").forEach(n => n.remove());
    let overlay = qs(parent, "code[data-username-overlay]");
    if (!overlay) {
      overlay = createElement("code", { dataset: { usernameOverlay: "1" }, style: { position: "absolute", pointerEvents: "none", whiteSpace: "pre", visibility: "visible" } });
      parent.appendChild(overlay);
    }
    codeEl.style.visibility = "hidden";
    overlay.className = codeEl.className;
    overlay.style.background = codeEl.style.background;
    overlay.style.color = codeEl.style.color;
    overlay.style.font = codeEl.style.font;
    overlay.style.padding = codeEl.style.padding;
    overlay.style.borderRadius = codeEl.style.borderRadius;
    overlay.style.visibility = "visible";
    overlay.style.left = codeEl.offsetLeft + "px";
    overlay.style.top = codeEl.offsetTop + "px";
    const { text: username } = isDuplicatedText(text);
    const styles = await getUserTagStyles(username);
    overlay.textContent = username;
    if (!styles.length) continue;
    const normalized = styles.map(s => typeof s === "string" ? { name: s } : s);
    const perChar = normalized.filter(s => s.perChar);
    const flat = normalized.filter(s => !s.perChar).map(s => s.name);
    flat.forEach(c => overlay.classList.add(c));
    if (!perChar.length) continue;
    overlay.innerHTML = [...username].map(
      (c, i) =>
        `<span class="${perChar.map(s => s.name).join(" ")}" style="animation-delay:${i * 0.05}s;">${c}</span>`
    ).join("");
  }
};

