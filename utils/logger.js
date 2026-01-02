"use strict";

import { getConfig } from "../storage/config.js";

/**
 * Create a namespaced logger.
 * @param {string} scope The logger scope name.
 * @returns {Object} Logger methods.
 */
export const createLogger = (scope) => {
  let enabled = false;
  getConfig().then(cfg => {
    enabled = !!cfg.debug;
  });
  return {
    log: (...args) => enabled && console.log(`[${scope}]`, ...args),
    warn: (...args) => enabled && console.warn(`[${scope}]`, ...args),
    error: (...args) => console.error(`[${scope}]`, ...args)
  };
};