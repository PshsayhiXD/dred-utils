import { getBadges } from "../../utils/badgesDb.js";
import { chat_content, big_ui_container } from "../../utils/constants.js";
import { getClientUsername } from "../../utils/drednot.js";
/**
 * Renders badges in the chat interface.
 * @async
 * @returns {Promise<void>}
 */
export const renderChatBadges = async () => {
  const paragraphs = chat_content.querySelectorAll("p");
  for (const p of paragraphs) {
    const username = p.querySelector("bdi")?.innerText ?? "none";
    if (!username) continue;
    const badges = await getBadges(username);
    badges.forEach((b) =>
      p.insertAdjacentHTML(
        "beforeend",
        `<div class="user-badge"><img src="${b.imgUrl}"><div class="tooltip dark">${b.description}</div></div>`
      )
    );
  }
};

/**
 * Renders badges in the client UI.
 * @async
 * @returns {Promise<void>}
 */
export const renderClientBadges = async () => {
  const client = await getClientUsername();
  const badges = await getBadges(client);
  const target = big_ui_container?.querySelectorAll("section")[1]?.querySelectorAll("p")[1];
  if (!target) return;
  badges.forEach(b =>
    target.insertAdjacentHTML(
      "beforeend",
      `<div class="user-badge"><img src="${b.img}"><div class="tooltip dark">${b.description}</div></div>`
    )
  );
};