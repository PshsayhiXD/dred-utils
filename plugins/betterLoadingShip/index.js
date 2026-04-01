import { onDispatch } from "../../bridge/pageBridge.js";
import { attachLoader, detachLoader } from "./elements/loading.js";
import { shipyard_loading } from "../../utils/elements/constants.js";
import { showToast } from "../../utils/elements/toast.js";
import { are } from "../../utils/elements/dom.js";

let wasLoading = false;

const handleSkip = (div) => {
  showToast("Ship loaded", { type: "success" });
  wasLoading = false;
  detachLoader(div);
};

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
    attachLoader(div, () => handleSkip(div));
  }
});

const initialDiv = shipyard_loading();
if (are(initialDiv, HTMLElement)) {
  if (initialDiv.style.display !== "none") {
    wasLoading = true;
    attachLoader(initialDiv, () => handleSkip(initialDiv));
  } else {
    attachLoader(initialDiv);
  }
}