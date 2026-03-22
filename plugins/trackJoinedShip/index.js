import { addFetchListener } from "../../utils/network/fetchInterceptor.js";

const listeners = new Set();

/**
 * Register a listener for ship joining events.
 * @param {Function} callback (shipData) => void
 * @returns {Function} Unregister function
 */
export const onShipJoined = (callback) => {
  listeners.add(callback);
  return () => listeners.delete(callback);
};

addFetchListener({
  onResponse: async (url, options, response) => {
    if (url.includes("/join") && response.ok) {
      try {
        const data = await response.json();
        for (const listener of listeners) {
          listener(data);
        }
        window.dispatchEvent(new CustomEvent("dred:shipJoined", { detail: data }));
      } catch (err) {
        console.error("Failed to parse join response:", err);
      }
    }
  }
});

addFetchListener({
  onBeforeRequest: (url, options) => {
    if (url.includes("/join")) {
      window.dispatchEvent(new CustomEvent("dred:shipJoinStarted"));
    }
  },
  onError: (url, options, error) => {
    if (url.includes("/join")) {
      window.dispatchEvent(new CustomEvent("dred:shipJoinError", { detail: error }));
    }
  }
});
