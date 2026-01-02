import { chat_content, motd_edit_btn, motd_textarea } from "./constants.js";

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
 * @async
 * @returns {Promise<string|null>} The current ship ID from page.
 */
export const getCurrentShipId = async () => {
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
  motd_edit_btn.click();
  motd_textarea.value = (content);
  saveMotd(true);
  return true;
}