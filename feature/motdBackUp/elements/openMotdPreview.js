import { createElement, addCloseButton } from "../../../utils/elements/dom.js";
import { initDB, loadShipMOTDFile, saveShipMOTD, deleteShipMOTD, overwriteShipMOTD } from "../motdDB.js";
import { truncateText } from "../../../utils/helper.js";
import { editMotd, getCurrentShipId } from "../../../utils/drednot.js";
import { openMotdFullPreview } from "./motdFullPreview.js";
import { motd_text } from "../../../utils/constants.js";

/**
 * Opens the MOTD backup viewer modal.
 * @async
 * @returns {Promise<void>} Resolves when opened.
 */
export const openMotdBackupViewer = async () => {
  const shipId = getCurrentShipId();
  const db = await initDB();
  const backups = db[shipId] || [];
  const overlay = createElement("div", { className: "motd-backup-overlay" });
  const modal = createElement("div", { className: "motd-backup-modal" });

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  addCloseButton(modal, () => overlay.remove());

  if (!backups.length) {
    modal.append("No backups found.");
    return;
  }

  for (const entry of backups) {
    const content = await loadShipMOTDFile(entry.file);
    const row = createElement("div", { className: "motd-backup-row" });

    row.append(
      createElement("div", {
        innerText: new Date(entry.lastUpdated).toLocaleString()
      }),
      createElement("div", {
        innerText: truncateText(content, 30)
      })
    );

    const previewBtn = createElement("button", {
      className: "btn-blue",
      innerHTML: '<i class="fas fa-eye"></i>'
    });

    const loadBtn = createElement("button", {
      className: "btn-green",
      innerHTML: '<i class="fas fa-upload"></i>'
    });

    const overwriteBtn = createElement("button", {
      className: "btn-yellow",
      innerHTML: '<i class="fas fa-pen"></i>'
    });

    const deleteBtn = createElement("button", {
      className: "btn-red",
      innerHTML: '<i class="fas fa-trash"></i>'
    });

    previewBtn.onclick = () => openMotdFullPreview(content);

    loadBtn.onclick = () => {
      editMotd(content);
      overlay.remove();
    };

    overwriteBtn.onclick = async () => {
      await overwriteShipMOTD(shipId, entry.id, motd_text.innerText);
      overlay.remove();
    };

    deleteBtn.onclick = async () => {
      await deleteShipMOTD(shipId, entry.id);
      overlay.remove();
    };

    row.append(previewBtn, loadBtn, overwriteBtn, deleteBtn);
    modal.appendChild(row);
  }
};