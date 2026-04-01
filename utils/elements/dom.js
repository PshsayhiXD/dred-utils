import { getTrackedListeners } from "./addEventListenerInterceptor.js";

const pathCache = new WeakMap();

export const qs = (selector, root=document) => root.querySelector(selector);
export const qsa = (selector, root=document) => [...root.querySelectorAll(selector)];

export const are = (value, type) => Array.isArray(type)
  ? type.some(t => value instanceof t)
  : value instanceof type;
export const areAll = (values, type) => {
  const list = Array.isArray(values) ? values : [values];
  return list.every(value => are(value, type));
};

export const waitForElement = ({
  el = document,
  sel,
  timeout = 5000,
  settings = { childList: true, subtree: true },
  fallback = () => {},
  callback = () => {}
}) => new Promise(res => {
  const getNode = () => {
    if (!sel) return null;
    if (typeof sel === "string") return el?.querySelector(sel) || document.querySelector(sel);
    if (sel instanceof Element) return sel.isConnected ? sel : null;
    return null;
  };
  const found = getNode();
  if (found) {
    callback(found);
    return res(found);
  }
  const obs = new MutationObserver(() => {
    const node = getNode();
    if (!node) return;
    callback(node);
    obs.disconnect();
    if (timer) clearTimeout(timer);
    res(node);
  });
  obs.observe(el, settings);
  const timer = timeout ? setTimeout(() => {
    obs.disconnect();
    fallback();
    res(null);
  }, timeout) : 0;
});

export const observeNode = (sel, callback, settings = { childList: true, subtree: true, attributes: true, characterData: true, once: false }) => {
  const el = typeof sel === "string" ? document.querySelector(sel) : sel;
  if (!el) return console.warn("[observeNode] Element not found:", sel);
  const { once, ...obsSettings } = settings;
  const obs = new MutationObserver((mutations, observer) => {
    callback(mutations, observer);
    if (once) obs.disconnect();
  });
  obs.observe(el, obsSettings);
  return () => obs.disconnect();
};

export const createElement = (tag, options = {}) => {
  const el = document.createElement(tag);
  Object.entries(options).forEach(([k, v]) => {
    if (k === "dataset" && typeof v === "object") Object.entries(v).forEach(([dk, dv]) => el.dataset[dk] = dv);
    else if (k === "style" && typeof v === "string") el.style.cssText = v;
    else if (k === "append" || k === "children") Array.isArray(v) ? el.append(...v) : el.append(v);
    else if (k in el) el[k] = v;
    else el.setAttribute(k, v);
  });
  return el;
};

export const isFocusAnyInput = (el) =>
  el instanceof HTMLInputElement ||
  el instanceof HTMLTextAreaElement ||
  el?.isContentEditable === true;

export const addEventListener = (el, event, handler) => el.addEventListener(event, handler);

export const getPath = el => {
  if (!are(el, Element)) return null;
  const cached = pathCache.get(el);
  if (cached) return cached;
  const parts = [];
  let n = el;
  while (n && parts.length < 5) {
    let p = n.tagName.toLowerCase();
    if (n.id) p += `#${n.id}`;
    else if (n.classList && n.classList.length) {
      const a = n.classList;
      p += a.length === 1 ? `.${a[0]}` : `.${a[0]}.${a[1]}`;
    }
    parts.unshift(p);
    n = n.parentElement;
  }
  const path = parts.join(">");
  pathCache.set(el, path);
  return path;
};

export const getParentPath = el => {
  const p = el && (el.parentElement || el.parentNode);
  return are(p, Element) ? getPath(p) : null;
};

export const bindForeverOnce = (el, event, handler, opt) => {
  if (!(el instanceof EventTarget) || typeof handler !== "function") return null;
  const has = getTrackedListeners(el).some((l) =>
    l.type === event && (l.fn === handler || l.fn?._handler === handler)
  );
  if (has) return null;
  const wrapper = (...args) => {
    handler(...args);
    el.removeEventListener(event, wrapper, opt);
  };
  wrapper._handler = handler;
  el.addEventListener(event, wrapper, opt);
  return wrapper;
};

export const captureCanvas = (
  canvas,
  scale = 0.5,
  quality = 0.6,
  autoRevoke = false,
) => {
  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      const offscreen = document.createElement("canvas");
      const offCtx = offscreen.getContext("2d");
      offscreen.width = canvas.width * scale;
      offscreen.height = canvas.height * scale;
      offCtx.drawImage(canvas, 0, 0, offscreen.width, offscreen.height);
      offscreen.toBlob(
        (blob) => {
          const url = URL.createObjectURL(blob);
          resolve(url);
          if (autoRevoke) setTimeout(() => URL.revokeObjectURL(url), 5000);
        },
        "image/jpeg",
        quality,
      );
    });
  });
};