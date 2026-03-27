import { qs, createElement } from "../../utils/elements/dom.js";
import { renderOverview } from "./elements/renderOverview.js";
import {
  team_menu_container,
  team_players_inner_tbody,
  team_players_inner,
  team_manager_button,
  team_menu_crew_control_btn
} from "../../utils/constants.js";
import { areAll } from "../../utils/elements/dom.js";

const bound = new WeakSet();

const bindOverview = btn => {
  if (!areAll([btn], Element)) return;
  const handler = () => {
    const tbody = team_players_inner_tbody();
    const menu = team_menu_container();
    if (!areAll([tbody, menu], HTMLElement)) return;
    let box = qs("#crew_overview");
    if (!box) {
      box = createElement("div", { id:"crew_overview" });
      const inner = team_players_inner();
      inner?.parentNode
        ? inner.parentNode.insertBefore(box, inner)
        : menu.appendChild(box);
    }
    renderOverview(box, tbody);
    const crewBtn = team_menu_crew_control_btn();
    if (typeof crewBtn === HTMLElement && !bound.has(crewBtn)) bindOverview(crewBtn);
  };
  btn.addEventListener("click", handler);
  bound.add(btn);
};

(() => {
  bindOverview(team_manager_button());
})();