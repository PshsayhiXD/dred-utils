import { createElement } from "../../../utils/elements/dom.js";
import { chat_input } from "../../../utils/constants.js";
import { convertReplyContent } from "../../../utils/helper.js";
import { extractChatUsername, extractChatMessage } from "../../../utils/drednot.js";

/**
 * Creates a reply button with its click handler.
 * @returns {{ replyBtn: HTMLButtonElement, className: string }} The button element and its class name.
 */
export const createReplyButton = () => {
  const className = "replyBtn";
  const replyBtn = createElement("button", {
    className,
    textContent: "↩"
  });
  replyBtn.addEventListener("click", async e => {
    const p = replyBtn.closest("p");
    const chatInput = await chat_input();
    if (!p || !chatInput) return;
    const username = extractChatUsername(p);
    if (!username) return;
    const message = extractChatMessage(p);
    const senderContent = message?.slice(0, 40) || "";
    chatInput.value = convertReplyContent(username, senderContent, "");
    chatInput.focus();
  });
  return { replyBtn, className };
};