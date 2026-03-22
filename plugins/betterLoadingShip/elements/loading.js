const TIPS = [
  "Tip: Use arrow keys to navigate",
  "Tip: Press Enter for chat",
  "Fun fact: Ships can hold 100+ blocks",
  "Tip: Get respect by supporting though patreons",
  "Tip: Check MOTD for ship rules",
];

const randomTip = () => TIPS[Math.floor(Math.random() * TIPS.length)];

const formatTime = (seconds) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
};

let timerInterval = null;

export const attachLoader = (div) => {
  if (!div || div.querySelector(".loading-content")) return;
  div.classList.add("loading-overlay");

  const content = document.createElement("div");
  content.className = "loading-content";

  content.innerHTML = `
    <div class="loading-spinner"></div>
    <h2 class="loading-text">Loading Ship<span class="loading-dots"></span></h2>
    <p class="loading-subtext">Fetching ship data...</p>
    <div class="loading-extras">
      <span class="loading-timer">0s</span>
      <span class="loading-sep">·</span>
      <span class="loading-tip">${randomTip()}</span>
    </div>
  `;

  div.insertBefore(content, div.firstChild);

  let elapsed = 0;
  const timerEl = div.querySelector(".loading-timer");
  const tipEl = div.querySelector(".loading-tip");

  timerInterval = setInterval(() => {
    elapsed++;
    if (timerEl) timerEl.textContent = formatTime(elapsed);
    if (elapsed % 5 === 0 && tipEl) tipEl.textContent = randomTip();
  }, 1000);
};

export const detachLoader = (div) => {
  if (!div) return;
  if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
  div.classList.remove("loading-overlay");
  div.querySelector(".loading-content")?.remove();
};