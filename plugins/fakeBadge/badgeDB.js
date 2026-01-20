import { getFile, saveFile, getAllFiles } from "../../storage/OPFS.js";

/**
 * Retrieves all badges for all users.
 * @returns {Promise<Array<{userId: string, img: string, description: string}>>} Array of badge objects with user IDs.
 */
export const getAllUserBadges = async () => {
  const files = await getAllFiles();
  const result = [];
  files.forEach(f => {
    if (!f.id.startsWith("badges:")) return;
    const user = f.id.slice(7);
    try {
      const badges = JSON.parse(f.content);
      badges.forEach(b =>
        result.push({ user, img: b.img, description: b.description })
      );
    } catch {}
  });
  return result;
};

/**
 * Saves all badges for a user.
 * @param {string} user User identifier.
 * @param {Array} badges Array of badge objects.
 * @returns {Promise<boolean>} Success status.
 */
export const saveUserBadges = async (user, badges) =>
  saveFile(`badges:${user}`, JSON.stringify(badges));

/**
 * Retrieves all badges for a user.
 * @param {string} user User identifier.
 * @returns {Promise<Array<{img: string, description: string}>>} Array of badge objects.
 */
export const getUserBadges = async (user) => {
  const content = await getFile(`badges:${user}`);
  if (!content) return [];
  try {
    return JSON.parse(content);
  } catch {
    return [];
  }
};

/**
 * Retrieves a single badge by index.
 * @param {string} user User identifier.
 * @param {number} index Badge index.
 * @returns {Promise<Object|null>} Badge object or null if not found.
 */
export const getUserBadge = async (user, index) => {
  const badges = await getBadges(user);
  return badges[index] ?? null;
};

/**
 * Registers a new badge.
 * @param {string} id Badge identifier.
 * @param {string} imgUrl Image URL for the badge.
 * @param {string} description Description of the badge.
 * @returns {Promise<void>}
 */
export const registerBadge = async (id, imgUrl, description) => {
  imgUrl = imgUrl === "none" || imgUrl === "default"
    ? "https://64.media.tumblr.com/07021dba2b03e3fae169a8f8132c23b6/e9f5454ebbbd431c-e8/s250x400/4503e4a8ea5a869224698f0e8220bef575c5178c.pnj"
    : imgUrl;
  description = description === "none" || description === "default"
    ? "dredUtils"
    : description;
  let badges = {};
  const fileData = await getFile(`badgeList.json`);
  if (fileData) badges = JSON.parse(fileData);
  badges[id] = { id, imgUrl, description };
  await saveFile(`badgeList.json`, JSON.stringify(badges));
};

/**
 * Retrieves registered badges.
 * @param {string} [id] Badge identifier to retrieve a specific badge.
 * @returns {Promise<Object|Object[]>} Badge object.
 */
export const getRegisteredBadge = async (id) => {
  const fileData = await getFile(`badgeList.json`);
  if (!fileData) return {};
  const badges = JSON.parse(fileData);
  return badges[id] || null;
};

/** Retrieves all registered badges.
 * @returns {Promise<Object>} All registered badges.
 */
export const getAllRegisteredBadges = async () => {
  const fileData = await getFile(`badgeList.json`);
  if (!fileData) return {};
  return JSON.parse(fileData);
};

/**
 * Checks if a badge is registered.
 * @param {string} id Badge identifier.
 * @returns {Promise<boolean>} Registration status.
 */
export const isThisBadgeRegistered = async (id) => {
  const fileData = await getFile(`badgeList.json`);
  if (!fileData) return false;
  const badges = JSON.parse(fileData);
  return !!badges[id];
};