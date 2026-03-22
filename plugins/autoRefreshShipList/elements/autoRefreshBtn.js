import { createElement } from "../../../utils/elements/dom.js";
import { ship_list_refresh_btn, ship_list_section_title, ship_list_section } from "../../../utils/elements/constants.js";
import { onShipJoined } from "../../trackJoinedShip/index.js";

const createAutoRefreshUI = () => {
  const btn = createElement("a", {
    className: "btn btn-small btn-yellow ar-btn-main",
    style: "cursor: pointer; float: right; display: flex; align-items: center; gap: 5px;",
    innerHTML: '<i class="fas fa-sync ar-icon-spin"></i> <span>Auto refresh</span>'
  });

  const header = createElement("div", {
    className: "ar-header",
    style: "display: flex; align-items: center; gap: 8px;",
    innerHTML: '<i class="fas fa-sync"></i> <span>Auto Refresh Settings</span>'
  });

  const toggleBtn = createElement("button", {
    className: "ar-btn-toggle",
    textContent: "Disabled"
  });

  const speedInput = createElement("input", {
    className: "ar-input",
    type: "number",
    step: "0.1",
    min: "0.1",
    value: "0.5"
  });

  const footer = createElement("div", {
    className: "ar-footer",
    textContent: "Interval in seconds"
  });

  const body = createElement("div", {
    className: "ar-body",
    append: [
      createElement("div", {
        className: "ar-row",
        append: [createElement("span", { textContent: "Enabled" }), toggleBtn]
      }),
      createElement("div", {
        className: "ar-row",
        append: [
          createElement("span", { textContent: "Speed" }),
          createElement("div", {
            className: "ar-input-group",
            append: [speedInput, createElement("span", { className: "ar-speed-unit", textContent: "s" })]
          })
        ]
      }),
      footer
    ]
  });

  const panel = createElement("div", {
    className: "ar-panel",
    append: [header, body]
  });

  return { btn, panel, toggleBtn, speedInput };
};

export const initAutoRefresh = async () => {
  const refreshBtn = await ship_list_refresh_btn();
  const title = await ship_list_section_title();
  if (!refreshBtn || !title) return;

  const id = "autoRefreshBtn";
  if (document.getElementById(id)) return;

  const { btn, panel, toggleBtn, speedInput } = createAutoRefreshUI();
  btn.id = id;

  let active = false;
  let intervalMs = 500;
  let timer = null;

  const start = () => {
    if (timer) clearInterval(timer);
    timer = setInterval(async () => {
      const activeElement = document.activeElement;
      const isInputFocused = activeElement && (activeElement.tagName === "INPUT" || activeElement.tagName === "TEXTAREA" || activeElement.isContentEditable);
      
      const section = await ship_list_section();
      const isInternalFocused = section && section.contains(activeElement);

      if (refreshBtn && !refreshBtn.disabled && !isInputFocused && !isInternalFocused) {
        const icon = btn.querySelector(".ar-icon-spin");
        if (icon) {
          icon.classList.remove("spinning");
          void icon.offsetWidth; // Trigger reflow to restart animation
          icon.classList.add("spinning");
        }

        // Use a non-bubbling event to avoid triggering "click outside" listeners at document level
        refreshBtn.dispatchEvent(new MouseEvent("click", {
          view: window,
          bubbles: false,
          cancelable: true
        }));
      }
    }, intervalMs);
    btn.classList.add("active");
    toggleBtn.textContent = "Enabled";
    toggleBtn.classList.add("active");
  };

  const stop = () => {
    if (timer) clearInterval(timer);
    timer = null;
    btn.classList.remove("active");
    toggleBtn.textContent = "Disabled";
    toggleBtn.classList.remove("active");
  };

  toggleBtn.onclick = () => {
    active = !active;
    if (active) start(); else stop();
  };

  onShipJoined(() => {
    if (active) {
      active = false;
      stop();
    }
  });

  speedInput.onchange = () => {
    const val = parseFloat(speedInput.value);
    if (isNaN(val) || val < 0.1) {
      speedInput.value = (intervalMs / 1000).toFixed(1);
      return;
    }
    intervalMs = val * 1000;
    if (active) start();
  };

  const reposition = () => {
    const r = btn.getBoundingClientRect();
    panel.style.left = Math.max(10, r.left - 180) + "px";
    panel.style.top = (r.bottom + 6) + "px";
  };

  btn.onclick = (e) => {
    e.stopPropagation();
    const opening = !panel.classList.contains("open");
    panel.classList.toggle("open", opening);
    if (opening) reposition();
  };

  document.addEventListener("click", (e) => {
    if (!panel.contains(e.target) && e.target !== btn) {
      panel.classList.remove("open");
    }
  });

  refreshBtn.parentNode.insertBefore(btn, refreshBtn.nextSibling);
  document.body.appendChild(panel);
};
