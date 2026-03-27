import { signIn, bootstrapUser, signInWithOAuth, signOut } from "../../utils/social/auth.js";
import { sendMessage, subscribeToMessages, getConversation } from "../../utils/social/messaging.js";
import { sendFriendRequest, acceptFriendRequest, getFriendsList, getPendingRequests } from "../../utils/social/friends.js";
import { updatePresence, startHeartbeat, stopHeartbeat, observeFriendsPresence, getVisibleStatus } from "../../utils/social/presence.js";
import { backupPrivateKey, restorePrivateKey } from "../../utils/social/backup.js";

export const auth = {
  signIn: async () => {
    const user = await signIn();
    window.dispatchEvent(new CustomEvent("dredutils:supabase:signedIn", { detail: user }));
    return user;
  },
  bootstrapUser: async (user, username) => {
    const profile = await bootstrapUser(user, username);
    window.dispatchEvent(new CustomEvent("dredutils:supabase:userBootstrapped", { detail: profile }));
    return profile;
  },
  signInWithOAuth: async (provider) => {
    const user = await signInWithOAuth(provider);
    window.dispatchEvent(new CustomEvent("dredutils:supabase:signedIn", { detail: user }));
    return user;
  },
  signOut: async () => {
    await signOut();
    window.dispatchEvent(new CustomEvent("dredutils:supabase:signedOut"));
  },
};

export const messaging = {
  sendMessage: async (toId, message) => {
    await sendMessage(toId, message);
    window.dispatchEvent(new CustomEvent("dredutils:supabase:messageSent", { detail: { toId, message } }));
  },
  getConversation,
  subscribeToMessages: (callback) => {
    return subscribeToMessages((msg) => {
      window.dispatchEvent(new CustomEvent("dredutils:supabase:messageReceived", { detail: msg }));
      callback(msg);
    });
  },
};

export const friends = {
  sendFriendRequest: async (toUsername) => {
    await sendFriendRequest(toUsername);
    window.dispatchEvent(new CustomEvent("dredutils:supabase:friendRequestSent", { detail: { toUsername } }));
  },
  acceptFriendRequest: async (requestId) => {
    await acceptFriendRequest(requestId);
    window.dispatchEvent(new CustomEvent("dredutils:supabase:friendRequestAccepted", { detail: { requestId } }));
  },
  getFriendsList,
  getPendingRequests,
};

export const presence = {
  updatePresence,
  startHeartbeat,
  stopHeartbeat,
  getVisibleStatus,
  observeFriendsPresence: (friendIds, callback) => {
    return observeFriendsPresence(friendIds, (update) => {
      window.dispatchEvent(new CustomEvent("dredutils:supabase:presenceUpdated", { detail: update }));
      callback(update);
    });
  },
};

export const backup = {
  backupPrivateKey: async (password) => {
    await backupPrivateKey(password);
    window.dispatchEvent(new CustomEvent("dredutils:supabase:keyBackedUp"));
  },
  restorePrivateKey: async (password) => {
    await restorePrivateKey(password);
    window.dispatchEvent(new CustomEvent("dredutils:supabase:keyRestored"));
  },
};