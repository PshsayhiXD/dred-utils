import {
  observeNode, are,
  addEventListener, captureCanvas, waitForElement
} from "../../utils/elements/dom.js";
import { disconnect_pop_up, canvas } from "../../utils/elements/constants.js";
(async () => {
  if (!canvas) return;
  const popup = await waitForElement({ sel: disconnect_pop_up() });
  if (!are(popup, HTMLElement)) throw new Error("[betterDisconnectPopup] popup not found;");
  const capMs = 350;
  let lastFrameURL = null;
  let rafId = null;
  let lastCapAt = 0;
  let isCapturing = false;
  const clearLastFrame = () => {
    if (!lastFrameURL) return;
    URL.revokeObjectURL(lastFrameURL);
    lastFrameURL = null;
  };
  const clearSnapshotBackground = (popup) => {
    const box = popup?.firstElementChild;
    if (!are(box, HTMLElement)) return;
    box.style.backgroundImage = "";
    box.style.backgroundSize = "";
    box.style.backgroundPosition = "";
    box.style.backgroundRepeat = "";
    box.style.backgroundBlendMode = "";
    box.style.backgroundColor = "";
    box.style.borderRadius = "";
    box.style.padding = "";
    box.style.overflow = "";
    box.dataset.disconnectSnapshot = "";
    log("snapshot background cleared;");
  };
  const isPopupVisible = (popup) =>
    are(popup, HTMLElement) &&
    popup.style.display !== "none" &&
    popup.innerHTML.trim() !== "";
  const injectSnapshot = (popup) => {
    if (!are(popup, HTMLElement)) return;
    if (!lastFrameURL) return;
    const box = popup.firstElementChild;
    const btn = popup.querySelector(".btn-green");
    if (!are(box, HTMLElement)) return;
    if (box.dataset.disconnectSnapshot === "1") return;
    box.style.backgroundImage = `linear-gradient(rgba(0,0,0,.45), rgba(0,0,0,.65)), url("${lastFrameURL}")`;
    box.style.backgroundSize = "contain";
    box.style.backgroundPosition = "center";
    box.style.backgroundRepeat = "no-repeat";
    box.style.backgroundBlendMode = "normal";
    box.style.backgroundColor = "#111";
    box.style.borderRadius = "8px";
    box.style.padding = "12px";
    box.style.overflow = "hidden";
    box.dataset.disconnectSnapshot = "1";
    addEventListener(btn, "click", () => {
      clearSnapshotBackground(popup);
      clearLastFrame();
    }, { once: true });
  };
  const onDisconnect = (popup) => {
    if (!isPopupVisible(popup)) return;
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
    injectSnapshot(popup);
  };
  const tick = async (ts) => {
    if (!rafId) return;
    if (!isCapturing && ts - lastCapAt >= capMs) {
      isCapturing = true;
      lastCapAt = ts;
      try {
        const url = await captureCanvas(canvas);
        if (lastFrameURL) URL.revokeObjectURL(lastFrameURL);
        lastFrameURL = url;
      } catch {} finally {
        isCapturing = false;
      }
    }
    rafId = requestAnimationFrame(tick);
  };
  const startCapturing = () => {
    if (rafId) return;
    rafId = requestAnimationFrame(tick);
  };
  observeNode(popup, () => {
    if (isPopupVisible(popup)) onDisconnect(popup);
    else if (!rafId) {
      clearSnapshotBackground(popup);
      startCapturing();
    }
  }, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["style", "class"],
    once: false,
  });
  if (isPopupVisible(popup)) onDisconnect(popup);
  else startCapturing();
  addEventListener(window, "beforeunload", () => {
    if (rafId) cancelAnimationFrame(rafId);
    clearSnapshotBackground(popup);
    clearLastFrame();
  }, { once: true });
})();