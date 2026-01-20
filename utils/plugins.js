"use strict";

import { injectPageScript, injectPageCSS } from "../bridge/injector.js";
import { getConfig, setConfig } from "../storage/config.js";
import { getByPath } from "./helper.js";

/**
 * Fetch the list of available plugins.
 * @async
 * @returns {Promise<string[]>} List of plugin directory names.
 */
export const PLUGIN_LIST = async () => {
  const data = await fetch(chrome.runtime.getURL("plugin_list.json")).then(r => r.json());
  if (!Array.isArray(data)) throw new TypeError("[PLUGIN_LIST] plugin_list.json must be an array.");
  return data;
};

/**
 * Resolve plugin enabled states from config.
 * @async
 * @returns {Promise<Record<string, boolean>>} Plugin enabled map.
 */
export const getPluginStates = async () => {
  const config = await getConfig();
  const plugins = await PLUGIN_LIST();
  const result = {};
  for (const dir of plugins) {
    const userSetting = getByPath(config, `PLUGIN.${dir}.enabled`);
    if (userSetting !== undefined) result[dir] = userSetting;
    else {
      try {
        const meta = await fetch(chrome.runtime.getURL(`plugins/${dir}/package.json`)).then(r => r.json());
        result[dir] = meta.defaultEnabled !== false;
      } catch {
        result[dir] = true; 
      }
    }
  }
  return result;
};

/**
 * Toggle plugin enabled state via config.
 * @async
 * @param {string} pluginDir The plugin directory name.
 * @returns {Promise<void>} Resolves after toggle.
 */
export const togglePluginState = async (pluginDir) => {
  const config = await getConfig();
  const current = getByPath(config, `PLUGIN.${pluginDir}.enabled`) !== false;
  await setConfig({
    PLUGIN: {
      [pluginDir]: {
        enabled: !current,
      },
    },
  });
};

/**
 * Loads and injects enabled plugins based on their metadata.
 * Supports single or multiple entry scripts and stylesheets.
 * @async
 * @param {Array<string>} plugins - List of plugin directory names.
 * @returns {Promise<void>} Resolves when plugin loading completes.
 */
export const loadPlugins = async (plugins) => {
  if (!Array.isArray(plugins)) throw new TypeError("[LOADPLUGINS] plugins must be an array.");
  const states = await getPluginStates();
  for (const dir of plugins) {
    if (!states[dir]) continue;
    try {
      const meta = await fetch(chrome.runtime.getURL(`plugins/${dir}/package.json`)).then(r => r.json());
      const mains = [].concat(meta.main || meta.index || []);
      const styles = [].concat(meta.css || []);
      for (const m of mains) injectPageScript(`plugins/${dir}/${m}`);
      for (const c of styles) injectPageCSS(`plugins/${dir}/${c}`);
    } catch {}
  }
};