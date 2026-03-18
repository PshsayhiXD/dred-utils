import { addListener } from "../../bridge/pageBridge.js";
import { createSwitchAccountBtn } from "./elements/switchAccountBtn.js";
import { account_section } from "../../utils/elements/constants.js";

(async () => {
  const as = await account_section();
  if (!as) return;
  const { container, id } = await createSwitchAccountBtn();
  if (as.querySelector(`#${id}`)) return;
  const p = as.querySelectorAll("p")[2];
  if (!p) return;
  const form = p.querySelector("form");
  if (!form) return;
  p.insertBefore(container, form);
})();