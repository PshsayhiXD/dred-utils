import { injectPageCSS } from "./bridge/injector.js";
import { startMutationObserver } from "./bridge/pageMain.js";
import { 
  chat_container, motd_container, 
  server_section, team_menu_container,
  window_dark_container, shipyard_ships,
  account_section
} from "./utils/constants.js";
import { PLUGIN_LIST, loadPlugins } from "./utils/plugins.js";

// OBSERVE STARTS
await startMutationObserver(await chat_container(), { from: "chatContent" });
await startMutationObserver(motd_container, { from: "motdContainer" });
await startMutationObserver(await server_section(), { from: "serverSection" });
await startMutationObserver(await shipyard_ships(), { from: "shipyardShips" });
await startMutationObserver(window_dark_container(), { from: "windowDark" });
await startMutationObserver(await team_menu_container(), { from: "teamMenuContainer" });
// OBSERVE ENDS

// PLUGINS START
const plugins = await PLUGIN_LIST();
await loadPlugins(plugins);
// PLUGINS END

// LISTENER START
window.addEventListener("message", async e => {
  if (e.source !== window || !e.data?.type) return;
  const { type, id, token } = e.data;

  if (type === "ext:getSession") {
    const r = await chrome.runtime.sendMessage({ type: "getSession" });
    window.postMessage({ id, value: r }, "*");
    return;
  }
  if (type === "ext:setSession") {
    const r = await chrome.runtime.sendMessage({ type: "setSession", token });
    window.postMessage({ id, value: r }, "*");
    return;
  }
  if (type === "ext:reloadTabs") {
    const r = await chrome.runtime.sendMessage({ type: "reloadGameTabs" });
    window.postMessage({ id, value: r }, "*");
  }
});
// LISTENER END