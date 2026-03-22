import { createElement } from "./dom.js";

let toastContainer = null;

const getContainer = () => {
  if (toastContainer && document.body.contains(toastContainer)) return toastContainer;
  toastContainer = createElement("div", { className: "toast-container" });
  document.body.appendChild(toastContainer);
  return toastContainer;
};

/**
 * Shows a modern toast notification.
 * @param {string} message Text to display.
 * @param {Object} [opts]
 * @param {number} [opts.duration=3000] Auto-dismiss time in ms.
 * @param {"info"|"success"|"error"|"warning"} [opts.type="info"] Toast style.
 * @param {boolean} [opts.dismissible=true] Whether the toast has a close button.
 */
export const showToast = (message, { duration = 3000, type = "info", dismissible = true } = {}) => {
  const container = getContainer();

  const toast = createElement("div", {
    className: `toast toast--${type}`,
  });

  const contentWrap = createElement("div", { className: "toast-content-wrapper" });

  const icons = {
    info: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`,
    success: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`,
    error: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`,
    warning: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`
  };

  const iconContainer = createElement("div", { 
    className: "toast-icon",
    innerHTML: icons[type] || icons.info 
  });

  const textNode = createElement("div", { 
    className: "toast-message",
    textContent: message 
  });

  contentWrap.appendChild(iconContainer);
  contentWrap.appendChild(textNode);
  toast.appendChild(contentWrap);

  let closeBtn;
  if (dismissible) {
    closeBtn = createElement("button", {
      className: "toast-close-btn",
      innerHTML: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`
    });
    toast.appendChild(closeBtn);
  }

  const progress = createElement("div", { className: "toast-progress" });
  const progressBar = createElement("div", { className: "toast-progress-bar" });
  progress.appendChild(progressBar);
  toast.appendChild(progress);

  container.appendChild(toast);

  let timeoutId;
  let startTime;
  let remaining = duration;
  let isExiting = false;

  const removeToast = () => {
    if (isExiting) return;
    isExiting = true;
    toast.classList.remove("toast--visible");
    toast.classList.add("toast--exit");
    toast.addEventListener("transitionend", () => {
      if (toast.parentNode) toast.remove();
    }, { once: true });
    setTimeout(() => { if (toast.parentNode) toast.remove(); }, 300);
  };

  if (dismissible && closeBtn) {
    closeBtn.addEventListener("click", () => {
      clearTimeout(timeoutId);
      removeToast();
    });
  }

  const pauseTimer = () => {
    if (isExiting) return;
    progressBar.style.animationPlayState = "paused";
    clearTimeout(timeoutId);
    remaining -= (Date.now() - startTime);
  };

  const resumeTimer = () => {
    if (isExiting || remaining <= 0) return;
    progressBar.style.animationPlayState = "running";
    startTime = Date.now();
    timeoutId = setTimeout(removeToast, remaining);
  };

  toast.addEventListener("mouseenter", pauseTimer);
  toast.addEventListener("mouseleave", resumeTimer);

  requestAnimationFrame(() => {
    toast.classList.add("toast--visible");
    progressBar.style.animation = `progress-shrink ${duration}ms linear forwards`;
    startTime = Date.now();
    timeoutId = setTimeout(removeToast, duration);
  });
};
