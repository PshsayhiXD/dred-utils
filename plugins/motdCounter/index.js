import { motd_discard_btn } from "../../../utils/constants.js";
import { createMotdCounter } from "./elements/textIndicator.js";

(async () => {
  const discardButton = await motd_discard_btn();
  if (!discardButton) return;
  const res = await createMotdCounter();
  if (!res) return;
  const { counter } = res;
  if (!counter.isConnected) discardButton.after(counter);
})();