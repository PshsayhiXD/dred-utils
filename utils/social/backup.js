import { saveFile, getFile } from '../../storage/OPFS.js';
import { supabase } from './supabase.js';

export const backupPrivateKey = async (password) => {
  const privateKeyStr = await getFile('private_key');
  if (!privateKeyStr) throw new Error("Private key not found locally");
  const encoder = new TextEncoder();
  const passwordData = encoder.encode(password);
  const pwHash = await window.crypto.subtle.digest('SHA-256', passwordData);
  const aesKey = await window.crypto.subtle.importKey(
    'raw',
    pwHash,
    { name: 'AES-GCM' },
    false,
    ['encrypt']
  );
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await window.crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    aesKey,
    encoder.encode(privateKeyStr)
  );
  const payload = {
    iv: btoa(String.fromCharCode(...iv)),
    data: btoa(String.fromCharCode(...new Uint8Array(encrypted)))
  };
  const { data: { user } } = await supabase.auth.getUser();
  const { error } = await supabase
    .from('key_backup')
    .upsert({
      user_id: user.id,
      encrypted_key: JSON.stringify(payload)
    });
  if (error) throw error;
};

export const restorePrivateKey = async (password) => {
  const { data: { user } } = await supabase.auth.getUser();
  const { data: backup, error: fetchError } = await supabase
    .from('key_backup')
    .select('encrypted_key')
    .eq('user_id', user.id)
    .single();
  if (fetchError) throw fetchError;
  const payload = JSON.parse(backup.encrypted_key);
  const encoder = new TextEncoder();
  const passwordData = encoder.encode(password);
  const pwHash = await window.crypto.subtle.digest('SHA-256', passwordData);
  const aesKey = await window.crypto.subtle.importKey(
    'raw',
    pwHash,
    { name: 'AES-GCM' },
    false,
    ['decrypt']
  );
  const iv = Uint8Array.from(atob(payload.iv), c => c.charCodeAt(0));
  const encryptedData = Uint8Array.from(atob(payload.data), c => c.charCodeAt(0));
  const decrypted = await window.crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    aesKey,
    encryptedData
  );
  const privateKeyStr = new TextDecoder().decode(decrypted);
  await saveFile('private_key', privateKeyStr);
};