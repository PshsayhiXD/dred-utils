import {
  createElement,
  qs,
  are,
  qsa,
} from "../../../utils/elements/dom.js";
import {
  team_players,
} from "../../../utils/constants.js";
import { gravity } from "../../../utils/drednot.js";

export const mountCoolsnake303Btns = () => {
  const team = team_players();
  if (!are(team, HTMLElement)) return;
  const refreshBtn = qsa("button", team)[0];
  if (!are(refreshBtn, HTMLButtonElement)) return;
  let rowId = "team_players_actions";
  let row = qs(`#${rowId}`, team);
  if (!are(row, HTMLDivElement)) {
    row = createElement("div", {
      id: rowId,
      style: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        flexWrap: "wrap",
      },
    });
    refreshBtn.parentNode?.insertBefore(row, refreshBtn);
    row.appendChild(refreshBtn);
  }
  let boxId = "coolsnake303Box";
  let box = qs(`#${boxId}`, row);
  if (!are(box, HTMLDivElement)) {
    box = createElement("div", {
      id: boxId,
      style: {
        display: "flex",
        gap: "6px",
        flexWrap: "wrap",
        margin: "0",
      },
    });
    row.appendChild(box);
  }

  box.replaceChildren();
  ["up", "down", "left", "right"].forEach((side) => {
    const btn = createElement("button", {
      id: `coolsnake303Btn_${side}`,
      innerHTML: `<i class="fa fa-arrow-${side}"></i>`,
      className: "btn-pink",
    });
    btn.onclick = () => gravity(side);
    box.appendChild(btn);
  });
  return {
    boxId,
    rowId,
    row,
    box,
  };
};
