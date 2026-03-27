import { supabase } from "./supabase.js";

export const sendFriendRequest = async (toUsername) => {
  const { data: receiver, error: userError } = await supabase
    .from("users")
    .select("id")
    .eq("username", toUsername)
    .single();
  if (userError) throw new Error("User not found");
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { error } = await supabase.functions.invoke('friends', {
    body: {
      action: 'send-request',
      payload: { to_id: receiver.id }
    }
  });

  if (error) throw error;
};

export const acceptFriendRequest = async (requestId) => {
  const { error } = await supabase.functions.invoke('friends', {
    body: {
      action: 'accept-request',
      payload: { request_id: requestId }
    }
  });
  if (error) throw error;
};

export const getFriendsList = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data, error } = await supabase
    .from("friends")
    .select(
      `
      id,
      status,
      sender (id, username),
      receiver (id, username)
    `,
    )
    .or(`sender.eq.${user.id},receiver.eq.${user.id}`)
    .eq("status", "accepted");
  if (error) throw error;
  return data.map((f) => {
    return f.sender.id === user.id ? f.receiver : f.sender;
  });
};

export const getPendingRequests = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data, error } = await supabase
    .from("friends")
    .select(
      `
      id,
      sender (id, username)
    `,
    )
    .eq("receiver", user.id)
    .eq("status", "pending");
  if (error) throw error;
  return data;
};