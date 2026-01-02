"use strict";

const rootDir = async () => navigator.storage.getDirectory();

/**
 * Saves a file with the given id and content to OPFS.
 * @async
 * @param {string} id
 * @param {string} content
 * @returns {Promise<boolean>}
 */
export const saveFile = async (id, content) => {
  const root = await rootDir();
  const file = await root.getFileHandle(id, { create: true });
  const writable = await file.createWritable();
  await writable.write(content);
  await writable.close();
  return true;
};

/**
 * Appends content to an existing file in OPFS.
 * Creates the file if it does not exist.
 * @async
 * @param {string} id
 * @param {string} contentToAppend
 * @returns {Promise<boolean>}
 */
export const appendToFile = async (id, contentToAppend) => {
  const root = await rootDir();
  let existing = "";
  try {
    const file = await root.getFileHandle(id);
    const f = await file.getFile();
    existing = await f.text();
  } catch {}
  const file = await root.getFileHandle(id, { create: true });
  const writable = await file.createWritable();
  await writable.write(existing + contentToAppend);
  await writable.close();
  return true;
};

/**
 * Retrieves the content of a file from OPFS.
 * @async
 * @param {string} id
 * @returns {Promise<string|null>}
 */
export const getFile = async (id) => {
  try {
    const root = await rootDir();
    const file = await root.getFileHandle(id);
    const f = await file.getFile();
    return await f.text();
  } catch {
    return null;
  }
};

/**
 * Deletes a file from OPFS.
 * @async
 * @param {string} id
 * @returns {Promise<boolean>}
 */
export const deleteFile = async (id) => {
  const root = await rootDir();
  try {
    await root.removeEntry(id);
    return true;
  } catch {
    return false;
  }
};

/**
 * Retrieves all files stored in OPFS.
 * @async
 * @returns {Promise<Array<{id: string, content: string}>>}
 */
export const getAllFiles = async () => {
  const root = await rootDir();
  const result = [];
  for await (const [name, handle] of root.entries()) {
    if (handle.kind !== "file") continue;
    const f = await handle.getFile();
    result.push({ id: name, content: await f.text() });
  }
  return result;
};