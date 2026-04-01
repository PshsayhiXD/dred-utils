import {
  gravity,
} from "../../utils/drednot.js";
import {
  addEventListener,
  isFocusAnyInput,
} from "../../utils/elements/dom.js";
import { getCurrentShipState } from "../trackJoinedShip/index.js";
const keyMap = {
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowRight: "right",
};

let isBusy = false;

(async () => {
  addEventListener(document, "keydown", async (e) => {
    console.log(e);
    const side = keyMap[e.key];
    if (!side || isBusy || isFocusAnyInput(document.activeElement)) return;
    console.log("side", side);
    if (!getCurrentShipState().isCaptain) return;
    console.log("isCurrentPlayerCaptain", getCurrentShipState().isCaptain);
    isBusy = true;
    try {
      await gravity(side, true);
    } finally {
      console.log("finally")
      isBusy = false;
    }
  });
})();