import { motd_discard_btn } from "../../utils/constants.js";
import { createMotdCounter } from "./elements/textIndicator.js";
import { are } from "../../utils/elements/dom.js";

(async () => {
  const discardButton = motd_discard_btn();
  if (!are(discardButton, HTMLElement)) return;
  const res = createMotdCounter();
  if (!res) return;
  const { counter } = res;
  if (!counter.isConnected) discardButton.after(counter);
})();