import { addListener } from "../../bridge/pageBridge.js";
import { attachLoader, detachLoader } from "./elements/loading.js";
import { shipyard_loading } from "../../utils/elements/constants.js";

addListener("domMutated", async () => {
  const div = await shipyard_loading();
  if (!div) return;
  if (div.style.display === "none") detachLoader(div);
  else attachLoader(div);
}, "shipyardShips");

attachLoader(await shipyard_loading());