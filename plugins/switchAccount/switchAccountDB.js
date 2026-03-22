"use strict";

import { saveFile, getFile, deleteFile } from "../../storage/OPFS.js";

const dbFile="accounts.db";

/**
 * Reads the account database. (Exported for efficiency)
 * @async
 * @returns {Promise<Object<string,string>>} Account-token map.
 */
export const getAccounts=async()=>{
  const raw=await getFile(dbFile);
  if(!raw)return {};
  try{return JSON.parse(raw);}catch{return {};}
};

/**
 * Writes the account database.
 * @async
 * @param {Object<string,string>} data Account-token map.
 * @returns {Promise<boolean>} True if written successfully.
 */
const writeDB=async data=>{
  return await saveFile(dbFile,JSON.stringify(data));
};

/**
 * Saves or updates an account token.
 * @async
 * @param {string} name The account label.
 * @param {string} token The game_session token.
 * @returns {Promise<boolean>} True if saved.
 */
export const saveAccount=async(name,token)=>{
  const db=await getAccounts();
  db[name]=token;
  return await writeDB(db);
};

/**
 * Retrieves an account token.
 * @async
 * @param {string} name The account label.
 * @returns {Promise<string|null>} The stored token.
 */
export const getAccount=async name=>{
  const db=await getAccounts();
  return db[name]||null;
};

/**
 * Deletes an account.
 * @async
 * @param {string} name The account label.
 * @returns {Promise<boolean>} True if removed.
 */
export const deleteAccount=async name=>{
  const db=await getAccounts();
  if(!db[name])return false;
  delete db[name];
  return await writeDB(db);
};

/**
 * Lists all saved account names.
 * @async
 * @returns {Promise<string[]>} Array of account names.
 */
export const listAccounts=async()=>{
  const db=await getAccounts();
  return Object.keys(db);
};

/**
 * Clears the entire account database.
 * @async
 * @returns {Promise<boolean>} True if removed.
 */
export const clearAccounts=async()=>{
  return await deleteFile(dbFile);
};