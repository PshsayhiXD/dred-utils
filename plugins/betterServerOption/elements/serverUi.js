import { createElement } from "../../../utils/elements/dom.js";
import { server_select } from "../../../utils/constants.js";

/**
 * @async
 * Creates the server cards container for the server UI.
 * @returns {{serverCards: HTMLElement, id: string}|null} The element and its ID.
 */
export const createServerCards = async () => {
  const s1 = await server_select();
  if (!s1) return null;

  const id = "server-cards-container";
  const wrap = createElement("div", { className: "serverCards", id });

  [...s1.options].forEach(opt => {
    const raw = opt.text.replace(/^\d+\s-\s/, "");
    const [name, players, ping] = raw.split(" - ");
    const [cur, max] = players.split(" / ").map(Number);
    const pingMs = parseInt(ping);
    const fillPct = Math.min((cur / max) * 100, 100);

    const pingClass = pingMs <= 120 ? "good" : pingMs <= 220 ? "mid" : "bad";
    const playerClass = cur / max <= 0.6 ? "good" : cur / max <= 0.85 ? "mid" : "bad";

    const content = createElement("div", {
      className: "serverContent",
      innerHTML: `
        <div class="serverTitle">${name}</div>
        <div class="metaRow">
          <span class="${playerClass}">${cur} / ${max}</span>
          <span class="${pingClass}">${pingMs}ms</span>
        </div>
      `
    });

    const fill = createElement("div", { className: "serverFill", style: `width:${fillPct}%` });

    const card = createElement("div", { className: "serverCard", dataset: { value: opt.value } });
    if (opt.selected) card.classList.add("active");
    card.onclick = () => {
      s1.value = opt.value;
      s1.dispatchEvent(new Event("change", { bubbles: true }));
    };

    card.appendChild(fill);
    card.appendChild(content);
    wrap.appendChild(card);
  });

  return { serverCards: wrap, id };
};