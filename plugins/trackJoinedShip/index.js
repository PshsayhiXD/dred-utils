import { addFetchListener } from "../../utils/network/fetchInterceptor.js";
import { emit } from "../../bridge/pageBridge.js";
import { isCurrentPlayerCaptain } from "../../utils/drednot.js";

const listeners = new Set();
let lastShipJoinedData = null;
let currentShipState = {
  isCaptain: false,
};

export const onShipJoined = (callback) => {
  listeners.add(callback);
  return () => listeners.delete(callback);
};

export const lastShipJoined = () => {
  return lastShipJoinedData ? { ...lastShipJoinedData } : null;
};

export const getCurrentShipState = () => currentShipState;

addFetchListener({
  onBeforeRequest: (url, options) => {
    if (url.includes("/join")) {
      try {
        const data = JSON.parse(options.body);
        lastShipJoinedData = data;
      } catch (err) {
        console.error("[trackJoinedShip] Failed to parse join request body:", err);
      }
    }
  },
  onResponse: async (url, options, response) => {
    if (url.includes("/join") && response.ok) {
      try {
        const data = await response.clone().json();
        for (const listener of listeners) listener(data);
        emit("dredutils:shipJoined", data);
        setTimeout(async () => {
          currentShipState.isCaptain = await isCurrentPlayerCaptain();
        }, 2000);
      } catch (err) {
        console.error("Failed to parse join response:", err);
      }
    }
  },
  onError: (url, options, error) => {
    if (url.includes("/join")) emit("dredutils:shipJoinError", error);
  }
});