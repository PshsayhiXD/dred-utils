import { addListener } from "../../bridge/pageBridge.js";
import { getLatestChat } from "../../utils/drednot.js";
import { createReplyButton } from "./elements/replyBtn.js";

addListener("domMutated", async () => {
  const { element: chat } = await getLatestChat();
  if (!chat) return;
  const { replyBtn, className } = createReplyButton();
  if (chat.querySelector(`.${className}`)) return;
  chat.appendChild(replyBtn);
}, "chatContent");