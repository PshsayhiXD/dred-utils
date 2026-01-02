"use strict";

/**
 * Default config (unchangeable metadata in package.json).
 * Will default to these value if storage didn't exist: key | value.
 * @readonly
 */
export const defaultConfig = {
  PLUGIN: {
    fakebadge: {
      enabled: true,
    },
    customusertag: {
      enabled: true,
    },
    motdbackup: {
      enabled: true,
    }
  },
};

/**
 * Get config from storage.
 * @async
 * @returns {Promise<Object>} The resolved config object.
 */
export const getConfig = async () => {
  return await chrome.storage.local.get(defaultConfig);
};

/**
 * Update config values.
 * @async
 * @param {Object} values The config values to update.
 * @returns {Promise<void>} Resolves after update.
 */
export const setConfig = async (values) => {
  await chrome.storage.local.set(values);
};