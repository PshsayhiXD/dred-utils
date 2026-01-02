import { createElement } from "../../../utils/elements/dom.js";
import { motd_textarea } from "../../../utils/constants.js";
import { getCurrentShipId } from "../../../utils/drednot.js";
import { saveShipMOTD } from "../motdDB.js";

/**
 * Creates the "Save Backup" button for the MOTD element.
 * @async
 * @returns {Promise<{saveBackupBtn: HTMLElement, id: string}>} The button element and its ID.
 */
export const createSaveBackupBtn = async () => {
  const id = "motd-save-backup-btn";
  const saveBackupBtn = createElement('button', {
    id,
    className: 'btn-green',
    innerHTML: '<i class="fas fa-save" style="margin-right:5px;"></i>Save Backup',
    style: 'margin-top:10px;'
  });
  saveBackupBtn.addEventListener('click', async () => {
    const shipId = getCurrentShipId();
    if (motd_textarea) {
      await saveShipMOTD(shipId, motd_textarea.value);
      alert('Backup saved!');
    }
  });
  return { 
    saveBackupBtn, 
    id 
  };
};