import { colors } from "../../utils/constants.js";

export const state = { online:false, rank:"all", search:"", highlight:true, dimOffline:true };

export const applyState = (data) => {
  const s = state;
  data.forEach(d => {
    const hide =
      (s.online && !d.online) ||
      (s.rank !== "all" && d.rank !== s.rank) ||
      (s.search && !d.name.includes(s.search));
    d.r.hidden = hide;
    d.r.classList.toggle("crew-banned", d.banned && s.highlight);
    d.r.classList.toggle("crew-offline", !d.online && s.highlight);
    d.r.classList.toggle("crew-dim", (!d.online && s.dimOffline) || d.banned);
    if (s.highlight) d.r.style.borderLeftColor = colors[d.banned ? "banned" : d.rank] || "";
    else d.r.style.borderLeftColor = "";
  });
};