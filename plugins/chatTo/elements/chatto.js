import { createElement } from "../../../utils/elements/dom.js";
import { getAllShipPlayer } from "../../../utils/drednot.js";
const MODES = ["All", "Friends", "Global"];
export const createChatToBtn = (onChange) => {
  let modeIndex = 0;
  let playerIndex = -1;
  let players = [];
  let clickTimer = null;
  const id = "chatto-btn";
  const btn = createElement("button", {
    id,
    class: "transparent",
  });
  const emit = (label, value) => {
    btn.textContent = `[To: ${label}]`;
    onChange?.(value);
  };
  const showMode = () => {
    playerIndex = -1;
    players = [];
    emit(MODES[modeIndex], { mode: MODES[modeIndex], player: null });
  };
  const handleSingleClick = async () => {
    const fresh = (await getAllShipPlayer()).slice().sort();
    if (fresh.length === 0) return showMode();
    if (playerIndex === -1) {
      players = fresh;
      playerIndex = 0;
    } else {
      const seen = new Set(players.slice(0, playerIndex + 1));
      const remaining = fresh.filter(p => !seen.has(p));
      players = [...players.slice(0, playerIndex + 1), ...remaining];
      playerIndex += 1;
    }
    if (playerIndex >= players.length) return showMode();
    emit(players[playerIndex], { mode: null, player: players[playerIndex] });
  };
  const handleDoubleClick = () => {
    playerIndex = -1;
    players = [];
    modeIndex = (modeIndex + 1) % MODES.length;
    emit(MODES[modeIndex], { mode: MODES[modeIndex], player: null });
  };
  btn.addEventListener("click", () => {
    if (clickTimer) {
      clearTimeout(clickTimer);
      clickTimer = null;
      handleDoubleClick();
    } else {
      clickTimer = setTimeout(() => {
        clickTimer = null;
        handleSingleClick();
      }, 220);
    }
  });
  showMode();
  return {
    id,
    btn
  };
};