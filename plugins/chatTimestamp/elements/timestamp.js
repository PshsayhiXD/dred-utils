import { createElement } from "../../../utils/elements/dom.js";

export const createChatTimestamp = () => {
  const className = "chatTimestamp";
  const timestampEl = createElement("span", { className });
  const date = new Date();
  timestampEl.textContent = `[${date.toLocaleTimeString("en-GB", { hour12: false })}] `;
  return { timestampEl, className };
};
