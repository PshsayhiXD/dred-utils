"use strict";

import { getPath, getParentPath, qsa } from "../utils/elements/dom.js";
import { emit } from "./pageBridge.js";

export const startMutationObserver = async (targets = document.body, cfg = {}) => {
  const { type = "domMutated", from = null, once = false } = cfg;
  if (!targets) return { stop: () => {} };
  if (!Array.isArray(targets)) targets = [targets];
  let stopped = false;
  let waitObserver = null;
  const resolveTargets = () =>
    targets
      .flatMap(t => typeof t === "string" ? [...qsa(t, document)] : [t])
      .filter(t => t instanceof Node);
  let resolvedTargets = resolveTargets();
  if (!resolvedTargets.length) {
    await new Promise(resolve => {
      waitObserver = new MutationObserver(() => {
        if (stopped) return;
        resolvedTargets = resolveTargets();
        if (!resolvedTargets.length) return;
        waitObserver.disconnect();
        waitObserver = null;
        resolve();
      });
      waitObserver.observe(document.documentElement, {
        childList: true,
        subtree: true
      });
    });
  }
  if (stopped) return { stop: () => {} };
  resolvedTargets = resolveTargets();
  if (!resolvedTargets.length) return { stop: () => {} };
  let queued = false;
  let queue = [];
  let suppress = false;
  const observeAll = () =>
    resolvedTargets.forEach(t =>
      observer.observe(t, {
        childList: true,
        subtree: true,
        characterData: true
      })
    );
  const flush = () => {
    if (!queue.length) return;
    const payload = queue.map(m => ({
      kind: m.type,
      target: getPath(m.target),
      parent: getParentPath(m.target),
      attribute: m.attributeName ?? null,
      added: [...m.addedNodes].filter(n => n.nodeType === 1).map(getPath),
      removed: [...m.removedNodes].filter(n => n.nodeType === 1).map(getPath)
    }));
    queue = [];
    emit(`dredutils:${type}`, payload, from);
  };
  const observer = new MutationObserver(mutations => {
    if (suppress || stopped) return;
    queue.push(...mutations);
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      if (stopped) return;
      queued = false;
      suppress = true;
      observer.disconnect();
      try {
        flush();
      } finally {
        suppress = false;
        if (!once && !stopped) {
          resolvedTargets = resolveTargets();
          observeAll();
        }
      }
    });
  });
  observeAll();
  return {
    stop: () => {
      stopped = true;
      observer.disconnect();
      waitObserver?.disconnect();
    }
  };
};