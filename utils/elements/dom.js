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
 * Creates a DOM element with attributes and properties.
 * @param {string} tag - The HTML tag name for the element to create.
 * @param {Object} options - An object attributes and properties to set on the element.
 * @returns {HTMLElement} The created DOM element.
 */
export const createElement = (tag, options = {}) => {
  const element = document.createElement(tag);

  Object.entries(options).forEach(([key, value]) => {
    if (key === "dataset" && typeof value === "object") Object.entries(value).forEach(([k, v]) => element.dataset[k] = v);
    else if (key === "style" && typeof value === "string") element.style.cssText = value;
    else if (key in element) element[key] = value;
    else element.setAttribute(key, value);
  });
  return element;
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