import { showJoiningOverlay, hideJoiningOverlay } from "./elements/joining.js";
import { showToast } from "../../utils/elements/toast.js";


window.addEventListener("dred:shipJoinStarted", () => {
  showJoiningOverlay();
});

window.addEventListener("dred:shipJoined", () => {
  hideJoiningOverlay();
  showToast("Joined ship successfully", { type: "success" });
});

window.addEventListener("dred:shipJoinError", (e) => {
  hideJoiningOverlay();
  showToast("Failed to join ship", { type: "error" });
  console.error("Join error:", e.detail);
});
