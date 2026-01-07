import { colors } from "../../utils/constants.js";

/**
 * Filter and UI state for betterTeamPlayer feature.
 * @type {Object}
 * @property {boolean} online - Filter online only.
 * @property {string} rank - Filter by rank ("all","owner","captain","crew","guest","banned").
 * @property {string} search - Search term for names.
 * @property {boolean} highlight - Whether to highlight borders.
 * @property {boolean} dimOffline - Dim offline players.
 */
export const state = { online:false, rank:"all", search:"", highlight:true, dimOffline:true };

/**
 * Apply state filters to crew table rows.
 * @param {Array<Object>} data - Array of row data from collectRows().
 */
export const applyState = (data) => {
  data.forEach(d => {
    const r = d.r;
    const hide =
      (state.online && !d.online) ||
      (state.rank !== "all" && d.rank !== state.rank) ||
      (state.search && !d.name.toLowerCase().includes(state.search));
    const display = hide ? "none" : "";
    if (r.style.display !== display) r.style.display = display;
    let border = "";
    let opacity = "";
    if (d.banned) {
      if (state.highlight) border = `4px solid ${colors.banned}`;
      opacity = "0.45";
    } else if (!d.online) {
      if (state.highlight) border = `4px solid ${colors.offline}`;
      if (state.dimOffline) opacity = "0.45";
    } else if (state.highlight) border = `4px solid ${colors[d.rank]}`;
    if (r.style.borderLeft !== border) r.style.borderLeft = border;
    if (r.style.opacity !== opacity) r.style.opacity = opacity;
  });
};