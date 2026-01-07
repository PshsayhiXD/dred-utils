import { team_players_inner_codes } from "../../utils/constants.js";

/**
 * Render rainbow styling on user tags.
 * @param {string} resolvedType The resolved user key.
 * @param {string[]} styles The styles to apply.
 * @returns {void} Applies DOM mutations.
 */
export const renderUserTagStyle = (resolvedType, styles) => {
  const nodes =
    resolvedType === "all"
      ? team_players_inner_codes()
      : [...team_players_inner_codes()].filter((e) =>
          e.textContent.includes(resolvedType)
        );
  nodes.forEach((el, i) => {
    const text = el.dataset.originalText || el.textContent;
    el.dataset.originalText = text;
    el.innerHTML = [...text]
      .map(
        (c, j) =>
          `<span class="${styles.join(" ")}" style="animation-delay:${i * 0.05 + j * 0.05}s;">${c}</span>`
      )
      .join("");
    el.classList.add("rainbow");
  });
};