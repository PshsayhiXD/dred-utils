import { addListener } from "../../bridge/pageBridge.js";
import { chat_container } from "../../utils/constants.js";
import { createAddUserBadgeBtn } from "./elements/addUserBadgeBtn.js";
import { createAddBadgeSelect } from "./elements/addUserBadgeSelect.js";
let lastOpenState = null;
/*
addListener("domMutated", async () => {
  const chatContainer = await chat_container();
  if (!chatContainer) return;
  const { userBadgeBtn, id: btnId } = createAddUserBadgeBtn();
  const { userBadgeSelect: r, id: selectId } = await createAddBadgeSelect();
  let selectEl = chatContainer.querySelector(`#${selectId}`);
  if (!selectEl) {
    selectEl = r;
    chatContainer.appendChild(selectEl);
  }
  if (!chatContainer.querySelector(`#${btnId}`)) chatContainer.appendChild(userBadgeBtn);
  const isOpen = !chatContainer.classList.contains("closed");
  userBadgeBtn.classList.toggle("hide", !isOpen);
  selectEl.classList.toggle("hide", !isOpen);
  if (isOpen && lastOpenState === false && typeof selectEl.reloadUsers === "function") await selectEl.reloadUsers();
  lastOpenState = isOpen;
}, "chatContent");
*/