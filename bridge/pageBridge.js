"use strict";

const listeners = new Map();

const matches = (pattern, value) => {
  if (!pattern || pattern === "*") return true;
  if (value == null) return false;
  if (pattern === value) return true;
  if (pattern.endsWith(":*")) return value.startsWith(pattern.slice(0, -1));
  if (pattern.endsWith("*")) return value.startsWith(pattern.slice(0, -1));
  return false;
};

export const on = (type, callback, from = null) => {
  if (!listeners.has(type)) listeners.set(type, []);
  const entry = { callback, from };
  listeners.get(type).push(entry);
  return () => {
    const list = listeners.get(type);
    if (!list) return;
    const i = list.indexOf(entry);
    if (i !== -1) list.splice(i, 1);
    if (!list.length) listeners.delete(type);
  };
};

export const onDispatch = (type, callback, el = window, from = null) => {
  const handler = e => {
    callback(e.detail, e);
  };
  el.addEventListener(type, handler);
  return () => el.removeEventListener(type, handler);
};

export const emit = (type, payload = {}, from = null) => {
  for (const [pattern, list] of listeners) {
    if (!matches(pattern, type)) continue;
    list.forEach(entry => {
      if (!matches(entry.from, from)) return;
      entry.callback(payload, { from, type });
    });
  }
};

export const dispatch = (type, detail = {}) => {
  window.dispatchEvent(new CustomEvent(type, { detail }));
};

export const bridge = (type, payload = {}, from = null) =>
  window.postMessage({ type, payload, from }, "*");

export const request = (type, payload = {}) => new Promise(resolve => {
  const id = Math.random().toString(36).slice(2);
  const handler = e => {
    if (e.source !== window) return;
    if (e.data?.replyTo !== id) return;
    window.removeEventListener("message", handler);
    resolve(e.data.value);
  };
  window.addEventListener("message", handler);
  window.postMessage({ id, type, payload }, "*");
});

window.addEventListener("message", e => {
  if (e.source !== window) return;
  const { type, payload, from } = e.data || {};
  if (!type) return;
  emit(type, payload, from);
});