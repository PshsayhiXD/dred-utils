import { getUserBadges } from "./badgeDB.js";
import { chat_content, big_ui_container } from "../../utils/constants.js";
import { getClientUsername } from "../../utils/drednot.js";

export const renderChatBadges = async () => {
  const chatContent = chat_content();
  const paragraphs = chatContent?.querySelectorAll("p") || [];
  for (const p of paragraphs) {
    const username = p.querySelector("bdi")?.innerText ?? "none";
    if (!username) continue;
    const badges = await getUserBadges(username);
    badges.forEach((b) =>
      p.insertAdjacentHTML(
        "beforeend",
        `<div class="user-badge"><img src="${b.imgUrl}"><div class="tooltip dark">${b.description}</div></div>`
      )
    );
  }
};

export const renderClientBadges = async () => {
  const client = await getClientUsername();
  const badges = await getUserBadges(client);
  const target = big_ui_container?.querySelectorAll("section")[1]?.querySelectorAll("p")[1];
  if (!target) return;
  badges.forEach(b =>
    target.insertAdjacentHTML(
      "beforeend",
      `<div class="user-badge"><img src="${b.img}"><div class="tooltip dark">${b.description}</div></div>`
    )
  );
};