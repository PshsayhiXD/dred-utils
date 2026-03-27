import { getAccount } from "./switchAccountDB.js";
import { request } from "../../bridge/pageBridge.js";

export const getCurrentSession = () => request("dredutils:getSession");

export const setSession = token => request("dredutils:setSession", { token });

export const reloadGameTabs = () => request("dredutils:reloadTabs");

export const switchAccount=async name=>{
  const token=await getAccount(name);
  if(!token)return false;
  await setSession(token);
  await reloadGameTabs();
  return true;
};
