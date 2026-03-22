let overlay = null;
let timerInterval = null;

const TIPS = [
  "Tip: Use arrow keys to navigate the ship",
  "Tip: Press Enter for chat",
  "Fun fact: Ships can have up to 100 blocks",
  "Fun fact: The void is not your friend",
  "Tip: Coordinate with your crew for repairs",
  "Tip: Check the MOTD for ship rules",
];

const randomTip = () => TIPS[Math.floor(Math.random() * TIPS.length)];

const formatTime = (seconds) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
};

export const showJoiningOverlay = () => {
  if (overlay) return;

  overlay = document.createElement("div");
  overlay.className = "joining-overlay";

  overlay.innerHTML = `
    <div class="joining-content">
      <div class="joining-spinner"></div>
      <h2 class="joining-text">Joining Ship<span class="joining-dots"></span></h2>
      <p class="joining-subtext">Preparing your canvas...</p>
      <div class="joining-extras">
        <span class="joining-timer">0s</span>
        <span class="joining-sep">·</span>
        <span class="joining-tip">${randomTip()}</span>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);
  requestAnimationFrame(() => overlay.classList.add("joining-overlay--visible"));

  let elapsed = 0;
  const timerEl = overlay.querySelector(".joining-timer");
  const tipEl = overlay.querySelector(".joining-tip");

  timerInterval = setInterval(() => {
    elapsed++;
    if (timerEl) timerEl.textContent = formatTime(elapsed);
    if (elapsed % 5 === 0 && tipEl) tipEl.textContent = randomTip();
  }, 1000);
};

export const hideJoiningOverlay = () => {
  if (!overlay) return;
  if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
  overlay.classList.remove("joining-overlay--visible");
  overlay.classList.add("joining-overlay--hidden");
  overlay.addEventListener("transitionend", () => {
    overlay?.remove();
    overlay = null;
  }, { once: true });

  setTimeout(() => {
    overlay?.remove();
    overlay = null;
  }, 500);
};
