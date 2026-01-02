import { addListener } from "../../bridge/pageBridge.js";
import { motd_content } from "../../utils/constants.js";
import { createLoadBackupBtn } from "./elements/loadBackUpBtn.js";
import { createSaveBackupBtn } from "./elements/saveBackUpBtn.js";
addListener("domMutated", async () => {
  const { loadBackupBtn, id: loadBackupId } = await createLoadBackupBtn();
  const { saveBackupBtn, id: saveBackupId } = await createSaveBackupBtn();
  if (motd_content.querySelector(`#${loadBackupId}`) || motd_content.querySelector(`#${saveBackupId}`)) return;
  else {
    motd_content.appendChild(loadBackupBtn);
    motd_content.appendChild(saveBackupBtn);
  }
}, "motdContainer");