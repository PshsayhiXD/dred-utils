import { supabase } from './supabase.js';
import { encryptMessage, decryptMessage, importPublicKey, importPrivateKey } from './crypto.js';
import { getFile } from '../../storage/OPFS.js';

export const sendMessage = async (toId, message) => {
  const { data: receiver, error: userError } = await supabase
    .from('users')
    .select('public_key')
    .eq('id', toId)
    .single();
  if (userError) throw userError;
  const receiverPublicKey = await importPublicKey(receiver.public_key);
  const encryptedPayload = await encryptMessage(message, receiverPublicKey);
  const { error: invokeError } = await supabase.functions.invoke('send-message', {
    body: {
      to_id: toId,
      text: JSON.stringify(encryptedPayload)
    }
  });
  if (invokeError) throw invokeError;
};

export const subscribeToMessages = async (callback) => {
  const { data: { user } } = await supabase.auth.getUser();
  const privateKeyStr = await getFile('private_key');
  if (!privateKeyStr) return;
  const privateKey = await importPrivateKey(privateKeyStr);
  return supabase
    .channel('private-messages')
    .on('postgres_changes', { 
      event: 'INSERT', 
      schema: 'public', 
      table: 'messages',
      filter: `to_id=eq.${user.id}` 
    }, async (payload) => {
      try {
        const encrypted = JSON.parse(payload.new.text);
        const decryptedText = await decryptMessage(encrypted, privateKey);
        callback({
          ...payload.new,
          text: decryptedText
        });
      } catch (e) {
        console.error("Failed to decrypt message:", e);
      }
    })
    .subscribe();
};

export const getConversation = async (friendId) => {
  const { data: { user } } = await supabase.auth.getUser();
  const privateKeyStr = await getFile('private_key');
  const privateKey = await importPrivateKey(privateKeyStr);
  const { data: messages, error } = await supabase
    .from('messages')
    .select('*')
    .or(`and(from_id.eq.${user.id},to_id.eq.${friendId}),and(from_id.eq.${friendId},to_id.eq.${user.id})`)
    .order('created_at', { ascending: true });
  if (error) throw error;
  const decryptedMessages = await Promise.all(messages.map(async (m) => {
    try {
      if (m.to_id === user.id) {
        const encrypted = JSON.parse(m.text);
        m.text = await decryptMessage(encrypted, privateKey);
      } else m.text = "[Sent Message - Encrypted]";
    } catch (e) {
      m.text = "[Decryption Error]";
    }
    return m;
  }));
  return decryptedMessages;
};