import { onDispatch } from "../../bridge/pageBridge.js";
import { server_section, server_select } from "../../utils/constants.js";
import { createServerCards } from "./elements/serverUi.js";

onDispatch("dredutils:shipyardShips", () => {
  const s1 = server_section();
  const s2 = server_select();
  if (!s1 || !s2) return;
  const { serverCards, id } = createServerCards();
  if (s1.querySelector(`#${id}`)) return;
  s1.insertBefore(serverCards, s2);
  s2?.addEventListener("change", () => {
    const { serverCards, id } = createServerCards();
    const existing = s1.querySelector(`#${id}`);
    if (existing) existing.replaceWith(serverCards);
    else s1.insertBefore(serverCards, s2);
  });
});
