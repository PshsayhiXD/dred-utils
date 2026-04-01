import {
  chat_content,
  motd_edit_btn,
  motd_textarea,
  motd_save_btn,
  server_select,
  chat_container,
  chat_input,
  chat_send_btn,
  chat_close,
  team_input,
  team_players_inner,
  team_players_inner_meme_btn,
  team_menu_container,
} from "./constants.js";
import { 
  inputKeys, 
  dispatchInputEvent, 
  dispatchEvent, 
  pressBtn
} from "./elements/keyboard.js";
import { waitForElement } from "./elements/dom.js";
import { toSec, sleep } from "./helper.js";
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


export const gravity = async (side, silent = false) => {
  const input = team_input();
  if (!are(input, HTMLInputElement)) return;
  const team = team_menu_container();
  if (!are(team, HTMLElement)) return;
  if (silent) {
    team.style.display = "none";
  }
  const clearInput = (input) => {
    input.value = "";
    dispatchInputEvent({ input, events: ["input", "change"] });
  };
  clearInput(input);
  input.focus();
  let inputValue;
  let maxTry = 10;
  const tryInput = async () => {
    inputValue = await inputKeys({ input, key: "coolsnake303", method: "focus" });
    if (inputValue === "coolsnake303") return inputValue;
    if (maxTry <= 0) return false;
    maxTry--;
    return tryInput();
  }
  await tryInput();
  const root = team_players_inner();
  if (!are(root, HTMLElement)) return;
  const memeBtn = await waitForElement({
    el: root,
    sel: team_players_inner_meme_btn(side),
  });
  if (!are(memeBtn, HTMLElement)) return;
  dispatchEvent({ el: memeBtn, events: ["click"] });
  setTimeout(() => clearInput(input), 80);
  return true;
};

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
  if (qs("i", clone)) return qs("i", clone).textContent.trim();
  qsa("b, bdi, span, .user-badge-small, .replyBtn", clone).forEach((n) =>
    n.remove(),
  );
  const text = clone.textContent?.trim();
  if (!text) return null;
  return text.startsWith(":") ? text.slice(1).trim() : text;
};

export const getLatestChat = (pastIndex) => {
  const chatContent = chat_content();
  if (!chatContent) return null;
  const latestChat = pastIndex ? chatContent.children[pastIndex] : chatContent.lastElementChild;
  if (!latestChat) return null;
  return {
    element: latestChat,
    role: extractChatRole(latestChat),
    username: extractChatUsername(latestChat),
    badges: extractChatBadges(latestChat),
    message: extractChatMessage(latestChat),
  };
};

let chatQueue = [];
let isSendingChat = false;
let lastChatAt = 0;
const processChatQueue = async () => {
  if (isSendingChat) return false;
  isSendingChat = true;
  while (chatQueue.length > 0) {
    const finalMessage = chatQueue.shift();
    if (!finalMessage) continue;
    const waitMs = Math.max(0, 2000 - (Date.now() - lastChatAt));
    if (waitMs > 0) await sleep(waitMs);
    const input = chat_input();
    if (!are(input, HTMLInputElement)) continue;
    const chat = chat_container();
    if (!are(chat, HTMLElement)) continue;
    const isClosed = chat.classList.contains("closed");
    if (isClosed) chat.classList.remove("closed");
    input.focus();
    input.value = finalMessage;
    const sendBtn = chat_send_btn();
    if (!are(sendBtn, HTMLElement)) continue;
    sendBtn.click();
    lastChatAt = Date.now();
  }
  isSendingChat = false;
  return true;
};
export const sendChat = async (...message) => {
  if (message.length === 0) return false;
  const finalMessage = message.join(" ").trim();
  if (!finalMessage) return false;
  chatQueue.push(finalMessage);
  processChatQueue();
  return true;
};
window.sendChat = sendChat;

export const isCurrentPlayerCaptain = async () => {
  await sendChat("/kick ");
  const chat = getLatestChat(7);
  return chat?.message === "You don't have permission to do that.";
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
    const infoTd = td[1];
    const actionTd = td[4];
    const name = qs("code", infoTd)?.textContent.trim() || "";
    const online = td[0]?.textContent.trim() === "1";
    const play = toSec(td[3]?.textContent.trim() || "0:00");
    const infoText = infoTd?.textContent.toLowerCase() || "";
    const owner = infoText.includes("ship owner");
    const aliasBanned = infoText.includes("[banned]");
    const banned = !!qs("b", actionTd)?.textContent.match(/banned/i);
    let captainLevel = 0;
    let rank = "guest";
    const rankBold = qs("b", actionTd)?.textContent.trim() || "";
    const rankSelect = qs("select", actionTd);
    const capMatch = rankBold.match(/captain\s*\[(\d+)\]/i);
    if (capMatch) captainLevel = Number(capMatch[1]);
    if (banned) rank = "banned";
    else if (owner) rank = "owner";
    else if (capMatch) rank = "captain";
    else if (rankSelect) {
      const val = rankSelect.value;
      rank = val === "3" ? "captain" : val === "1" ? "crew" : "guest";
    }
    return { r, name, online, play, rank, banned, owner, captainLevel, aliasBanned };
  });

export const isDuplicatedText = (text) => {
  const half = text.length / 2;
  const isDuplicate = text.slice(0, half) === text.slice(half);
  return {
    text: isDuplicate ? text.slice(0, half) : text,
    boolean: isDuplicate,
  };
};