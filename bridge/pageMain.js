"use strict";

const pathCache = new WeakMap();

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

export const getParentPath = el => {
  const p = el?.parentElement || el?.parentNode;
  return p instanceof Element ? getPath(p) : null;
};

/**
 * Starts observing DOM mutations and posts them to the page bridge.
 * Uses disconnect/reconnect to avoid self-triggered observer loops.
 * @async
 * @param {Element|Array<Element>|string|Array<string>} [targets=document.body] Targets to observe.
 * @param {Object} cfg Configuration object.
 * @param {string} [cfg.type="domMutated"] Message type.
 * @param {string|null} [cfg.from=null] Source identifier.
 * @returns {{stop: Function}} Stop function wrapper.
 */
export const startMutationObserver = async (targets = document.body, cfg = {}) => {
  const { type = "domMutated", from = null } = cfg;
  if (!targets) return { stop: () => {} };
  if (!Array.isArray(targets)) targets = [targets];
  targets = targets
    .flatMap(t => typeof t === "string" ? [...document.querySelectorAll(t)] : [t])
    .filter(Boolean);
  if (!targets.length) return { stop: () => {} };

  let queued = false;
  let queue = [];

  const observer = new MutationObserver(mutations => {
    queue.push(...mutations);
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      observer.disconnect();
      flush();
      targets.forEach(t =>
        observer.observe(t, {
          childList: true,
          subtree: true,
          attributes: true,
          characterData: true
        })
      );
    });
  });

  const flush = () => {
    const payload = queue.map(m => ({
      kind: m.type,
      target: getPath(m.target),
      parent: getParentPath(m.target),
      attribute: m.attributeName ?? null,
      added: [...m.addedNodes].filter(n => n.nodeType === 1).map(getPath),
      removed: [...m.removedNodes].filter(n => n.nodeType === 1).map(getPath)
    }));
    queue = [];
    window.postMessage({
      source: chrome.runtime.getManifest().name,
      type,
      from,
      payload
    }, "*");
  };

  targets.forEach(t =>
    observer.observe(t, {
      childList: true,
      subtree: true,
      attributes: true,
      characterData: true
    })
  );

  return { stop: () => observer.disconnect() };
};