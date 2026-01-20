import { getUserTagStyles } from "./styleDB.js";
import {
  renderLatestChatUserStyle,
  renderTeamMenuTagStyle
} from "./renderStyle.js";
import { getLatestChat } from "../../utils/drednot.js";
import { bindOnce } from "../../utils/helper.js";
import {
  team_manager_button,
  team_menu_crew_control_btn,
  team_players_inner
} from "../../utils/constants.js";
import { addListener } from "../../bridge/pageBridge.js";

addListener("domMutated", async () => {
  const latest = await getLatestChat();
  if (!latest?.username) return;
  const styles = await getUserTagStyles(latest.username);
  if (!styles.length) return;
  await renderLatestChatUserStyle(styles.map(name => ({ name })));
}, "chatContent");

addListener("domMutated", async () => {
  const btn = team_manager_button();
  if (!btn) return;
  bindOnce(btn, async () => {
    await renderTeamMenuTagStyle();
    console.log("rendered");
  });
}, "teamMenuContainer");