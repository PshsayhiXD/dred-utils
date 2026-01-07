import { createElement } from "../../../utils/elements/dom.js";
import { motd_text } from "../../../utils/constants.js";
import { getCurrentShipId } from "../../../utils/drednot.js";
import { saveShipMOTD } from "../motdDB.js";

/**
 * Creates the "Save Backup" button.
 * @async
 * @returns {Promise<{saveBackupBtn: HTMLElement, id: string}>} The button and its identifier.
 */
export const createSaveBackupBtn = async () => {
  const id = "motd-save-backup-btn";
  const saveBackupBtn = createElement("button", {
    id,
    className: "btn-green",
    innerHTML: '<i class="fas fa-save"></i> Save Backup',
    style: "margin-top:10px;"
  });
  saveBackupBtn.onclick = async () => {
    await saveShipMOTD(getCurrentShipId(), motd_text.innerText);
  };
  return { saveBackupBtn, id };
};