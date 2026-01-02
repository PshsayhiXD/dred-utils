/**
 * Creates a FontAwesome icon element.
 * @param {string} name - The name of the FontAwesome icon.
 * @param {Object} [options={}] - Additional options for the icon.
 * @param {string} [options.class] - Additional CSS class to add to the icon.
 * @param {string} [options.title] - Title attribute for the icon.
 * @returns {HTMLElement} The created icon element.
 */
export const createIcon = (name, options = {}) => {
  const el = document.createElement("i");
  el.className = `fa-solid fa-${name}`;
  if (options.class) el.classList.add(options.class);
  if (options.title) el.title = options.title;
  return el;
};