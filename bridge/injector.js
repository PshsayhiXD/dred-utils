/**
 * Injects a script into the webpage context.
 * @param {string} path - The path to the script file within the extension.
 */
export const injectPageScript = (path) => {
  const now = performance.now();
  const s = document.createElement("script");
  s.src = chrome.runtime.getURL(path);
  s.type = "module";
  s.onload = () => console.log(`[INJECTOR] Injected: ${path} (took ${(performance.now() - now).toFixed(2)}ms)`);
  s.onerror = (e) => console.error(`[INJECTOR] Failed to inject: ${path} ${e.message}`);
  (document.head || document.documentElement).appendChild(s);
};

/**
 * Injects a CSS file into the webpage context.
 * @param {string} path - The path to the CSS file within the extension.
 */
export const injectPageCSS = (path) => {
  const now = performance.now();
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = chrome.runtime.getURL(path);
  link.onload = () => console.log(`[INJECTOR] Injected CSS: ${path} (took ${(performance.now() - now).toFixed(2)}ms)`);
  link.onerror = (e) => console.error(`[INJECTOR] Failed to inject CSS: ${path}`, e);
  (document.head || document.documentElement).appendChild(link);
};