"use strict";

const pathCache = new WeakMap();

/**
 * Returns a short CSS-like path for an element.
 * @param {Element} el Element to resolve.
 * @returns {string|null} Element path.
 */
export const getPath = el => {
  if (!(el instanceof Element)) return null;
  if (pathCache.has(el)) return pathCache.get(el);
  const parts = [];
  let n = el;
  while (n && parts.length < 5) {
    let p = n.tagName.toLowerCase();
    if (n.id) p += `#${n.id}`;
    else if (n.classList?.length) p += `.${[...n.classList].slice(0, 2).join(".")}`;
    parts.unshift(p);
    n = n.parentElement;
  }
  const path = parts.join(">");
  pathCache.set(el, path);
  return path;
};

/**
 * Returns the parent path of an element.
 * @param {Element} el Element.
 * @returns {string|null} Parent path.
 */
export const getParentPath = el => {
  const p = el?.parentElement || el?.parentNode;
  return p instanceof Element ? getPath(p) : null;
};

/**
 * Starts observing DOM mutations and posts them to the page bridge.
 * @async
 * @param {Element|Array<Element>|string|Array<string>} [targets=document.body] Targets to observe.
 * @param {Object} cfg Configuration object.
 * @param {string} [cfg.type="domMutated"] Message type.
 * @param {string|null} [cfg.from=null] Source identifier.
 * @returns {Promise<Function>} Stop function.
 */
export const startMutationObserver = async (
  targets = document.body,
  cfg = {}
) => {
  const { type = "domMutated", from = null } = cfg;
  if (!targets) return () => {};
  if (!Array.isArray(targets)) targets = [targets];
  targets = targets
    .flatMap(t => typeof t === "string" ? [...document.querySelectorAll(t)] : [t])
    .filter(Boolean);
  if (!targets.length) return () => {};
  let queued = false;
  let queue = [];
  const flush = () => {
    window.postMessage({
      source: chrome.runtime.getManifest().name,
      type,
      from,
      payload: queue.map(m => ({
        kind: m.type,
        target: getPath(m.target),
        parent: getParentPath(m.target),
        attribute: m.attributeName ?? null,
        added: [...m.addedNodes].filter(n => n.nodeType === 1).map(getPath),
        removed: [...m.removedNodes].filter(n => n.nodeType === 1).map(getPath)
      }))
    }, "*");
    queue = [];
  };
  const observer = new MutationObserver(muts => {
    queue.push(...muts);
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      flush();
    });
  });
  targets.forEach(t =>
    observer.observe(t, {
      childList: true,
      subtree: true,
      attributes: true,
      characterData: true
    })
  );
  return () => observer.disconnect();
};
