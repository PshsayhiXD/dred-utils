import { injectPageScript, injectPageCSS } from "./bridge/injector.js";
import { loadPlugins } from "./utils/plugins.js";
import { startMutationObserver } from "./bridge/pageMain.js";
import { chat_container, motd_container, server_section } from "./utils/constants.js";
import { PLUGIN_LIST } from "./utils/plugins.js";

// MUST HAVE START
injectPageScript("bridge/pageMain.js");
injectPageScript("bridge/pageBridge.js");
injectPageScript("utils/constants.js");
// MUST HAVE END

// Manually set plugin list in /plugin_list.json pls
// PLUGINS START
const plugins = await PLUGIN_LIST();
await loadPlugins(plugins);
// PLUGINS END

// OBSERVE STARTS
await startMutationObserver(chat_container, { from: "chatContent" });
await startMutationObserver(motd_container, { from: "motdContainer" });
await startMutationObserver(server_section(), { from: "serverSection" });
// OBSERVE ENDS