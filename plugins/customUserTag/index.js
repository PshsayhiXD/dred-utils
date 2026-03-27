import { getUserTagStyles } from "./styleDB.js";
import {
  renderLatestChatUserStyle,
  renderTeamMenuTagStyle
} from "./renderStyle.js";
import { getLatestChat } from "../../utils/drednot.js";
import { bindOnce } from "../../utils/helper.js";
import {
  team_manager_button,
} from "../../utils/constants.js";
import { onDispatch, on } from "../../bridge/pageBridge.js";

on("dredutils:domMutated", async () => {
  const latest = getLatestChat();
  if (!latest?.username) return;
  const styles = await getUserTagStyles(latest.username);
  if (!styles.length) return;
  renderLatestChatUserStyle(styles.map(name => ({ name })));
}, "chatContent");

onDispatch("dredutils:teamMenuContainer", () => {
  const btn = team_manager_button();
  if (!btn) return;
  bindOnce(btn, () => renderTeamMenuTagStyle());
});