import { on } from "../../bridge/pageBridge.js";
import { getLatestChat } from "../../utils/drednot.js";
import { createReplyButton } from "./elements/replyBtn.js";
import { are } from "../../utils/elements/dom.js";

on("dredutils:domMutated", () => {
  const { element: chat } = getLatestChat();
  if (!are(chat, HTMLElement)) return;
  const { replyBtn, className } = createReplyButton();
  if (chat.querySelector(`.${className}`)) return;
  chat.appendChild(replyBtn);
}, "chatContent");