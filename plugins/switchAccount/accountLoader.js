import { getAccount } from "./switchAccountDB.js";
import { sendToBackground } from "../../bridge/pageBridge.js";

/**
 * Retrieves the current game_session cookie.
 * @async
 * @returns {Promise<string|null>} The cookie value or null if missing.
 */
export const getCurrentSession = () => sendToBackground("ext:getSession");

/**
 * Sets the game_session cookie.
 * @async
 * @param {string} token The session token.
 * @returns {Promise<boolean>} True if cookie set successfully.
 */
export const setSession = token => sendToBackground("ext:setSession", { token });

/**
 * Reloads all Drednot tabs.
 * @async
 * @returns {Promise<boolean>} True after reload request.
 */
export const reloadGameTabs = () => sendToBackground("ext:reloadTabs");

/**
 * Switches to a saved account.
 * @async
 * @param {string} name The account label.
 * @returns {Promise<boolean>} True if switch succeeded.
 */
export const switchAccount=async name=>{
  const token=await getAccount(name);
  if(!token)return false;
  await setSession(token);
  //await reloadGameTabs();
  return true;
};
