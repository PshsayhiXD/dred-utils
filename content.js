import { startMutationObserver } from "./bridge/pageMain.js";
import {
  chat_container,
  motd_container,
  server_section,
  team_menu_container,
  window_dark_container,
  shipyard_ships,
  chat_content,
} from "./utils/constants.js";
import { getNamespacedFiles } from "./storage/OPFS.js";
import { waitForElement } from "./utils/elements/dom.js";
import { dispatch, onDispatch } from "./bridge/pageBridge.js";
import { loadPlugins, PLUGIN_LIST } from "./utils/plugins.js";
import { addEventListenerInterceptor } from "./utils/elements/addEventListenerInterceptor.js";

addEventListenerInterceptor();
await loadPlugins(PLUGIN_LIST());
await new Promise((resolve) => onDispatch("dredutils:pluginsReady", resolve));

// LISTENER START
window.addEventListener("message", async (e) => {
  if (e.source !== window || !e.data?.type) return;
  const { type, id, token } = e.data;
  const parsedType = type.replace("dredutils:", "");
  if (parsedType === type) return;
  const sendTo = async (type, data) => {
    const r = await chrome.runtime.sendMessage({ type, ...data });
    window.postMessage({ replyTo: id, value: r }, "*");
  };
  if (parsedType === "getSession") return sendTo("getSession");
  if (parsedType === "setSession") return sendTo("setSession", { token });
  if (parsedType === "reloadTabs") return sendTo("reloadGameTabs");
});
// LISTENER END

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg.type === "dredutils:getPluginDatabase") {
    (async () => {
      try {
        const files = await getNamespacedFiles(msg.namespace);
        sendResponse(files);
      } catch (err) {
        console.error("OPFS Read error:", err);
        sendResponse([]);
      }
    })();
    return true;
  }
});

// OBSERVE STARTS
await waitForElement({
  sel: chat_container(),
  callback: (el) => {
    dispatch("dredutils:chatContainer", { node: el });
  },
});
await waitForElement({
  sel: motd_container,
  callback: (el) => {
    dispatch("dredutils:motdContainer", { node: el });
  },
});
await waitForElement({
  sel: shipyard_ships(),
  callback: (el) => {
    dispatch("dredutils:shipyardShips", { node: el });
  },
});
await waitForElement({
  sel: window_dark_container(),
  callback: (el) => {
    dispatch("dredutils:windowDark", { node: el });
  },
});
await startMutationObserver(chat_content(), { from: "chatContent" });
await startMutationObserver(server_section(), { from: "serverSection" });
await startMutationObserver(team_menu_container(), {
  from: "teamMenuContainer",
});
// OBSERVE ENDS
