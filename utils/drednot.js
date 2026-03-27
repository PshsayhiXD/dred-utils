import {
  chat_content,
  motd_edit_btn,
  motd_textarea,
  motd_save_btn,
  server_select,
  chat_container,
  chat_input,
  chat_close,
} from "./constants.js";
import { toSec } from "./helper.js";
import { qsa, qs, are } from "./elements/dom.js";

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
      info = { name: null, isRegistered: false };
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
export const getClientUsername = async () => await getAccount("name");
export const isClientRegistered = async () =>
  (await getAccount("isRegistered")) === true;
/* 
  ===== FROM SIMPLE DREDDARK API =====
  https://github.com/PshsayhiXD/Simple-Dreddark-API
*/

export const getAllUserFromChat = () => {
  const usernames = [];
  const roles = {};
  const chatContent = chat_content();
  qsa("p", chatContent).forEach((p) => {
    const usernameEl = qs("bdi", p);
    const roleEl = qs("span", p);
    if (usernameEl) {
      const username = usernameEl.textContent;
      if (!usernames.includes(username)) usernames.push(username);
      roles[username] ??= roleEl ? roleEl.textContent : "Guest";
    }
  });
  return { usernames, roles };
};

export const getAllShipPlayer = async (opts = {}) => {
  const { ignoreSelf = true, closeByDefault = true } = opts;
  const chat = chat_container();
  if (chat.classList.contains("closed")) chatBtn.click();
  const inp = chat_input();
  inp.value = "/kick ";
  inp.dispatchEvent(new Event("input"));
  const players = [...qsa("#chat-autocomplete p")].map(
    (p) => p.textContent.replace(/\s+/g, ""),
  );
  if (closeByDefault) {
    const closeBtn = chat_close();
    closeBtn?.click();
  }
  const clientName = await getClientUsername();
  const cl = clientName ? clientName.replace(/\s+/g, "") : "Unknown_Player";
  if (ignoreSelf && players.includes(cl)) players.splice(players.indexOf(cl), 1);
  return players;
};

export const editMotd = (content) => {
  const textarea = motd_textarea();
  if (textarea?.value === content || !content) return false;
  const editBtn = motd_edit_btn();
  editBtn?.click();
  if (textarea) textarea.value = content;
  const saveBtn = motd_save_btn();
  saveBtn?.click();
  return true;
};

export const getSelectedServer = () => {
  const select = server_select();
  if (!are(select, HTMLSelectElement)) return null;
  const opt = select.selectedOptions[0];
  if (!opt) return null;
  const [name, players, ping] = opt.text.replace(/^\d+\s-\s/, "").split(" - ");
  return { name, players, ping, value: opt.value };
};

export const extractChatRole = (messageEl) =>
  qs("b > span", messageEl)?.textContent?.trim() || null;

export const extractChatUsername = (messageEl) =>
  qs("bdi", messageEl)?.textContent?.trim() || null;

export const extractChatBadges = (messageEl) =>
  qsa(".user-badge-small", messageEl).map((badge) => ({
    icon: qs("img", badge)?.getAttribute("src") || null,
    tooltip: qs(".tooltip", badge)?.textContent?.trim() || null,
  }));

export const extractChatMessage = (messageEl) => {
  if (!messageEl) return null;
  const clone = messageEl.cloneNode(true);
  qsa("b, bdi, span, .user-badge-small, .replyBtn", clone).forEach((n) =>
    n.remove(),
  );
  const text = clone.textContent?.trim();
  if (!text) return null;
  return text.startsWith(":") ? text.slice(1).trim() : text;
};

export const getLatestChat = () => {
  const chatContent = chat_content();
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

export const getAllChatMessage = () => {
  const chatContent = chat_content();
  if (!chatContent) return [];
  return qsa("p", chatContent).map((el) => ({
    element: el,
    role: extractChatRole(el),
    username: extractChatUsername(el),
    badges: extractChatBadges(el),
    message: extractChatMessage(el),
  }));
};

export const collectTeamPlayer = (tbody) =>
  qsa("tr", tbody).map((r) => {
    r.style.fontSize = "15px";
    const td = r.children;
    const name = td[1]?.textContent.split("\n")[0] || "";
    const online = td[0]?.textContent.trim() === "1";
    const play = toSec(td[3]?.textContent || "0:00");
    const identityText = td[1]?.textContent.toLowerCase() || "";
    const actionText = td[4]?.textContent.toLowerCase() || "";
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

export const isDuplicatedText = (text) => {
  const half = text.length / 2;
  const isDuplicate = text.slice(0, half) === text.slice(half);
  return {
    text: isDuplicate ? text.slice(0, half) : text,
    boolean: isDuplicate,
  };
};