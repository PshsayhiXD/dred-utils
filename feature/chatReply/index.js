import { addListener } from "../../bridge/pageBridge.js";
import { getAllChatMessage } from "../../utils/drednot.js";
import { createReplyButton } from "./elements/replyBtn.js";

let replyHandler;

addListener("domMutated", () => {
  const messages = getAllChatMessage();
  for (const p of messages) {
    const { replyBtn, onClick, className } = createReplyButton();
    if (p.querySelector(`.${className}`)) continue;
    p.appendChild(replyBtn);
    if (!replyHandler) replyHandler = onClick;
  }
}, "chatContent");

document.addEventListener("click", e => {
  if (!replyHandler) return;
  replyHandler(e);
});