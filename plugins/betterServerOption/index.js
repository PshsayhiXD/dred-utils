import { addListener } from "../../bridge/pageBridge.js";
import { server_section, server_select } from "../../utils/constants.js";
import { createServerCards } from "./elements/serverUi.js";

addListener("domMutated", async () => {
  const s1 = await server_section();
  const s2 = await server_select();
  if (!s1 || !s2) return;
  const { serverCards, id } = await createServerCards();
  if (s1.querySelector(`#${id}`)) return;
  s1.insertBefore(serverCards, s2);
  s2?.addEventListener("change", async () => {
    const { serverCards, id } = await createServerCards();
    const existing = s1.querySelector(`#${id}`);
    if (existing) existing.replaceWith(serverCards);
    else s1.insertBefore(serverCards, s2);
  });
}, "serverSection");

