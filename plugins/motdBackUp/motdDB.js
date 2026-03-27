import { saveFile, getFile } from "../../storage/OPFS.js";
const NS = "motdBackup";

export const initDB = async () => {
  const text = await getFile(NS);
  const db = text ? JSON.parse(text) : {};
  Object.keys(db).forEach(shipId => {
    if (!Array.isArray(db[shipId])) {
      db[shipId] = [{
        id: crypto.randomUUID(),
        content: db[shipId].content,
        lastUpdated: db[shipId].lastUpdated
      }];
    }
  });
  return db;
};

export const saveDB = async db => {
  await saveFile(NS, JSON.stringify(db));
};

export const saveShipMOTD = async (shipId, content) => {
  const key = shipId ?? "unknown";
  const db = await initDB();
  const id = crypto.randomUUID();
  db[key] ??= [];
  db[key].push({ id, content, lastUpdated: Date.now() });
  await saveDB(db);
};

export const overwriteShipMOTD = async (shipId, id, content) => {
  const key = shipId ?? "unknown";
  const db = await initDB();
  const list = db[key] || [];
  const entry = list.find(e => e.id === id);
  if (!entry) return;
  entry.content = content;
  entry.lastUpdated = Date.now();
  await saveDB(db);
};

export const loadShipMOTDFile = async file => {
  return await getFile(file);
};

export const deleteShipMOTD = async (shipId, id) => {
  const key = shipId ?? "unknown";
  const db = await initDB();
  const list = db[key] || [];
  const entry = list.find(e => e.id === id);
  if (!entry) return;
  db[key] = list.filter(e => e.id !== id);
  await saveDB(db);
};