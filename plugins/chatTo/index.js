import { createChatToBtn } from "./elements/chatto.js";
import { chat_container, chat_send_btn } from "../../utils/elements/constants.js";
import { qs } from "../../utils/elements/dom.js";
import { on } from "../../bridge/pageBridge.js";

on("dredutils:domMutated", () => {
  const { btn: chatToBtn, id } = createChatToBtn();
  const sendBtn = chat_send_btn();
  const container = chat_container();
  if (qs(`#${id}`, container)) return;
  container.insertBefore(chatToBtn, sendBtn);
}, "chatContainer");