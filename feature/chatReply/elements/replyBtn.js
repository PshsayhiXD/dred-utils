import { createElement } from "../../../utils/elements/dom.js";
import { chat_input } from "../../../utils/constants.js";
import { convertReplyContent } from "../../../utils/helper.js";
import { extractChatUsername, extractChatMessage } from "../../../utils/drednot.js";
/**
 * Creates a reply button with its click handler.
 * @async
 * @returns {{ element: HTMLButtonElement, onClick: (e: MouseEvent) => void, className: string }} The button element, its click handler, and its class name.
 */
export const createReplyButton = () => {
  const className = "replyBtn";
  const element = createElement("button", {
    className,
    textContent: "↩"
  });
  const onClick = async e => {
    const btn = e.target.closest(`.${className}`);
    if (!btn) return;
    const p = btn.closest("p");
    if (!p) return;
    if (!chat_input) return;
    const username = extractChatUsername(p);
    if (!username) return;
    const message = extractChatMessage(p);
    const senderContent = message?.slice(0, 40) || "";
    chat_input.value = convertReplyContent(username, senderContent, "");
    chat_input.focus();
  };
  return { replyBtn: element, onClick, className };
};