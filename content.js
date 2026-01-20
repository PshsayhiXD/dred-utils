import { injectPageCSS } from "./bridge/injector.js";
import { startMutationObserver } from "./bridge/pageMain.js";
import { chat_container, motd_container, server_section, team_menu_container } from "./utils/constants.js";
import { PLUGIN_LIST, loadPlugins } from "./utils/plugins.js";

// Manually set plugin list in /plugin_list.json pls
// PLUGINS START
const plugins = await PLUGIN_LIST();
await loadPlugins(plugins);
// PLUGINS END

// OBSERVE STARTS
await startMutationObserver(await chat_container(), { from: "chatContent" });
await startMutationObserver(motd_container, { from: "motdContainer" });
await startMutationObserver(server_section(), { from: "serverSection" });
startMutationObserver(await team_menu_container(), { from: "teamMenuContainer" }).then(console.log);
// OBSERVE ENDS