import { createElement } from "../../../utils/elements/dom.js";
import { openMotdBackupViewer } from "./openMotdPreview.js";

export const createLoadBackupBtn = () => {
  const id = "motd-view-backups-btn";
  const loadBackupBtn = createElement("button", {
    id,
    className: "btn btn-small btn-yellow",
    innerHTML: '<i class="fas fa-folder-open"></i> View Backups',
    style: "margin-top:10px;margin-right:10px;",
  });
  loadBackupBtn.onclick = openMotdBackupViewer;
  return { loadBackupBtn, id };
};
