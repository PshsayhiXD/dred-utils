import { showJoiningOverlay, hideJoiningOverlay } from "./elements/joining.js";
import { showToast } from "../../utils/elements/toast.js";
import { on } from "../../bridge/pageBridge.js";

on("dredutils:shipJoinStarted", () => {
  showJoiningOverlay();
});

on("dredutils:shipJoined", () => {
  hideJoiningOverlay();
  showToast("Joined ship successfully", { type: "success" });
});

on("dredutils:shipJoinError", (e) => {
  hideJoiningOverlay();
  showToast("Failed to join ship", { type: "error" });
  console.error("Join error:", e.detail);
});
