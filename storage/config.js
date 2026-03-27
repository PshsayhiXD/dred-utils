"use strict";

export const defaultConfig = {
  PLUGIN: {}
};

export const getConfig = async () => {
  return await chrome.storage.local.get(defaultConfig);
};

export const setConfig = async (values) => {
  const current = await getConfig();
  const merged = {
    ...current,
    PLUGIN: { ...current.PLUGIN, ...values.PLUGIN }
  };
  await chrome.storage.local.set(merged);
};