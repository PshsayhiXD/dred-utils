"use strict";

import { getPath, getParentPath } from "../utils/elements/dom.js";

/**
 * Starts observing DOM mutations and posts them to the page bridge.
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

  const resolveTargets = () =>
    targets
      .flatMap(t => typeof t === "string"
        ? [...document.querySelectorAll(t)]
        : [t])
      .filter(t => t instanceof Node);

  let resolved = resolveTargets();

  if (!resolved.length) {
    await new Promise(resolve => {
      const waitObserver = new MutationObserver(() => {
        resolved = resolveTargets();
        if (!resolved.length) return;
        waitObserver.disconnect();
        resolve();
      });

      waitObserver.observe(document.documentElement, {
        childList: true,
        subtree: true
      });
    });
  }

  targets = resolveTargets();
  if (!targets.length) return { stop: () => {} };

  let queued = false;
  let queue = [];
  let suppress = false;

  const observer = new MutationObserver(mutations => {
    if (suppress) return;
    queue.push(...mutations);
    if (queued) return;

    queued = true;

    requestAnimationFrame(() => {
      queued = false;
      suppress = true;
      observer.disconnect();

      try {
        flush();
      } finally {
        suppress = false;

        if (!cfg.once) {
          targets.forEach(t =>
            observer.observe(t, {
              childList: true,
              subtree: true,
              //attributes: true,
              characterData: true
            })
          );
        }
      }
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
      //attributes: true,
      characterData: true
    })
  );

  return { stop: () => observer.disconnect() };
};