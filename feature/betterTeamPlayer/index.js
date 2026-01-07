import { qs, createElement } from "../../utils/elements/dom.js";
import { renderOverview } from "./elements/renderOverview.js";
import { addListener } from "../../bridge/pageBridge.js";
import { team_menu_container, team_players_inner_tbody, team_players_inner, team_manager_button } from "../../utils/constants.js";

team_manager_button.addEventListener("click", () => {
  const tbody = team_players_inner_tbody();
  if (!team_menu_container || !tbody) return;
  let box = qs("#crew_overview");
  if (!box) {
    box = createElement("div", { id: "crew_overview" });
    const inner = team_players_inner();
    if (inner?.parentNode) inner.parentNode.insertBefore(box, inner);
    else team_menu_container.appendChild(box);
  }
  renderOverview(box, tbody);
});