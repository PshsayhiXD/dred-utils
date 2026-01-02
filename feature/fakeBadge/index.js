import { addListener } from "../../bridge/pageBridge.js";
import { chat_container } from "../../utils/constants.js";
import { createAddUserBadgeBtn } from "./elements/addUserBadgeBtn.js";
import { createAddBadgeSelect } from "./elements/addUserBadgeSelect.js";
let lastOpenState = null;
addListener("domMutated", async () => {
  if (!chat_container) return;
  const { userBadgeBtn, id: btnId } = createAddUserBadgeBtn();
  const { userBadgeSelect: r, id: selectId } = await createAddBadgeSelect();
  let selectEl = chat_container.querySelector(`#${selectId}`);
  if (!selectEl) {
    selectEl = r;
    chat_container.appendChild(selectEl);
  }
  if (!chat_container.querySelector(`#${btnId}`)) chat_container.appendChild(userBadgeBtn);
  const isOpen = !chat_container.classList.contains("closed");
  userBadgeBtn.classList.toggle("hide", !isOpen);
  selectEl.classList.toggle("hide", !isOpen);
  if (isOpen && lastOpenState === false && typeof selectEl.reloadUsers === "function") await selectEl.reloadUsers();
  lastOpenState = isOpen;
}, "chatContent");