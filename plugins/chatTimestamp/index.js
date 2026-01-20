import { addListener } from "../../bridge/pageBridge.js";
import { getLatestChat } from "../../utils/drednot.js";
import { createChatTimestamp } from "./elements/timestamp.js";

addListener("domMutated", async () => {
  const { element: chat } = await getLatestChat();
  if (!chat) return;
  if (!chat.dataset.tsApplied) {
    const { timestampEl } = createChatTimestamp();
    chat.prepend(timestampEl);
    chat.dataset.tsApplied = "1";
  }
}, "chatContent");