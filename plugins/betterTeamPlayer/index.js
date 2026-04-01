import { renderOverview } from "./elements/renderOverview.js";
import { mountCoolsnake303Btns } from "./elements/coolsnake303Btn.js";
import {
  team_players_inner_tbody,
  team_manager_button,
  team_menu_crew_control_btn
} from "../../utils/constants.js";
import { bindForeverOnce, are } from "../../utils/elements/dom.js";

const openOverview = () => {
  const tbody = team_players_inner_tbody();
  if (!are(tbody, HTMLElement)) return;
  renderOverview(tbody);
  mountCoolsnake303Btns();
};

const bindOverview = (btn) => {
  if (!are(btn, HTMLElement)) return;
  bindForeverOnce(btn, "click", openOverview);
};

(() => {
  bindOverview(team_manager_button());
  bindOverview(team_menu_crew_control_btn());
})();