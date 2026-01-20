import { addListener } from "../../bridge/pageBridge.js";
import { motd_content } from "../../utils/constants.js";
import { createLoadBackupBtn } from "./elements/loadBackUpBtn.js";
import { createSaveBackupBtn } from "./elements/saveBackUpBtn.js";
addListener("domMutated", async () => {
  const motdContent = await motd_content();
  if (!motdContent) return;
  const { loadBackupBtn, id: loadBackupId } = await createLoadBackupBtn();
  const { saveBackupBtn, id: saveBackupId } = await createSaveBackupBtn();
  if (motdContent.querySelector(`#${loadBackupId}`) || motdContent.querySelector(`#${saveBackupId}`)) return;
  else {
    motdContent.appendChild(loadBackupBtn);
    motdContent.appendChild(saveBackupBtn);
  }
}, "motdContainer");