import { on } from "../../bridge/pageBridge.js";
import { getLatestChat } from "../../utils/drednot.js";
import { createChatTimestamp } from "./elements/timestamp.js";

on("dredutils:domMutated", () => {
  const { element: chat } = getLatestChat();
  if (!chat) return;
  if (!chat.dataset.tsApplied) {
    const { timestampEl } = createChatTimestamp();
    chat.prepend(timestampEl);
    chat.dataset.tsApplied = "1";
  }
}, "chatContent");