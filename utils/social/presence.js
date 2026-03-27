import { supabase } from "./supabase.js";

let heartbeatInterval = null;

export const updatePresence = async (status = "online", ship = null) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;
  const { error } = await supabase.functions.invoke('presence', {
    body: { status, ship }
  });
  if (error) console.error("Presence update failed:", error);
};

export const startHeartbeat = (status = "online", ship = null) => {
  if (heartbeatInterval) clearInterval(heartbeatInterval);
  updatePresence(status, ship);
  heartbeatInterval = setInterval(() => {
    updatePresence(status, ship);
  }, 30000);
};

export const stopHeartbeat = () => {
  if (heartbeatInterval) clearInterval(heartbeatInterval);
  heartbeatInterval = null;
};

export const observeFriendsPresence = async (friendIds, callback) => {
  return supabase
    .channel("friend-presence")
    .on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "presence",
        filter: `user_id=in.(${friendIds.join(",")})`,
      },
      (payload) => {
        callback(payload.new);
      },
    )
    .subscribe();
}

export const getVisibleStatus = (row) => {
  const stale = Date.now() - new Date(row.last_seen).getTime() > 60000;
  if (stale) return "offline";
  return row.status;
};