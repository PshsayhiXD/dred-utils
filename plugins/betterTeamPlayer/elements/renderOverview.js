import { colors, team_menu_container, team_players_inner } from "../../../utils/constants.js";
import { collectTeamPlayer } from "../../../utils/drednot.js";
import { state, applyState } from "../state.js";
import { qs, waitForElement, createElement, areAll } from "../../../utils/elements/dom.js";
import { debounce } from "../../../utils/helper.js";

const getOverviewBox = () => {
  let box = qs("#crew_overview");
  if (box instanceof HTMLDivElement) return box;
  const menu = team_menu_container();
  if (!(menu instanceof HTMLElement)) return null;
  box = createElement("div", { id: "crew_overview" });
  const inner = team_players_inner();
  inner?.parentNode
    ? inner.parentNode.insertBefore(box, inner)
    : menu.appendChild(box);
  return box;
};

const wireFilters = async (box, data) => {
  const fOn = await waitForElement({ el: box, sel: "#fOn" });
  const fRank = qs("#fRank", box);
  const fSearch = qs("#fSearch", box);
  const fHi = qs("#fHi", box);
  const fDim = qs("#fDim", box);
  const fReset = qs("#fReset", box);
  if (!areAll([fOn, fSearch, fHi, fDim], [HTMLInputElement])) return;
  if (!areAll([fRank], [HTMLSelectElement])) return;
  if (!areAll([fReset], [HTMLButtonElement])) return;
  fOn.checked = state.online;
  fRank.value = state.rank;
  fSearch.value = state.search;
  fHi.checked = state.highlight;
  fDim.checked = state.dimOffline;
  fOn.onchange = (e) => {
    state.online = e.target.checked;
    applyState(data);
  };
  fRank.onchange = (e) => {
    state.rank = e.target.value;
    applyState(data);
  };
  fHi.onchange = (e) => {
    state.highlight = e.target.checked;
    applyState(data);
  };
  fDim.onchange = (e) => {
    state.dimOffline = e.target.checked;
    applyState(data);
  };
  const onSearch = debounce((v) => {
    state.search = v;
    applyState(data);
  });
  fSearch.oninput = (e) => onSearch(e.target.value.toLowerCase());
  fReset.onclick = () => {
    state.online = false;
    state.rank = "all";
    state.search = "";
    state.highlight = true;
    state.dimOffline = true;
    fOn.checked = false;
    fRank.value = "all";
    fSearch.value = "";
    fHi.checked = true;
    fDim.checked = true;
    applyState(data);
  };
};

export const renderOverview = async (tbody) => {
  const box = getOverviewBox();
  if (!(box instanceof HTMLDivElement)) return null;
  const data = collectTeamPlayer(tbody);
  box.replaceChildren();
  const title = createElement("div", {
    className: "crew-overview-title",
    innerText: "Crew Overview"
  });
  const grid = createElement("div", { className: "crew-overview-grid" });
  const addStat = (label, value, color) => {
    const b = createElement("b", { innerText: label });
    if (color) b.style.color = color;
    const d = createElement("div");
    d.append(b, ` ${value}`);
    grid.appendChild(d);
  };
  addStat("Total", data.length);
  addStat("Online", data.filter((d) => d.online).length, colors.online);
  addStat("Owner", data.filter((d) => d.owner).length, colors.owner);
  addStat("Banned", data.filter((d) => d.banned).length, colors.banned);
  addStat("Captain", data.filter((d) => d.rank === "captain").length, colors.captain);
  addStat("Crew", data.filter((d) => d.rank === "crew").length, colors.crew);
  addStat("Guest", data.filter((d) => d.rank === "guest").length, colors.guest);
  const filters = createElement("div", { className: "crew-overview-filters" });
  const fOn = createElement("input", { type: "checkbox", id: "fOn" });
  filters.append(createElement("label", { append: [fOn, " Online"] }));
  const fRank = createElement("select", { id: "fRank" });
  ["all", "owner", "captain", "crew", "guest", "banned"].forEach((v) =>
    fRank.appendChild(createElement("option", { value: v, innerText: v[0].toUpperCase() + v.slice(1) }))
  );
  filters.appendChild(fRank);
  filters.appendChild(createElement("input", {
    id: "fSearch",
    type: "text",
    placeholder: "Search name"
  }));
  const fHi = createElement("input", { type: "checkbox", id: "fHi" });
  filters.append(createElement("label", { append: [fHi, " Highlight"] }));
  const fDim = createElement("input", { type: "checkbox", id: "fDim" });
  filters.append(createElement("label", { append: [fDim, " Dim offline"] }));
  filters.appendChild(createElement("button", { id: "fReset", innerText: "Reset" }));
  box.append(title, grid, filters);
  await wireFilters(box, data);
  applyState(data);
  return { element: box, id: box.id };
};