import { initAutoRefresh } from "./elements/autoRefreshBtn.js";
import { onDispatch } from "../../bridge/pageBridge.js";

onDispatch("dredutils:shipyardShips", () => {
  initAutoRefresh();
});
