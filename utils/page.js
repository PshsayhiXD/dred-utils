/**
 * Returns the current page URL.
 * @returns {string} The full URL of the current page.
 */
export const pageUrl = () => {
  return window.location.href;
};

/**
 * Returns the current page title.
 * Falls back to a default value if the title is empty.
 * @returns {string} The current page title.
 */
export const getPageTitle = () => {
  return document.title || "Untitled Page";
};

/**
 * Sets the document title.
 * @param {string} title The new title to apply to the page.
 * @returns {void} Updates the document title.
 */
export const setPageTitle = title => {
  document.title = title;
};

/**
 * Runs a function once when a page state condition becomes true or times out.
 * @param {() => boolean} check A function that returns true when the page state is ready.
 * @param {Function} fn The function to execute when the condition is met.
 * @param {number} timeoutMs The maximum time to wait before giving up.
 * @returns {void} Stops checking after execution or timeout.
 */
export const runOnPageState = (check, fn, timeoutMs = 5000) => {
  const start = performance.now();
  const loop = () => {
    if (check()) {
      fn();
      return;
    }
    if (performance.now() - start > timeoutMs) return;
    requestAnimationFrame(loop);
  };
  loop();
};