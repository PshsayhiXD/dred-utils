import { 
  waitForElement, observeNode, 
  createElement, addEventListener, 
  captureCanvas 
} from "../../utils/elements/dom.js";
import { disconnect_pop_up, canvas } from "../../utils/elements/constants.js";

(async () => {
  if (!canvas) return;
  let lastFrameURL = null;
  let rafId = null;
  const ctx = canvas.getContext("webgl") ?? canvas.getContext("webgl2") ?? canvas.getContext("2d");
  const tick = () => {
    captureCanvas(canvas).then((url) => {
      if (lastFrameURL) URL.revokeObjectURL(lastFrameURL);
      lastFrameURL = url;
    });
    rafId = requestAnimationFrame(tick);
  };
  const startCapturing = () => { if (!rafId) rafId = requestAnimationFrame(tick); };
  const stopCapturing = () => { cancelAnimationFrame(rafId); rafId = null; };
  startCapturing();
  waitForElement({ sel: disconnect_pop_up(), callback: (popup) => {
    stopCapturing();
    const parent = popup.parentElement;
    if (!parent) return;
    injectSnapshot(popup);
    observeNode(parent, (mutations) => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (node.nodeType !== Node.ELEMENT_NODE) continue;
          if (!node.matches?.(disconnect_pop_up())) continue;
          stopCapturing();
          injectSnapshot(node);
        }
      }
      startCapturing();
    }, { childList: true, subtree: false, once: false });
  }});
  const injectSnapshot = (popup) => {
    if (!lastFrameURL) return;
    const img = createElement("img", {
      src: lastFrameURL,
      style: "width: 100%; border-radius: 6px; margin: 10px 0;",
    });
    const btn = popup.querySelector(".btn-green");
    btn?.parentElement.insertBefore(img, btn.parentElement.querySelector("p:last-child"));
    addEventListener(btn, "click", () => {
      URL.revokeObjectURL(lastFrameURL);
      lastFrameURL = null;
    }, { once: true });
  };
})();