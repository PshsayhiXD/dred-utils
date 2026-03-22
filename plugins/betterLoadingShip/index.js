import { addListener } from "../../bridge/pageBridge.js";
import { attachLoader, detachLoader } from "./elements/loading.js";
import { shipyard_loading } from "../../utils/elements/constants.js";
import { showToast } from "../../utils/elements/toast.js";

let wasLoading = false;

addListener("domMutated", async () => {
  const div = await shipyard_loading();
  if (!div) return;
  
  if (div.style.display === "none") {
    if (wasLoading) {
      showToast("Ship loaded", { type: "success" });
      wasLoading = false;
    }
    detachLoader(div);
  } else {
    wasLoading = true;
    attachLoader(div);
  }
}, "shipyardShips");

const initialDiv = await shipyard_loading();
if (initialDiv) {
  attachLoader(initialDiv);
  if (initialDiv.style.display !== "none") {
    wasLoading = true;
  }
}