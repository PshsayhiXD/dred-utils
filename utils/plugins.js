"use strict";

import { injectPageScript, injectPageCSS } from "../bridge/injector.js";
import { getConfig, setConfig } from "../storage/config.js";
import { getByPath } from "./helper.js";

const metaContext = require.context("../plugins", true, /package\.json$/);

export const PLUGIN_LIST = () =>
  metaContext.keys().map(k => k.replace(/^\.\//, "").replace(/\/package\.json$/, ""));

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

export const togglePluginState = async (pluginDir) => {
  const config = await getConfig();
  const current = getByPath(config, `PLUGIN.${pluginDir}.enabled`) !== false;
  await setConfig({
    PLUGIN: {
      [pluginDir]: { enabled: !current },
    },
  });
};

export const loadPlugins = async (plugins) => {
  if (!Array.isArray(plugins)) throw new TypeError("[LOADPLUGINS] plugins must be an array.");
  const states = await getPluginStates();
  const enabledPlugins = plugins.filter(dir => states[dir]);
  for (const dir of enabledPlugins) {
    try {
      const meta = metaContext(`./${dir}/package.json`);
      const styles = [].concat(meta.css || []);
      for (const c of styles) injectPageCSS(`plugins/${dir}/${c}`);
    } catch {}
  }

  const signalMainWorld = () => {
    window.dispatchEvent(new CustomEvent("dred:initPlugins", { detail: enabledPlugins }));
  };

  signalMainWorld();
  window.addEventListener("dred:pluginsReady", signalMainWorld);
};