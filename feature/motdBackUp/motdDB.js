const DB_FILE = "motd_db.json";

/**
 * Initializes the MOTD database by reading the JSON metadata file from OPFS. 
 * If it doesn’t exist, returns an empty object.
 * @async
 * @returns {Promise<Object>} A key-value mapping of shipId → { file: string, lastUpdated: number }.
 */
export const initDB = async () => {
  const dir = await navigator.storage.getDirectory();
  try {
    const file = await dir.getFileHandle(DB_FILE);
    const contents = await file.getFile();
    return JSON.parse(await contents.text());
  } catch {
    return {};
  }
};

/**
 * Saves the MOTD database metadata object to OPFS as a JSON file.
 * @async
 * @param {Object} db - The database object mapping shipId → { file: string, lastUpdated: number }.
 * @returns {Promise<void>}
 */
export const saveDB = async db => {
  const dir = await navigator.storage.getDirectory();
  const file = await dir.getFileHandle(DB_FILE, { create: true });
  const writable = await file.createWritable();
  await writable.write(JSON.stringify(db));
  await writable.close();
};

/**
 * Saves a MOTD for a specific shipId. Creates/updates the associated file in OPFS 
 * and updates the metadata database.
 * @async
 * @param {string} shipId - Unique identifier for the ship.
 * @param {string} description - The MOTD text (max 4096 characters).
 * @returns {Promise<void>}
 */
export const saveShipMOTD = async (shipId, description) => {
  if (description.length > 4096) throw new Error("[SAVESHIPMOTD] MOTD exceeds 4096 characters");
  const dir = await navigator.storage.getDirectory();
  const db = await initDB();
  const fileName = `${shipId}.txt`;
  const file = await dir.getFileHandle(fileName, { create: true });
  const writable = await file.createWritable();
  await writable.write(description);
  await writable.close();
  db[shipId] = { file: fileName, lastUpdated: Date.now() };
  await saveDB(db);
};

/**
 * Loads the MOTD for a specific shipId from OPFS. Returns null if no MOTD exists.
 * @async
 * @param {string} shipId - Unique identifier for the ship.
 * @returns {Promise<string|null>} The MOTD text, or null if not found.
 */
export const loadShipMOTD = async shipId => {
  const dir = await navigator.storage.getDirectory();
  const db = await initDB();
  if (!db[shipId]) return null;
  try {
    const file = await dir.getFileHandle(db[shipId].file);
    const contents = await file.getFile();
    return await contents.text();
  } catch {
    return null;
  }
};