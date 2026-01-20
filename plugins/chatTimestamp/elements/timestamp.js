/**
 * Creates a chat timestamp element.
 * @returns {{ timestampEl: HTMLSpanElement, className: string }} The timestamp element and its class name.
 */
export const createChatTimestamp = () => {
  const className = "chatTimestamp";
  const timestampEl = document.createElement("span");
  timestampEl.className = className;
  const date = new Date();
  timestampEl.textContent = `[${date.toLocaleTimeString("en-GB", { hour12: false })}] `;
  timestampEl.style.opacity = "0.6";
  return { timestampEl, className };
};
