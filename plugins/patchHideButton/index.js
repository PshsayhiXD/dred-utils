import { window_dark_container } from "../../utils/constants.js";
import { addListener } from "../../bridge/pageBridge.js";

addListener("domMutated", () => {
  window_dark_container().addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;
    if (btn.textContent === "← Hide Menu") {
      e.preventDefault();
      e.stopImmediatePropagation();
    }
  }, true);
}, "windowDark");
