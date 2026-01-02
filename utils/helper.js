/**
 * Resolve a dot-path value from an object.
 * @param {Object} obj The source object.
 * @param {string} path The dot-path string.
 * @returns {any} The resolved value or undefined.
 */
export const getByPath = (obj, path) => {
  return path.split(".").reduce((acc, key) => acc?.[key], obj);
};