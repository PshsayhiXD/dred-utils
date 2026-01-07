/**
 * Resolve a dot-path value from an object.
 * @param {Object} obj The source object.
 * @param {string} path The dot-path string.
 * @returns {any} The resolved value or undefined.
 */
export const getByPath = (obj, path) => {
  return path.split(".").reduce((acc, key) => acc?.[key], obj);
};

/**
 * Truncates text to a maximum length.
 * @param {string} text The input text.
 * @param {number} max The maximum length.
 * @returns {string} The truncated string.
 */
export const truncateText = (text, max) =>
  text.length > max ? `${text.slice(0, max)}...` : text;

/**
 * Converts supported letters and digits to stable Unicode modifier-letter.
 * @param {string} value The input string to convert.
 * @returns {Promise<string>} The modifier-letter–converted string.
 */
export const toModifier = value => {
  const map = {
    "0":"⁰","1":"¹","2":"²","3":"³","4":"⁴","5":"⁵","6":"⁶","7":"⁷","8":"⁸","9":"⁹",
    "a":"ᵃ","b":"ᵇ","c":"ᶜ","d":"ᵈ","e":"ᵉ","f":"ᶠ","g":"ᵍ","h":"ʰ","i":"ⁱ","j":"ʲ",
    "k":"ᵏ","l":"ˡ","m":"ᵐ","n":"ⁿ","o":"ᵒ","p":"ᵖ","q":"q","r":"ʳ","s":"ˢ","t":"ᵗ",
    "u":"ᵘ","v":"ᵛ","w":"ʷ","x":"ˣ","y":"ʸ","z":"ᶻ"
  };
  return value.replace(/[0-9a-z]/gi, c => map[c.toLowerCase()] || c);
};

/**
 * Builds a single-line Unicode reply string with safe truncation.
 * @param {string} username The username being replied to.
 * @param {string|null} senderContent The original message content being replied to.
 * @param {string} content The normal message content.
 * @returns {Promise<string>} A single-line Unicode-formatted reply message.
 */
export const convertReplyContent = (username, senderContent, content) => {
  const user = username.trim().replace(/\s+/g, " ").slice(0, 24);
  const rawSrc = senderContent ? senderContent.trim().replace(/\s+/g, " ") : "";
  const src = rawSrc.length > 40 ? rawSrc.slice(0, 39) + "…" : rawSrc;
  const headText = src ? `${user} · ${src}` : user;
  const head = `⤷ ${toModifier(headText)} ▸ `;
  return head + content;
};

/**
 * Convert time string to seconds.
 * @param {string} timeStr - Format "MM:SS" or "HH:MM:SS".
 * @returns {number} - Total seconds.
 */
export const toSec = (timeStr) => {
  const parts = timeStr.split(":").map(Number);
  return parts.length === 3
    ? parts[0] * 3600 + parts[1] * 60 + parts[2]
    : parts[0] * 60 + parts[1];
};