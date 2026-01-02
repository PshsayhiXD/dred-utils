import { setUserTagStyles } from "./styleDB.js";
import { renderUserTagStyle } from "./renderStyle.js";
import { team_manager_button } from "../../utils/constants.js";
import { addListener } from "../../bridge/pageBridge.js";

const STYLES = ["rgbtext"];

addListener("domMutated", async () => {
  const resolved = await setUserTagStyles("me", STYLES);
  const apply = () => renderUserTagStyle(resolved, STYLES);
  apply();
  team_manager_button?.addEventListener("click", apply);
}, "chatContent");

