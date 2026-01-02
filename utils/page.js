export const pageUrl = () => {
  return window.location.href;
};

export const getPageTitle = () => {
  return document.title || "Untitled Page";
};

export const setPageTitle = (title) => {
  document.title = title;
};