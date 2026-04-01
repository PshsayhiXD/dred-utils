import { createElement } from "../../../utils/elements/dom.js";
import { formatTime } from "../../../utils/helper.js";

const TIPS = [
  "Tip: Use arrow keys to navigate",
  "Tip: Press Enter for chat",
  "Fun fact: Ships can hold 100+ blocks",
  "Tip: Get respect by supporting though patreons",
  "Tip: Check MOTD for ship rules",
];
const randomTip = () => TIPS[Math.floor(Math.random() * TIPS.length)];
let timerInterval = null;
export const attachLoader = (div, onSkip) => {
  if (!div || div.querySelector(".loading-content")) return;
  div.classList.add("loading-overlay");
  const content = createElement("div", { className: "loading-content" });
  content.innerHTML = `
    <div class="loading-spinner"></div>
    <h2 class="loading-text">Loading Ship<span class="loading-dots"></span></h2>
    <p class="loading-subtext">Fetching ship data...</p>
    <div class="loading-extras">
      <span class="loading-timer">0s</span>
      <span class="loading-sep">·</span>
      <span class="loading-tip">${randomTip()}</span>
    </div>
    <button class="loading-skip" style="opacity:0;pointer-events:none" disabled>Click to skip</button>
  `;
  div.insertBefore(content, div.firstChild);
  let elapsed = 0;
  const timerEl = div.querySelector(".loading-timer");
  const tipEl = div.querySelector(".loading-tip");
  const skipBtn = div.querySelector(".loading-skip");
  timerInterval = setInterval(() => {
    elapsed++;
    if (timerEl) timerEl.textContent = formatTime(elapsed);
    if (elapsed % 5 === 0 && tipEl) tipEl.textContent = randomTip();
    if (elapsed >= 10 && skipBtn && skipBtn.disabled) {
      skipBtn.disabled = false;
      skipBtn.style.pointerEvents = "";
      skipBtn.style.opacity = "1";
    }
  }, 1000);
  if (skipBtn && typeof onSkip === "function") {
    skipBtn.addEventListener("click", () => {
      detachLoader(div);
      onSkip();
    }, { once: true });
  }
};

export const detachLoader = (div) => {
  if (!div) return;
  if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
  div.classList.remove("loading-overlay");
  div.querySelector(".loading-content")?.remove();
};