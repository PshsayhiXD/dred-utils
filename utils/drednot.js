import { chat_content, motd_edit_btn, motd_textarea, server_select } from "./constants.js";
import { toSec } from "./helper.js";
import { qsa } from "./elements/dom.js";

/* 
  ===== FROM SIMPLE DREDDARK API =====
  https://github.com/PshsayhiXD/Simple-Dreddark-API
*/
export const accountInfo = async () => {
  let info = null;
  try {
    const res = await fetch("https://drednot.io/account/status");
    const json = await res.json();
    if (json?.account) {
      info = {
        name: json.account.name ?? null,
        isRegistered: json.account.is_registered === true,
      };
    } else {
      info = {
        name: null,
        isRegistered: false,
      };
    }
  } catch {}
  return info;
};
export const getAccount = async (key) => {
  try {
    const info = await accountInfo();
    return info?.[key] ?? null;
  } catch {
    return null;
  }
};
export const getClientUsername = async () => {
  return await getAccount("name");
};
export const isClientRegistered = async () => {
  return (await getAccount("isRegistered")) === true;
};
/* 
  ===== FROM SIMPLE DREDDARK API =====
  https://github.com/PshsayhiXD/Simple-Dreddark-API
*/





/**
* Get all usernames and their roles from the chat content.
* @returns {Promise<{usernames: string[], roles: Object}>} object containing an array of usernames and a mapping of usernames to their roles
*/
export const getAllUserFromChat = async () => {
  const usernames = [];
  const roles = {};
  const chatContent = await chat_content();
  const chatParagraphs = chatContent?.querySelectorAll("p") || [];
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
export const editMotd = async (content) => {
  const textarea = await motd_textarea();
  if (textarea?.value === content || !content) return false;
  const editBtn = await motd_edit_btn();
  editBtn?.click();
  if (textarea) textarea.value = content;
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
* Gets the latest chat message.
* @returns {{ element: HTMLParagraphElement, role: string|null, username: string|null, badges: Array, message: string|null }|null}
*/
export const getLatestChat = async () => {
  const chatContent = await chat_content();
  if (!chatContent) return null;
  const latestChat = chatContent.lastElementChild;
  if (!latestChat) return null;
  return {
    element: latestChat,
    role: extractChatRole(latestChat),
    username: extractChatUsername(latestChat),
    badges: extractChatBadges(latestChat),
    message: extractChatMessage(latestChat),
  };
};

/**
* Gets all chat messages with extracted metadata.
* @returns {Array<{ element: HTMLParagraphElement, role: string|null, username: string|null, badges: Array, message: string|null }>}
*/
export const getAllChatMessage = async () => {
  const chatContent = await chat_content();
  if (!chatContent) return [];
  return [...chatContent.querySelectorAll("p")].map(el => ({
    element: el,
    role: extractChatRole(el),
    username: extractChatUsername(el),
    badges: extractChatBadges(el),
    message: extractChatMessage(el),
  }));
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

/**
* Returns the first half of the string if both halves are identical; otherwise returns the original string.
* @param {string} text - The username text to normalize.
* @returns {string} The normalized username with duplicated halves collapsed, or the original text.
*/
export const isDuplicatedText = text => {
  const half = text.length / 2;
  const isDuplicate = text.slice(0, half) === text.slice(half);
  return {
    text: isDuplicate ? text.slice(0, half) : text,
    boolean: isDuplicate
  };
};

/**
* Capture a canvas to a JPEG blob URL.
* @param {HTMLCanvasElement} canvas - The source canvas (WebGL or 2D).
* @param {number} [scale=0.5] - Scale factor (0.1–1) for lower resolution.
* @param {number} [quality=0.6] - JPEG quality (0–1) for more compression.
* @param {boolean} [autoRevoke=false] - Whether to auto-revoke the URL after use.
* @returns {Promise<string>} - Blob URL of the captured image.
*/
const captureCanvas = (canvas, scale = 0.5, quality = 0.6, autoRevoke = false) => {
  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      const offscreen = document.createElement("canvas");
      const offCtx = offscreen.getContext("2d");
      offscreen.width = canvas.width * scale;
      offscreen.height = canvas.height * scale;
      offCtx.drawImage(canvas, 0, 0, offscreen.width, offscreen.height);
      offscreen.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        resolve(url);
        if (autoRevoke) setTimeout(() => URL.revokeObjectURL(url), 5000);
      }, "image/jpeg", quality);
    });
  });
};