const metaContext = require.context("../plugins", true, /package\.json$/);
const pluginContext = require.context("../plugins", true, /\/index\.js$/);

/**
 * Loads and executes enabled plugins from the bundle.
 * @param {string[]} plugins - List of enabled plugin IDs.
 */
export const runPlugins = (plugins) => {
  if (!Array.isArray(plugins)) return;
  console.log("[PLUGINS] Running bundled plugins from page context...");
  for (const dir of plugins) {
    try {
      const meta = metaContext(`./${dir}/package.json`);
      const mains = [].concat(meta.main || meta.index || []);
      for (const m of mains) {
        pluginContext(`./${dir}/${m}`);
      }
    } catch (err) {
      console.error(`[PLUGINS] Failed to run plugin ${dir}:`, err);
    }
  }
};

window.dispatchEvent(new CustomEvent("dred:pluginsReady"));

window.addEventListener("dred:initPlugins", (e) => {
  console.log("[PLUGINS] Initialization received, running plugins...");
  runPlugins(e.detail);
}, { once: true });
