export const createSpinner = () => {
  const spinner = document.createElement("div");
  spinner.className = "loading-spinner";
  return spinner;
};

export const attachLoader = (div) => {
  if (!div || div.querySelector(".loading-spinner")) return;
  div.classList.add("loading-overlay");
  div.insertBefore(createSpinner(), div.firstChild);
};

export const detachLoader = (div) => {
  if (!div) return;
  div.classList.remove("loading-overlay");
  div.querySelector(".loading-spinner")?.remove();
};