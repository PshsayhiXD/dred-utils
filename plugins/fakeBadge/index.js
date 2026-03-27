export const addUserBadge = async (user, badgeId) => {
  if (!user || !badgeId) return false;
  const isRegistered = await isThisBadgeRegistered(user, badgeId);
  if (isRegistered) return false;
  const badges = await getUserBadges(user);
  badges.push(badgeId);
  const success = await saveUserBadges(user, badges);
  return success;
};