import { onDispatch } from "../../bridge/pageBridge.js";
import { motd_content, motd_text } from "../../utils/constants.js";
import { createLoadBackupBtn } from "./elements/loadBackUpBtn.js";
import { createSaveBackupBtn } from "./elements/saveBackUpBtn.js";
import { getPluginConfig } from "../../utils/pluginLoader.js";
import { lastShipJoined } from "../trackJoinedShip/index.js";
import { saveShipMOTD } from "./motdDB.js";
import { are } from "../../utils/elements/dom.js";

let motdObserver = null;
let saveTimeout = null;

onDispatch("dredutils:motdContainer", () => {
  const motdContent = motd_content();
  if (motdObserver) {
    motdObserver.disconnect();
    motdObserver = null;
  }
  if (!are(motdContent, HTMLElement)) return;
  const autosave = getPluginConfig("motdbackup", "autosave");
  if (autosave) {
    const textNode = motd_text();
    if (textNode) {
      motdObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === "characterData") {
            clearTimeout(saveTimeout);
            saveTimeout = setTimeout(async () => {
              const shipData = lastShipJoined();
              const shipId = shipData?.join_info.ship.id ?? "unknown";
              await saveShipMOTD(shipId, textNode.innerText);
            }, 5000);
          }
        });
      });
      motdObserver.observe(textNode, { characterData: true });
    }
  }
  const { loadBackupBtn, id: loadBackupId } = createLoadBackupBtn();
  const { saveBackupBtn, id: saveBackupId } = createSaveBackupBtn();
  if (motdContent.querySelector(`#${loadBackupId}`) || motdContent.querySelector(`#${saveBackupId}`)) return;
  motdContent.appendChild(loadBackupBtn);
  motdContent.appendChild(saveBackupBtn);
});