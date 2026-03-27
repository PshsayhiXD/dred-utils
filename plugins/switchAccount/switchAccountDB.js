"use strict";

import { saveFile, getFile, deleteFile } from "../../storage/OPFS.js";

const NS = "switchAccount";

export const initDB = async () => {
  const text = await getFile(NS);
  const db = text ? JSON.parse(text) : {};
  Object.keys(db).forEach(accountName => {
    if (typeof db[accountName].token !== "string") delete db[accountName];
  });
  return db;
};

export const getAccounts=async()=>{
  const raw=await getFile(NS);
  if(!raw)return {};
  try{return JSON.parse(raw);}catch{return {};}
};

const writeDB=async data=>{
  return await saveFile(NS,JSON.stringify(data));
};

export const saveAccount=async(name,token)=>{
  const db=await getAccounts();
  db[name]=token;
  return await writeDB(db);
};

export const getAccount=async name=>{
  const db=await getAccounts();
  return db[name]||null;
};

export const deleteAccount=async name=>{
  const db=await getAccounts();
  if(!db[name])return false;
  delete db[name];
  return await writeDB(db);
};

export const listAccounts=async()=>{
  const db=await getAccounts();
  return Object.keys(db);
};

export const clearAccounts=async()=>{
  return await deleteFile(NS);
};