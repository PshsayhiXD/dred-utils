"use strict";

const listeners = new Map();

/**
 * Adds a listener for a specific message type to the page bridge.
 * @param {string} type The type of message to listen for.
 * @param {Function} callback The callback function to execute.
 * @param {string|null} [from=null] Optional source identifier filter.
 * @returns {Function} Cleanup function to remove the listener.
 */
export const addListener = (type, callback, from = null) => {
  if (!listeners.has(type)) listeners.set(type, []);
  const entry = { callback, from };
  listeners.get(type).push(entry);
  return () => {
    const list = listeners.get(type);
    if (!list) return;
    const i = list.indexOf(entry);
    if (i !== -1) list.splice(i, 1);
  };
};

/**
 * Posts a message to the page bridge.
 * @param {Object} message Message payload.
 * @param {string|null} [from=null] Optional source identifier.
 * @returns {void}
 */
export const postMessageToPageBridge = (message, from = null) => {
  window.postMessage({ ...message, from }, "*");
};

export const sendToBackground = (type, data = {}) => new Promise(res => {
  const id = Math.random().toString(36);
  const handler = e => {
    if (e.data?.id !== id) return;
    if (!("value" in e.data)) return;
    window.removeEventListener("message", handler);
    res(e.data.value);
  };
  window.addEventListener("message", handler);
  window.postMessage({ type, ...data, id }, "*");
});

window.addEventListener("message", e => {
  if (e.source !== window) return;
  const { type, from: msgFrom, payload } = e.data || {};
  if (!type || !listeners.has(type)) return;
  listeners.get(type).forEach(({ callback, from }) => {
    if (!from || from === msgFrom) callback(payload);
  });
});