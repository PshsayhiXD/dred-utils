import { 
  isThisBadgeRegistered, 
  saveUserBadges, getUserBadges 
} from "./badgeDB";

/**
 * Adds a badge to a user's registered badges if not already present.
 * @param {string} user User identifier.
 * @param {string} badgeId Badge identifier to add.
 * @returns {Promise<boolean>} True if badge was added, false otherwise.
 */
export const addUserBadge = async (user, badgeId) => {
  if (!user || !badgeId) return false;
  const isRegistered = await isThisBadgeRegistered(user, badgeId);
  if (isRegistered) return false;
  const badges = await getUserBadges(user);
  badges.push(badgeId);
  const success = await saveUserBadges(user, badges);
  return success;
}