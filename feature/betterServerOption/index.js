import { addListener } from "../../bridge/pageBridge.js";
import { server_section, server_select } from "../../utils/constants.js";
import { createServerCards } from "./elements/serverUi.js";

addListener("domMutated", async () => {
  if (!server_section() || !server_select()) return;
  const { serverCards, id } = createServerCards();
  if (server_section().querySelector(`#${id}`)) return;
  server_section().insertBefore(serverCards, server_select());
}, "serverSection");

server_select()?.addEventListener("change", () => {
  const { serverCards, id } = createServerCards();
  const existing = server_section().querySelector(`#${id}`);
  if (existing) existing.replaceWith(serverCards);
  else server_section().insertBefore(serverCards, server_select());
});
