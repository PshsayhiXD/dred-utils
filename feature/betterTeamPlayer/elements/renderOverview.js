import { qs } from "../../../utils/elements/dom.js";
import { colors } from "../../../utils/constants.js";
import { collectTeamPlayer } from "../../../utils/drednot.js";
import { state, applyState } from "../state.js";

const wireFilters = (box, data) => {
  const fOn = box.querySelector("#fOn");
  const fRank = box.querySelector("#fRank");
  const fSearch = box.querySelector("#fSearch");
  const fHi = box.querySelector("#fHi");
  const fDim = box.querySelector("#fDim");
  const fReset = box.querySelector("#fReset");

  fOn.checked = state.online;
  fRank.value = state.rank;
  fSearch.value = state.search;
  fHi.checked = state.highlight;
  fDim.checked = state.dimOffline;

  fOn.addEventListener("change", e => { state.online = e.target.checked; applyState(data); });
  fRank.addEventListener("change", e => { state.rank = e.target.value; applyState(data); });
  fSearch.addEventListener("input", e => { state.search = e.target.value.toLowerCase(); applyState(data); });
  fHi.addEventListener("change", e => { state.highlight = e.target.checked; applyState(data); });
  fDim.addEventListener("change", e => { state.dimOffline = e.target.checked; applyState(data); });

  fReset.addEventListener("click", () => {
    state.online = false;
    state.rank = "all";
    state.search = "";
    state.highlight = false;
    state.dimOffline = false;

    fOn.checked = false;
    fRank.value = "all";
    fSearch.value = "";
    fHi.checked = false;
    fDim.checked = false;

    applyState(data);
  });
};

/**
 * Render the Crew Overview UI
 * @param {HTMLElement} box
 * @param {HTMLElement} tbody
 * @returns {{ element: HTMLElement, id: string }}
 */
export const renderOverview = (box, tbody) => {
  const data = collectTeamPlayer(tbody);

  const total = data.length;
  const online = data.filter(d => d.online).length;
  const owner = data.filter(d => d.owner).length;
  const cap = data.filter(d => d.rank === "captain").length;
  const crew = data.filter(d => d.rank === "crew").length;
  const guest = data.filter(d => d.rank === "guest").length;
  const banned = data.filter(d => d.banned).length;
  const highestCap = Math.max(...data.map(d => d.captainLevel), 0);
  const plays = data.map(d => d.play).filter(Boolean);
  const avg = plays.length ? Math.floor(plays.reduce((a, b) => a + b, 0) / plays.length / 60) : 0;
  const max = Math.floor(Math.max(...plays, 0) / 60);

  box.innerHTML = `
    <div class="crew-overview-title">Crew Overview</div>
    <div class="crew-overview-grid">
      <div><b>Total</b> ${total}</div>
      <div><b style="color:${colors.online}">Online</b> ${online}</div>
      <div><b style="color:${colors.owner}">Owner</b> ${owner}</div>
      <div><b style="color:${colors.banned}">Banned</b> ${banned}</div>
      <div><b style="color:${colors.captain}">Captain</b> ${cap}</div>
      <div><b style="color:${colors.crew}">Crew</b> ${crew}</div>
      <div><b style="color:${colors.guest}">Guest</b> ${guest}</div>
      <div><b>Top Cap</b> [${highestCap}]</div>
      <div><b>Avg</b> ${avg}m</div>
      <div><b>Oldest</b> ${max}m</div>
    </div>
    <div class="crew-overview-filters">
      <label><input type="checkbox" id="fOn"> Online</label>
      <select id="fRank">
        <option value="all">All</option>
        <option value="owner">Owner</option>
        <option value="captain">Captain</option>
        <option value="crew">Crew</option>
        <option value="guest">Guest</option>
        <option value="banned">Banned</option>
      </select>
      <input id="fSearch" placeholder="Search name" type="text">
      <label><input type="checkbox" id="fHi"> Highlight</label>
      <label><input type="checkbox" id="fDim"> Dim offline</label>
      <button id="fReset">Reset</button>
    </div>
  `;

  wireFilters(box, data);
  applyState(data);
  return { element: box, id: box.id };
};
