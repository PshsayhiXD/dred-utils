import { game_container } from "../constants.js";
import { createIcon } from "./icon.js";

export const createNotification = (text, options = {}) => {

  const defaultOptions = {
    duration: 3500,
    background: "rgba(75, 75, 75, 0.75)",
    color: "#ffffffff",
    width: "400px",
    fontSize: "18px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    type: "info",
    title: "",
    parent: game_container
  };
  const { duration, background, color, width, fontSize, fontFamily, type, title, parent } = Object.assign({}, defaultOptions, options);

  const containerId = "notification-container";
  let container = document.getElementById(containerId);
  if (!container) {
    container = document.createElement("div");
    container.id = containerId;
    Object.assign(container.style, {
      position: "fixed",
      top: "20px",
      left: "50%",
      transform: "translateX(-50%)",
      display: "flex",
      flexDirection: "column",
      gap: "16px",
      zIndex: "9999",
      alignItems: "center",
      pointerEvents: "none"
    });
    parent.appendChild(container);
  }

  const iconMap = {
    info: "circle-info",
    success: "circle-check",
    error: "triangle-exclamation"
  };

  const notification = document.createElement("div");
  Object.assign(notification.style, {
    background,
    color,
    padding: "20px 28px",
    width,
    textAlign: "left",
    borderRadius: "16px",
    boxShadow: "0 12px 30px rgba(255, 255, 255, 0.3)",
    fontFamily,
    fontSize,
    fontWeight: "600",
    opacity: "0",
    transform: "translateY(-60px) scale(0.95)",
    position: "relative",
    transition: "all 0.45s cubic-bezier(0.25, 1, 0.5, 1)",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    gap: "14px",
    backdropFilter: "blur(12px)"
  });

  const iconEl = createIcon(iconMap[type] || "circle-info", { class: "fa-2x", title: type });
  Object.assign(iconEl.style, { flexShrink: "0" });

  const contentEl = document.createElement("div");
  contentEl.innerHTML = title ? `<strong style="font-size:1.1em">${title}</strong><br>${text}` : text;
  Object.assign(contentEl.style, { lineHeight: "1.4" });

  const progress = document.createElement("div");
  Object.assign(progress.style, {
    position: "absolute",
    bottom: "0",
    left: "0",
    height: "5px",
    background: type === "success" ? "#4caf50" : type === "error" ? "#f44336" : type === "warning" ? "#ff9800" : "#2196f3",
    width: "100%",
    transition: `width ${duration}ms linear`
  });

  notification.appendChild(iconEl);
  notification.appendChild(contentEl);
  notification.appendChild(progress);
  container.appendChild(notification);

  requestAnimationFrame(() => {
    notification.style.opacity = "1";
    notification.style.transform = "translateY(0) scale(1)";
    progress.style.width = "0%";
  });

  setTimeout(() => {
    notification.style.opacity = "0";
    notification.style.transform = "translateY(-60px) scale(0.95)";
    notification.addEventListener("transitionend", () => notification.remove());
  }, duration);
};
