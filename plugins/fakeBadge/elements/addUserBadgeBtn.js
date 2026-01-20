import { createButton } from "../../../utils/elements/dom.js";
import { createAddBadgeSelect } from "./addUserBadgeSelect.js";
import { getUserBadges, saveUserBadges } from "../badgeDB.js";
import { createNotification } from "../../../utils/elements/notifications.js";
/**
 * Creates a button to add a badge to a user selected from chat.
 * When clicked, it shows a UI to select user and badge, then adds the badge to the user.
 * @returns {{addUserBadgeBtn:HTMLButtonElement,id}} The created button.
 */
export const createAddUserBadgeBtn = () => {
  const id = "dredutils-add-user-badge-btn";
  const addUserBadgeBtn = createButton(id, "Add User Badge", {
    className: "dredutils-btn dredutils-btn-primary",
    style: "margin-right: 5px;",
  });
  let selectContainer = null;
  addUserBadgeBtn.addEventListener("click", async () => {
    if (selectContainer) {
      selectContainer.remove();
      selectContainer = null;
      return;
    }
    const { userBadgeSelect } = await createAddBadgeSelect();
    selectContainer = userBadgeSelect;

    const confirmBtn = createButton(
      `dredutils-confirm-add-badge-btn`,
      "Add Badge",
      {
        className: "dredutils-btn dredutils-btn-success",
        style: "margin-top: 10px;",
      }
    );
    confirmBtn.addEventListener("click", async () => {
      const userSelect = selectContainer.querySelector("#user-select");
      const badgeSelect = selectContainer.querySelector("#badge-select");
      const selectedUser = userSelect.value;
      const selectedBadgeIndex = badgeSelect.value;
      if (!selectedUser || selectedBadgeIndex === "")
        return await createNotification(
          "Please select both a user and a badge.",
          { type: "error" }
        );
      const badges = await getUserBadges(selectedUser);
      const selectedBadge = badges[parseInt(selectedBadgeIndex)];
      if (!selectedBadge)
        return await createNotification("Selected badge not found.", {
          type: "error",
        });
      const userBadges = await getUserBadges(selectedUser);
      userBadges.push(selectedBadge);
      await saveUserBadges(selectedUser, userBadges);
      alert(`Badge added to ${selectedUser}!`);
      selectContainer.remove();
      selectContainer = null;
    });
    selectContainer.appendChild(confirmBtn);
    addUserBadgeBtn.insertAdjacentElement("afterend", selectContainer);
  });

  return { userBadgeBtn: addUserBadgeBtn, id };
};