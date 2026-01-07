import { chat_content, motd_edit_btn, motd_textarea, server_select } from "./constants.js";
import { toSec } from "./helper.js";
import { qsa } from "./elements/dom.js";

const AccountInfo = async () => {
  let accountInfo;
  await fetch(`https://drednot.io/account/status`)
    .then((res) => res.json())
    .then((json) => {
      if (json.account) {
        accountInfo = {
          name: json.account.name,
          isRegistered: json.account.is_registered === true,
        };
      } else if (json.account === null)
        accountInfo = {
          noAccount: true,
        };
    }).catch(() => {});
  return accountInfo;
}

/**
 * Get account info by key.
 * @param {string} key key to get from account info
 * @returns {Promise<string|null>} value of the key in account info or null if not found
 */
export const getAccount = async (key) => {
  try {
    const info = await AccountInfo();
    if (!info?.[key]) return null;
    return info?.[key];
  } catch (error) {
    return null;
  }
}

/**
 * Get the client's username.
 * @returns {Promise<string|null>} client's username or null if not found
 */
export const getClientUsername = async () => {
  return await getAccount("name");
};

/**
 * Check if the client is registered.
 * @returns {Promise<boolean>} true if registered, false otherwise
 */
export const isClientRegistered = async () => {
  const isRegistered = await getAccount("isRegistered");
  return isRegistered === true;
};

/**
 * Get all usernames and their roles from the chat content.
 * @returns {Promise<{usernames: string[], roles: Object}>} object containing an array of usernames and a mapping of usernames to their roles
 */
export const getAllUserFromChat = async () => {
  const usernames = [];
  const roles = {};
  const chatParagraphs = chat_content.querySelectorAll("p");
  chatParagraphs.forEach((p) => {
    const usernameEl = p.querySelector("bdi");
    const roleEl = p.querySelector("span");
    if (usernameEl) {
      const username = usernameEl.innerText;
      if (!usernames.includes(username)) usernames.push(username);
      if (roleEl) {
        const roleText = roleEl.innerText;
        if (!roles[username]) roles[username] = roleText;
      } else if (!roles[username]) roles[username] = "Guest";
    }
  });
  return {
    usernames,
    roles,
  };
};


/**
 * @returns {Promise<string|null>} The current ship ID from page.
 */
export const getCurrentShipId = () => {
  const title = document.title.replace(" - Deep Space Airships", "");
  if (!title || title === "Deep Space Airships") return null;
  else return title;
};

/**
 * Save MOTD.
 * @param {string} content Motd content.
 * @returns {boolean} True if success.
 */
export const editMotd = (content) => {
  if (motd_textarea().value === content || !content) return false;
  motd_edit_btn.click();
  motd_textarea().value = (content);
  saveMotd(true);
  return true;
}

/**
 * Returns the currently selected server data.
 * @returns {{name: string, players: string, ping: string, value: string}|null} The selected server info.
 */
export const getSelectedServer = () => {
  if (!server_select) return null;
  const opt = server_select.selectedOptions[0];
  if (!opt) return null;
  const [name, players, ping] = opt.text.replace(/^\d+\s-\s/, "").split(" - ");
  return { name, players, ping, value: opt.value };
};

/**
 * Gets all chat message elements inside the chat content container.
 * @returns {HTMLElement[]} An array of <p> elements representing chat messages.
 */
export const getAllChatMessage = () => {
  if (!chat_content) return [];
  return [...chat_content.querySelectorAll("p")];
};

/**
 * Extracts the role name from a chat message element.
 * @param {HTMLParagraphElement} messageEl The chat message <p> element.
 * @returns {string|null} The role name or null.
 */
export const extractChatRole = messageEl =>
  messageEl?.querySelector("b > span")?.textContent?.trim() || null;

/**
 * Extracts the username from a chat message element.
 * @param {HTMLParagraphElement} messageEl The chat message <p> element.
 * @returns {string|null} The username or null.
 */
export const extractChatUsername = messageEl =>
  messageEl?.querySelector("bdi")?.textContent?.trim() || null;

/**
 * Extracts user badges from a chat message element.
 * @param {HTMLParagraphElement} messageEl The chat message <p> element.
 * @returns {{ icon: string|null, tooltip: string|null }[]} The extracted badges.
 */
export const extractChatBadges = messageEl =>
  [...(messageEl?.querySelectorAll(".user-badge-small") || [])].map(badge => ({
    icon: badge.querySelector("img")?.getAttribute("src") || null,
    tooltip: badge.querySelector(".tooltip")?.textContent?.trim() || null
  }));

/**
 * Extracts the chat message content from a chat message element.
 * @param {HTMLParagraphElement} messageEl The chat message <p> element.
 * @returns {Promise<string|null>} The chat message content or null.
 */
export const extractChatMessage = messageEl => {
  if (!messageEl) return null;
  const clone = messageEl.cloneNode(true);
  clone.querySelectorAll("b, bdi, span, .user-badge-small, .replyBtn").forEach(n => n.remove());
  const text = clone.textContent?.trim();
  if (!text) return null;
  return text.startsWith(":") ? text.slice(1).trim() : text;
};

/**
 * Collect table row data.
 * @param {HTMLElement} tbody - Table body element containing rows.
 * @returns {Array<Object>} - Array of objects with row data:
 *  { r, name, online, play, rank, banned, owner, captainLevel }.
 */
export const collectTeamPlayer = (tbody) => 
  Array.from(tbody.querySelectorAll("tr")).map(r => {
    r.style.fontSize = "15px";
    const td = r.children;
    const name = td[1]?.innerText.split("\n")[0] || "";
    const online = td[0]?.innerText.trim() === "1";
    const play = toSec(td[3]?.innerText || "0:00");
    const identityText = td[1]?.innerText.toLowerCase() || "";
    const actionText = td[4]?.innerText.toLowerCase() || "";
    const banned = actionText.includes("banned");
    const owner = identityText.includes("ship owner");
    let captainLevel = 0;
    const capMatch = actionText.match(/captain\s*\[(\d+)\]/i);
    if (capMatch) captainLevel = Number(capMatch[1]);
    const rank = banned
      ? "banned"
      : owner
      ? "owner"
      : actionText.includes("captain")
      ? "captain"
      : actionText.includes("crew")
      ? "crew"
      : "guest";
    return { r, name, online, play, rank, banned, owner, captainLevel };
  });