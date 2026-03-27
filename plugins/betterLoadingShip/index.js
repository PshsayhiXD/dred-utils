import { onDispatch } from "../../bridge/pageBridge.js";
import { attachLoader, detachLoader } from "./elements/loading.js";
import { shipyard_loading } from "../../utils/elements/constants.js";
import { showToast } from "../../utils/elements/toast.js";
import { are } from "../../utils/elements/dom.js";

let wasLoading = false;

onDispatch("dredutils:shipyardShips", () => {
  const div = shipyard_loading();
  if (!are(div, HTMLElement)) return;
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
});

const initialDiv = shipyard_loading();
if (are(initialDiv, HTMLElement)) {
  attachLoader(initialDiv);
  if (initialDiv.style.display !== "none") wasLoading = true;
}