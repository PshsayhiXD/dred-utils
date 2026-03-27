import { getFile, saveFile, getAllFiles } from "../../storage/OPFS.js";

const NS = "badges";
const userKey  = (user) => `${NS}/users/${user}`;
const REGISTRY = `${NS}/registry.json`;

export const getAllUserBadges = async () => {
  const files = await getAllFiles();
  const prefix = `${NS}/users/`;
  const result = [];
  files.forEach(f => {
    if (!f.id.startsWith(prefix)) return;
    const user = f.id.slice(prefix.length);
    try {
      const badges = JSON.parse(f.content);
      badges.forEach(b =>
        result.push({ user, img: b.img, description: b.description })
      );
    } catch {}
  });

  return result;
};

export const saveUserBadges = async (user, badges) =>
  saveFile(userKey(user), JSON.stringify(badges));

export const getUserBadges = async (user) => {
  const content = await getFile(userKey(user));
  if (!content) return [];
  try {
    return JSON.parse(content);
  } catch {
    return [];
  }
};

export const getUserBadge = async (user, index) => {
  const badges = await getUserBadges(user);
  return badges[index] ?? null;
};

export const registerBadge = async (id, imgUrl, description) => {
  imgUrl =
    imgUrl === "none" || imgUrl === "default"
      ? "https://64.media.tumblr.com/07021dba2b03e3fae169a8f8132c23b6/e9f5454ebbbd431c-e8/s250x400/4503e4a8ea5a869224698f0e8220bef575c5178c.pnj"
      : imgUrl;
  description =
    description === "none" || description === "default"
      ? "dredUtils"
      : description;

  const fileData = await getFile(REGISTRY);
  const badges = fileData ? JSON.parse(fileData) : {};
  badges[id] = { id, imgUrl, description };
  await saveFile(REGISTRY, JSON.stringify(badges));
};

export const getRegisteredBadge = async (id) => {
  const fileData = await getFile(REGISTRY);
  if (!fileData) return null;
  return JSON.parse(fileData)[id] ?? null;
};

export const getAllRegisteredBadges = async () => {
  const fileData = await getFile(REGISTRY);
  return fileData ? JSON.parse(fileData) : {};
};

export const isThisBadgeRegistered = async (id) => {
  const fileData = await getFile(REGISTRY);
  if (!fileData) return false;
  return !!JSON.parse(fileData)[id];
};