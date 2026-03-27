import { createElement } from "../../../utils/elements/dom.js";
import { initDB, deleteShipMOTD, overwriteShipMOTD } from "../motdDB.js";
import { truncateText } from "../../../utils/helper.js";
import { editMotd } from "../../../utils/drednot.js";
import { openMotdFullPreview } from "./motdFullPreview.js";
import { motd_text } from "../../../utils/constants.js";
import { lastShipJoined } from "../../trackJoinedShip/index.js";

export const openMotdBackupViewer = async () => {
  const shipData = lastShipJoined();
  const shipId = shipData?.join_info.ship.id ?? "unknown";
  const db = await initDB();
  const backups = db[shipId] || [];
  const overlay = createElement("div", { className: "mb-overlay" });
  const modal = createElement("div", { className: "mb-modal" });
  const closeBtn = createElement("button", { className: "mb-close", textContent: "✕" });
  const header = createElement("div", {
    className: "mb-header",
    append: [
      createElement("span", { textContent: "MOTD BACKUPS" }),
      closeBtn,
    ],
  });
  closeBtn.onclick = () => overlay.remove();
  const notifyElem = createElement("div", { className: "mb-notification" });
  let notifyTimeout = null;
  const notify = (msg, type = "info") => {
    notifyElem.textContent = msg;
    notifyElem.className = `mb-notification mb-notification-${type} show`;
    clearTimeout(notifyTimeout);
    notifyTimeout = setTimeout(() => notifyElem.classList.remove("show"), 2500);
  };
  const listWrap = createElement("div", { className: "mb-list" });
  if (!backups.length) {
    listWrap.appendChild(
      createElement("div", { className: "mb-list-empty", textContent: "No backups found" })
    );
  }
  let selected = null;
  let selectedContent = null;
  const previewBtn = createElement("button", {
    className: "mb-btn mb-btn-info",
    textContent: "Preview",
  });
  const loadBtn = createElement("button", {
    className: "mb-btn mb-btn-success",
    textContent: "Load",
  });
  const overwriteBtn = createElement("button", {
    className: "mb-btn",
    textContent: "Overwrite",
  });
  const deleteBtn = createElement("button", {
    className: "mb-btn mb-btn-danger",
    textContent: "Delete",
  });
  const actions = createElement("div", {
    className: "mb-actions",
    append: [previewBtn, loadBtn, overwriteBtn, deleteBtn],
  });
  const rows = [];
  for (const entry of backups) {
    const content = entry.content;
    const row = createElement("div", {
      className: "mb-row",
      append: [
        createElement("span", { className: "mb-dot" }),
        createElement("span", {
          className: "mb-row-date",
          textContent: new Date(entry.lastUpdated).toLocaleString(),
        }),
        createElement("span", {
          className: "mb-row-preview",
          textContent: truncateText(content, 30),
        }),
      ],
    });
    row.onclick = () => {
      selected = entry;
      selectedContent = content;
      rows.forEach(r => r.classList.remove("selected"));
      row.classList.add("selected");
      row.querySelector(".mb-dot").style.background = "#bbb";
      rows
        .filter(r => r !== row)
        .forEach(r => (r.querySelector(".mb-dot").style.background = ""));
    };
    rows.push(row);
    listWrap.appendChild(row);
  }
  previewBtn.onclick = () => {
    if (!selected) return notify("Select a backup first", "error");
    openMotdFullPreview(selectedContent);
  };
  loadBtn.onclick = async () => {
    if (!selected) return notify("Select a backup first", "error");
    await editMotd(selectedContent);
    overlay.remove();
  };
  overwriteBtn.onclick = async () => {
    if (!selected) return notify("Select a backup first", "error");
    const motdText = await motd_text();
    await overwriteShipMOTD(shipId, selected.id, motdText?.innerText);
    notify("Backup overwritten", "success");
    overlay.remove();
  };
  deleteBtn.onclick = async () => {
    if (!selected) return notify("Select a backup first", "error");
    await deleteShipMOTD(shipId, selected.id);
    notify("Backup deleted", "success");
    setTimeout(() => overlay.remove(), 600);
  };
  const body = createElement("div", {
    className: "mb-body",
    append: [listWrap, actions],
  });
  modal.append(header, body, notifyElem);
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
  overlay.addEventListener("click", e => {
    if (e.target === overlay) overlay.remove();
  });
};