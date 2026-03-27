import { createElement } from "../../../utils/elements/dom.js";
import { motd_text } from "../../../utils/constants.js";
import { lastShipJoined } from "../../trackJoinedShip/index.js";
import { saveShipMOTD } from "../motdDB.js";

export const createSaveBackupBtn = () => {
  const id = "motd-save-backup-btn";
  const saveBackupBtn = createElement("button", {
    id,
    className: "btn btn-small btn-green",
    innerHTML: '<i class="fas fa-save"></i> Save Backup',
    style: "margin-top:10px;",
  });
  saveBackupBtn.onclick = async () => {
    const motdText = motd_text();
    const shipData = lastShipJoined();
    const shipId = shipData?.join_info.ship.id ?? "unknown";
    await saveShipMOTD(shipId, motdText?.textContent);
  };
  return { saveBackupBtn, id };
};