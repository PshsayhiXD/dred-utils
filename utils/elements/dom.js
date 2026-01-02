/**
 * Creates a DOM element with specified attributes and properties.
 * @param {string} tag - The HTML tag name for the element to create.
 * @param {Object} options - An object containing attributes and properties to set on the element.
 * @returns {HTMLElement} The created DOM element.
 */
export const createElement = (tag, options = {}) => {
  const element = document.createElement(tag);
  Object.entries(options).forEach(([key, value]) => {
    if (key in element) element[key] = value;
    else element.setAttribute(key, value);
  });
  return element;
};

/**
 * Creates a button element with specified id, text, and additional options.
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
 * Creates a select element with specified id and additional options.
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