"use strict";

const rootDir = async () => navigator.storage.getDirectory();

const splitPath = id => String(id).split("/").filter(Boolean);

const getDir = async (parts, create = false) => {
  let dir = await rootDir();
  for (const part of parts) dir = create ? await dir.getDirectoryHandle(part, { create: true }) : await dir.getDirectoryHandle(part);
  return dir;
};

const getFileTarget = async (id, create = false) => {
  if (typeof id !== "string" || !id.trim()) throw new TypeError("id must be a non-empty string.");
  const parts = splitPath(id);
  const name = parts.pop();
  if (!name) throw new TypeError("id must contain a file name.");
  const dir = parts.length ? await getDir(parts, create) : await rootDir();
  return [dir, name];
};

export const saveFile = async (id, content) => {
  const [dir, name] = await getFileTarget(id, true);
  const file = await dir.getFileHandle(name, { create: true });
  const writable = await file.createWritable();
  await writable.write(content);
  await writable.close();
  return true;
};

export const appendToFile = async (id, contentToAppend) => {
  const existing = await getFile(id) || "";
  await saveFile(id, existing + contentToAppend);
  return true;
};

export const getFile = async id => {
  try {
    const [dir, name] = await getFileTarget(id, false);
    const file = await dir.getFileHandle(name);
    const f = await file.getFile();
    return await f.text();
  } catch {
    return null;
  }
};

export const deleteFile = async id => {
  try {
    const [dir, name] = await getFileTarget(id, false);
    await dir.removeEntry(name);
    return true;
  } catch {
    return false;
  }
};

export const getAllFiles = async () => {
  const root = await rootDir();
  const result = [];
  const walk = async (dir, prefix) => {
    for await (const handle of dir.values()) {
      const id = prefix ? `${prefix}/${handle.name}` : handle.name;
      if (handle.kind === "file") result.push({ id, content: await (await handle.getFile()).text() });
      else if (handle.kind === "directory") await walk(handle, id);
    }
  };
  await walk(root, "");
  return result;
};

export const saveNamespacedFile = async (namespace, fileName, content) => {
  const path = `${namespace}/${fileName}`;
  return saveFile(path, content);
};

export const appendNamespacedFile = async (namespace, fileName, content) => {
  const path = `${namespace}/${fileName}`;
  return appendToFile(path, content);
};

export const getNamespacedFiles = async namespace => {
  const all = await getAllFiles();
  const prefix = namespace + "/";
  return all.filter(f => f.id === namespace || f.id.startsWith(prefix));
};

export const deleteNamespacedFile = async (namespace, fileName) => {
  const path = `${namespace}/${fileName}`;
  return deleteFile(path);
};