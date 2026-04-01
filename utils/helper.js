import { are } from "./elements/dom.js";

const boundEls = new WeakSet();

export const bindOnce = (el, fn) => {
  if (!are(el, Element) || boundEls.has(el)) return;
  el.addEventListener("click", fn);
  boundEls.add(el);
};

export const getByPath = (obj, path) => {
  return path.split(".").reduce((acc, key) => acc?.[key], obj);
};

export const truncateText = (text, max) =>
  text.length > max ? `${text.slice(0, max)}...` : text;

export const toModifier = value => {
  const map = {
    "0":"⁰","1":"¹","2":"²","3":"³","4":"⁴","5":"⁵","6":"⁶","7":"⁷","8":"⁸","9":"⁹",
    "a":"ᵃ","b":"ᵇ","c":"ᶜ","d":"ᵈ","e":"ᵉ","f":"ᶠ","g":"ᵍ","h":"ʰ","i":"ⁱ","j":"ʲ",
    "k":"ᵏ","l":"ˡ","m":"ᵐ","n":"ⁿ","o":"ᵒ","p":"ᵖ","q":"q","r":"ʳ","s":"ˢ","t":"ᵗ",
    "u":"ᵘ","v":"ᵛ","w":"ʷ","x":"ˣ","y":"ʸ","z":"ᶻ"
  };
  return value.replace(/[0-9a-z]/gi, c => map[c.toLowerCase()] || c);
};

export const convertReplyContent = (username, senderContent, content) => {
  const user = username.trim().replace(/\s+/g, " ").slice(0, 24);
  const rawSrc = senderContent ? senderContent.trim().replace(/\s+/g, " ") : "";
  const src = rawSrc.length > 40 ? rawSrc.slice(0, 39) + "…" : rawSrc;
  const headText = src ? `${user} · ${src}` : user;
  const head = `⤷ ${toModifier(headText)} ▸ `;
  return head + content;
};

export const formatTime = (seconds) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
};

export const toSec = (timeStr) => {
  const parts = timeStr.split(":").map(Number);
  return parts.length === 3
    ? parts[0] * 3600 + parts[1] * 60 + parts[2]
    : parts[0] * 60 + parts[1];
};

export const debounce = (fn, t = 120) => {
  let id;
  return (v) => {
    clearTimeout(id);
    id = setTimeout(() => fn(v), t);
  };
};

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
