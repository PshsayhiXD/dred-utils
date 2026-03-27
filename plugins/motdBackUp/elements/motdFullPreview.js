import { createElement } from "../../../utils/elements/dom.js";

export const openMotdFullPreview = content => {
  const overlay = createElement("div", { className: "mb-overlay" });
  const modal = createElement("div", { className: "mb-modal mb-preview-modal" });
  const closeBtn = createElement("button", { className: "mb-close", textContent: "✕" });
  const header = createElement("div", {
    className: "mb-header",
    append: [
      createElement("span", { textContent: "PREVIEW" }),
      closeBtn,
    ],
  });
  closeBtn.onclick = () => overlay.remove();
  const body = createElement("div", { className: "mb-body" });
  const pre = createElement("pre", {
    className: "mb-preview-body",
    innerText: content,
  });
  body.appendChild(pre);
  modal.append(header, body);
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
  overlay.addEventListener("click", e => {
    if (e.target === overlay) overlay.remove();
  });
};
