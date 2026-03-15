import { injectPageCSS } from "./bridge/injector.js";
import { startMutationObserver } from "./bridge/pageMain.js";
import { 
  chat_container, motd_container, 
  server_section, team_menu_container,
  window_dark_container, shipyard_ships
} from "./utils/constants.js";
import { PLUGIN_LIST, loadPlugins } from "./utils/plugins.js";

// PLUGINS START
const plugins = await PLUGIN_LIST();
await loadPlugins(plugins);
// PLUGINS END

// OBSERVE STARTS
await startMutationObserver(await chat_container(), { from: "chatContent" });
await startMutationObserver(motd_container, { from: "motdContainer" });
await startMutationObserver(await server_section(), { from: "serverSection" });
await startMutationObserver(shipyard_ships(), { from: "shipyardShips" });
await startMutationObserver(window_dark_container(), { from: "windowDark" });
startMutationObserver(await team_menu_container(), { from: "teamMenuContainer" }).then(console.log);
// OBSERVE ENDS