const DB_FILE = "motd_db.json";

/**
 * Initializes the MOTD database from OPFS and normalizes schema.
 * @async
 * @returns {Promise<Object>} Mapping of shipId to backup arrays.
 */
export const initDB = async () => {
  const dir = await navigator.storage.getDirectory();
  let db;
  try {
    const file = await dir.getFileHandle(DB_FILE);
    const contents = await file.getFile();
    db = JSON.parse(await contents.text());
  } catch {
    db = {};
  }
  Object.keys(db).forEach(shipId => {
    if (!Array.isArray(db[shipId])) {
      db[shipId] = [{
        id: crypto.randomUUID(),
        file: db[shipId].file,
        lastUpdated: db[shipId].lastUpdated
      }];
    }
  });
  return db;
};

/**
 * Persists the MOTD database to OPFS.
 * @async
 * @param {Object} db Database object.
 * @returns {Promise<void>} Resolves when saved.
 */
export const saveDB = async db => {
  const dir = await navigator.storage.getDirectory();
  const file = await dir.getFileHandle(DB_FILE, { create: true });
  const writable = await file.createWritable();
  await writable.write(JSON.stringify(db));
  await writable.close();
};

/**
 * Saves a new MOTD backup for a ship.
 * @async
 * @param {string} shipId Ship identifier.
 * @param {string} content MOTD content.
 * @returns {Promise<void>} Resolves when saved.
 */
export const saveShipMOTD = async (shipId, content) => {
  const dir = await navigator.storage.getDirectory();
  const db = await initDB();
  const id = crypto.randomUUID();
  const fileName = `${shipId}_${id}.txt`;
  const file = await dir.getFileHandle(fileName, { create: true });
  const writable = await file.createWritable();
  await writable.write(content);
  await writable.close();
  db[shipId] ??= [];
  db[shipId].push({ id, file: fileName, lastUpdated: Date.now() });
  await saveDB(db);
};

/**
 * Overwrites an existing MOTD backup.
 * @async
 * @param {string} shipId Ship identifier.
 * @param {string} id Backup identifier.
 * @param {string} content New MOTD content.
 * @returns {Promise<void>} Resolves when overwritten.
 */
export const overwriteShipMOTD = async (shipId, id, content) => {
  const dir = await navigator.storage.getDirectory();
  const db = await initDB();
  const list = db[shipId] || [];
  const entry = list.find(e => e.id === id);
  if (!entry) return;
  const file = await dir.getFileHandle(entry.file);
  const writable = await file.createWritable();
  await writable.write(content);
  await writable.close();
  entry.lastUpdated = Date.now();
  await saveDB(db);
};

/**
 * Loads a MOTD backup file.
 * @async
 * @param {string} file File name.
 * @returns {Promise<string|null>} MOTD content or null.
 */
export const loadShipMOTDFile = async file => {
  const dir = await navigator.storage.getDirectory();
  try {
    const handle = await dir.getFileHandle(file);
    const contents = await handle.getFile();
    return await contents.text();
  } catch {
    return null;
  }
};

/**
 * Deletes a MOTD backup for a ship.
 * @async
 * @param {string} shipId Ship identifier.
 * @param {string} id Backup identifier.
 * @returns {Promise<void>} Resolves when deleted.
 */
export const deleteShipMOTD = async (shipId, id) => {
  const dir = await navigator.storage.getDirectory();
  const db = await initDB();
  const list = db[shipId] || [];
  const entry = list.find(e => e.id === id);
  if (!entry) return;
  try {
    await dir.removeEntry(entry.file);
  } catch {}
  db[shipId] = list.filter(e => e.id !== id);
  await saveDB(db);
};
