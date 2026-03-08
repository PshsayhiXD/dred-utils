import { qs, createElement } from "../../utils/elements/dom.js";
import { renderOverview } from "./elements/renderOverview.js";
import {
  team_menu_container,
  team_players_inner_tbody,
  team_players_inner,
  team_manager_button,
  team_menu_crew_control_btn
} from "../../utils/constants.js";

const bound = new WeakSet();

const bindOverview = async btn => {
  if (!(btn instanceof Element) || bound.has(btn)) return;
  const handler = async () => {
    const tbody = await team_players_inner_tbody();
    const menu = await team_menu_container();
    if (!tbody || !menu) return;
    let box = qs("#crew_overview");
    if (!box) {
      box = createElement("div", { id:"crew_overview" });
      const inner = await team_players_inner();
      inner?.parentNode
        ? inner.parentNode.insertBefore(box, inner)
        : menu.appendChild(box);
    }
    renderOverview(box, tbody);
    const crewBtn = await team_menu_crew_control_btn();
    if (crewBtn && !bound.has(crewBtn)) bindOverview(crewBtn);
  };
  btn.addEventListener("click", handler);
  bound.add(btn);
};

(() => {
  bindOverview(team_manager_button());
})();