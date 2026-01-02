import { createElement } from "../../../utils/elements/dom.js";
import { editMotd, getCurrentShipId } from "../../../utils/drednot.js";
import { loadShipMOTD } from "../motdDB.js";
import { createNotification } from "../../../utils/elements/notifications.js";

/**
 * Creates the "Load Backup" button for the MOTD element.
 * @async
 * @returns {Promise<{loadBackupBtn: HTMLElement, id: string}>} The button element and its ID.
 */
export const createLoadBackupBtn = async () => {
  const id = "dredutils-motd-load-backup-btn";
  const loadBackupBtn = createElement('button', {
    id,
    className: 'btn-yellow',
    innerHTML: '<i class="fas fa-download" style="margin-right:5px;"></i>Load Backup',
    style: 'margin-top:10px;margin-right:10px;'
  });
  loadBackupBtn.addEventListener('click', async () => {
    const shipId = getCurrentShipId();
    const savedMOTD = await loadShipMOTD(shipId);
    if (savedMOTD) {
      editMotd(savedMOTD);
      createNotification("MOTD Saved!", { type: "success" });
    } else createNotification("No backup Found.", { type: "warning" });
  });
  return { 
    loadBackupBtn, 
    id 
  };
};