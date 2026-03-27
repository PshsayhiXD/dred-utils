import { dispatch, on } from "../bridge/pageBridge.js";
import { getAllFiles } from "../storage/OPFS.js";

const metaContext = require.context("../plugins", true, /package\.json$/);
const pluginContext = require.context("../plugins", true, /\.js$/);
let cachedConfig = {};
let pluginDatabaseNamespaces = {};
let pluginRan = false;
export const getPluginConfig = (pluginId, key, defaultValue) => {
  const path = `PLUGIN.${pluginId}`;
  const fullPath = `${path}.${key}`;
  if (cachedConfig[fullPath]) return cachedConfig[fullPath];
  else if (cachedConfig[path]?.default) return cachedConfig[path].default;
  return defaultValue;
};
export const getPluginData = async (pluginId) => {
  const namespaces = pluginDatabaseNamespaces[pluginId];
  if (!namespaces) return [];
  const prefix = `${namespaces}:`;
  const all = await getAllFiles();
  return all.filter((f) => f.id.startsWith(prefix));
};
export const runPlugins = (plugins) => {
  if (!Array.isArray(plugins))
    return console.warn("[PLUGINS] runPlugins called with non-array:", plugins);
  for (const dir of plugins) {
    try {
      const meta = metaContext(`./${dir}/package.json`);
      const mains = [].concat(meta.main || meta.index || meta.entry || []);
      if (meta.databaseNamespace) {
        typeof meta.databaseNamespace === "string" &&
          (pluginDatabaseNamespaces[meta.id ?? dir] = meta.databaseNamespace);
        Array.isArray(meta.databaseNamespace) &&
          meta.databaseNamespace.forEach(
            (ns) => (pluginDatabaseNamespaces[meta.id ?? dir] = ns),
          );
      }
      if (mains.length === 0) continue;
      for (const m of mains) {
        try {
          const pluginModule = pluginContext(`./${dir}/${m}`);
          if (pluginModule?.default) pluginModule.default(cachedConfig);
        } catch (moduleErr) {
          console.error(`[PLUGINS] Module crash in ${dir}/${m}:`, moduleErr);
        }
      }
    } catch (err) {
      console.error(`[PLUGINS] Failed to run plugin ${dir}:`, err);
    }
  }
};
on("dredutils:initPlugins", (payload) => {
  if (pluginRan) return;
  pluginRan = true;
  console.log("[PLUGINS] Initialization received, running plugins...");
  cachedConfig = payload.config || {};
  runPlugins(payload.plugins || payload);
  dispatch("dredutils:pluginsReady");
});
