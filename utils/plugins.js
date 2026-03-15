"use strict";

import { injectPageScript, injectPageCSS } from "../bridge/injector.js";
import { getConfig, setConfig } from "../storage/config.js";
import { getByPath } from "./helper.js";

const metaContext = require.context("../plugins", true, /package\.json$/);

/**
 * Returns list of plugin directory names.
 * @returns {string[]}
 */
export const PLUGIN_LIST = () =>
  metaContext.keys().map(k => k.replace(/^\.\//, "").replace(/\/package\.json$/, ""));

/**
 * Resolve plugin enabled states from config.
 */
export const getPluginStates = async () => {
  const config = await getConfig();
  const plugins = PLUGIN_LIST();
  const result = {};
  for (const dir of plugins) {
    const userSetting = getByPath(config, `PLUGIN.${dir}.enabled`);
    if (userSetting !== undefined) result[dir] = userSetting;
    else {
      try {
        const meta = metaContext(`./${dir}/package.json`);
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
 */
export const togglePluginState = async (pluginDir) => {
  const config = await getConfig();
  const current = getByPath(config, `PLUGIN.${pluginDir}.enabled`) !== false;
  await setConfig({
    PLUGIN: {
      [pluginDir]: { enabled: !current },
    },
  });
};

/**
 * Loads and injects enabled plugins based on their metadata.
 */
export const loadPlugins = async (plugins) => {
  if (!Array.isArray(plugins)) throw new TypeError("[LOADPLUGINS] plugins must be an array.");
  const states = await getPluginStates();
  for (const dir of plugins) {
    if (!states[dir]) continue;
    try {
      const meta = metaContext(`./${dir}/package.json`);
      const mains = [].concat(meta.main || meta.index || []);
      const styles = [].concat(meta.css || []);
      for (const m of mains) injectPageScript(`plugins/${dir}/${m}`);
      for (const c of styles) injectPageCSS(`plugins/${dir}/${c}`);
    } catch {}
  }
};