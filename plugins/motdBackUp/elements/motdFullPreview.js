import { createElement, addCloseButton } from "../../../utils/elements/dom.js";

/**
 * Opens a full preview modal for MOTD content.
 * @param {string} content Full MOTD text.
 * @returns {void} Displays preview modal.
 */
export const openMotdFullPreview = content => {
  const overlay = createElement("div", { className: "motd-preview-overlay" });
  const modal = createElement("div", { className: "motd-preview-modal" });
  const body = createElement("pre", {
    className: "motd-preview-body",
    innerText: content
  });

  overlay.appendChild(modal);
  modal.appendChild(body);
  document.body.appendChild(overlay);

  addCloseButton(modal, () => overlay.remove());
};