const pathCache = new WeakMap();

/**
 * Query a single DOM element.
 * @param {string} selector - CSS selector string.
 * @param {Document|HTMLElement} [root=document] - Root element to query within.
 * @returns {HTMLElement|null} - The first matching element or null.
 */
export const qs = (selector, root=document) => root.querySelector(selector);

/**
 * Query multiple DOM elements and return as array.
 * @param {string} selector - CSS selector string.
 * @param {Document|HTMLElement} [root=document] - Root element to query within.
 * @returns {HTMLElement[]} - Array of matching elements.
 */
export const qsa = (selector, root=document) => [...root.querySelectorAll(selector)];

/**
 * Waits for an element matching a selector to appear inside a root element.
 * @param {ParentNode} el The root element to observe.
 * @param {string} sel The CSS selector to search for.
 * @param {number} timeout The timeout in milliseconds before resolving null.
 * @returns {Promise<Element|null>} The found element or null if the timeout expires.
 */
export const waitForElement = (el = document, sel, timeout = 0) => new Promise(res => {
  const found = el.querySelector(sel);
  if (found) return res(found);
  const obs = new MutationObserver(() => {
    const node = el.querySelector(sel);
    if (!node) return;
    obs.disconnect();
    if (timer) clearTimeout(timer);
    res(node);
  });
  obs.observe(el, { childList: true, subtree: true });
  const timer = timeout ? setTimeout(() => {
    obs.disconnect();
    res(null);
  }, timeout) : 0;
});

/**
 * Creates a DOM element with attributes and properties.
 * @param {string} tag The HTML tag name for the element to create.
 * @param {Object} options An object attributes and properties to set on the element.
 * @returns {HTMLElement} The created DOM element.
 */
export const createElement = (tag, options = {}) => {
  const el = document.createElement(tag);
  Object.entries(options).forEach(([k, v]) => {
    if (k === "dataset" && typeof v === "object") Object.entries(v).forEach(([dk, dv]) => el.dataset[dk] = dv);
    else if (k === "style" && typeof v === "string") el.style.cssText = v;
    else if (k === "append" || k === "children") Array.isArray(v) ? el.append(...v) : el.append(v);
    else if (k in el) el[k] = v;
    else el.setAttribute(k, v);
  });
  return el;
};

/**
 * Creates a button element with id.
 * @param {string} id - The id attribute for the button.
 * @param {string} text - The inner text for the button.
 * @param {Object} options - Additional attributes and properties for the button.
 * @returns {HTMLButtonElement} The created button element.
 */
export const createButton = (id, text, options = {}) => {
  const btnOptions = { 
    id, 
    innerText: text, 
    ...options 
  };
  return createElement('button', btnOptions);
}

/** 
 * Creates a select element with a id.
 * @param {string} id - The id attribute for the dropdown.
 * @param {Object} options - Additional attributes and properties for the dropdown.
 * @returns {HTMLSelectElement} The created dropdown element.
 */
export const createSelect = (id, options = {}) => {
  const dropdownOptions = {
    id,
    ...options
  };
  return createElement('select', dropdownOptions);
}

/**
 * Adds a close button to a container.
 * @param {HTMLElement} container Target container.
 * @param {Function} onClose Close handler.
 * @returns {HTMLButtonElement} Close button element.
 */
export const addCloseButton = (container, onClose) => {
  const btn = document.createElement("button");
  btn.className = "btn-red";
  btn.innerHTML = '<i class="fas fa-times"></i>';
  btn.onclick = onClose;
  container.appendChild(btn);
  return btn;
};

/**
 * The path is limited to a maximum of five ancestor levels for performance reasons.
 * The result is cached to avoid recomputation for the same element.
 * @param {Element} el The DOM element to generate a path for.
 * @returns {string|null} The generated element path, or null if the input is not a valid Element.
 */
export const getPath = el => {
  if (!(el instanceof Element)) return null;
  const cached = pathCache.get(el);
  if (cached) return cached;
  const parts = [];
  let n = el;
  while (n && parts.length < 5) {
    let p = n.tagName.toLowerCase();
    if (n.id) p += `#${n.id}`;
    else if (n.classList && n.classList.length) {
      const a = n.classList;
      p += a.length === 1 ? `.${a[0]}` : `.${a[0]}.${a[1]}`;
    }
    parts.unshift(p);
    n = n.parentElement;
  }
  const path = parts.join(">");
  pathCache.set(el, path);
  return path;
};

/**
 * Resolves the cached path of an element’s parent node when available.
 * Only Element parents are considered valid.
 * @param {Element|null|undefined} el The DOM element whose parent path should be resolved.
 * @returns {string|null} The generated parent element path, or null if no valid parent exists.
 */
export const getParentPath = el => {
  const p = el && (el.parentElement || el.parentNode);
  return p instanceof Element ? getPath(p) : null;
};