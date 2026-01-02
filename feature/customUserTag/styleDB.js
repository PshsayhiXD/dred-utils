import { getFile, saveFile } from "../../storage/OPFS.js";
import { getClientUsername } from "../../utils/drednot.js";

/**
 * Save user tag styles.
 * @async
 * @param {string} type The target type.
 * @param {string[]} styles The styles to persist.
 * @returns {Promise<string>} Resolved user key.
 */
export const setUserTagStyles = async (type, styles) => {
  const raw = await getFile("customUserTag") || "[]";
  const list = JSON.parse(raw);
  const resolved =
    type === "me"
      ? await getClientUsername()
      : type;
  const prev = list.find((i) => i.type === resolved);
  await saveFile(
    "customUserTag",
    JSON.stringify(
      list
        .filter((i) => i.type !== resolved)
        .concat({
          type: resolved,
          styles: prev
            ? Array.from(new Set(prev.styles.concat(styles)))
            : styles
        })
    )
  );
  return resolved;
};
