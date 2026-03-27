import { createSwitchAccountBtn } from "./elements/switchAccountBtn.js";
import { account_section } from "../../utils/elements/constants.js";
import { are } from "../../utils/elements/dom.js";
import { onDispatch } from "../../bridge/pageBridge.js";

onDispatch("dredutils:windowDark", async () => {
  const as = account_section();
  if (!are(as, HTMLElement)) return;
  const { container, id, localLogoutBtn, initMenu } = await createSwitchAccountBtn();
  if (as.querySelector(`#${id}`)) return;
  const p = as.querySelectorAll("p")[2];
  if (!p) return;
  const form = p.querySelector("form");
  if (form) {
    p.insertBefore(container, form);
    p.insertBefore(localLogoutBtn, form);
    form.style.display = "none";
    initMenu();
  } else {
    p.appendChild(container);
    p.appendChild(localLogoutBtn);
    initMenu();
  }
});