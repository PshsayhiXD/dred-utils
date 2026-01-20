"use strict";

/**
 * @readonly
 */
export const defaultConfig = {
  PLUGIN: {}
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
  const current = await getConfig();
  const merged = {
    ...current,
    PLUGIN: { ...current.PLUGIN, ...values.PLUGIN }
  };
  await chrome.storage.local.set(merged);
};