import { getAllUserFromChat } from "../../../utils/drednot.js";
import { getAllRegisteredBadges } from "../badgeDB.js";
import { createSelect, createElement } from "../../../utils/elements/dom.js";

/**
 * Creates a UI for selecting a user from chat and one of their registered badges.
 * @async
 * @returns {Promise<{userBadgeSelect:HTMLElement,id:string}>} The container element and its id.
 */
export const createAddBadgeSelect = async () => {
  const id = "dredutils-add-badge-select-container";
  const container = createElement("div", {
    id,
    style: "display:flex;flex-direction:column;gap:10px;margin:10px 0;",
  });
  const userSelect = createSelect("user-select", { style: "padding:5px;" });
  const badgeSelect = createSelect("badge-select", {
    style: "padding:5px;",
    disabled: true,
  });
  const mkDefault = (t) =>
    createElement("option", {
      value: "",
      innerText: t,
      disabled: true,
      selected: true,
    });
  userSelect.appendChild(mkDefault("Select a user"));
  badgeSelect.appendChild(mkDefault("Select a badge"));
  const reloadUsers = async () => {
    while (userSelect.children.length > 1)
      userSelect.removeChild(userSelect.lastChild);
    const { usernames } = await getAllUserFromChat();
    usernames.forEach((u) => {
      userSelect.appendChild(
        createElement("option", { value: u, innerText: u })
      );
    });
    badgeSelect.disabled = true;
  };
  container.reloadUsers = reloadUsers;
  await reloadUsers();
  userSelect.addEventListener("change", async () => {
    const v = userSelect.value;
    if (!v) return;
    while (badgeSelect.children.length > 1)
      badgeSelect.removeChild(badgeSelect.lastChild);
    const badges = await getAllRegisteredBadges();
    badges.forEach((b, i) => {
      badgeSelect.appendChild(
        createElement("option", {
          value: b.id || "none",
          innerText: b.description || `Badge ${i + 1}`,
        })
      );
    });
    badgeSelect.disabled = badges.length === 0;
  });
  container.appendChild(userSelect);
  container.appendChild(badgeSelect);
  return { 
    userBadgeSelect: container, 
    id 
  };
};