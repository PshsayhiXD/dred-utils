export const pageUrl = () => {
  return window.location.href;
};

export const getPageTitle = () => {
  return document.title || "Untitled Page";
};

export const setPageTitle = title => {
  document.title = title;
};

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