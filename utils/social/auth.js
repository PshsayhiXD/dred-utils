import { supabase } from "./supabase.js";
import { saveFile, getFile, deleteFile } from "../../storage/OPFS.js";
import {
  generateKeyPair,
  exportPublicKey,
  exportPrivateKey,
} from "./crypto.js";
export const signIn = async () => {
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();
  if (sessionError) throw sessionError;
  if (!session) {
    const { data, error } = await supabase.auth.signInAnonymously();
    if (error) throw error;
    return data.user;
  }
  return session.user;
};
export const bootstrapUser = async (user, username) => {
  const { data: profile, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();
  if (error && error.code !== "PGRST116") throw error;
  if (!profile) {
    const keyPair = await generateKeyPair();
    const publicKeyStr = await exportPublicKey(keyPair.publicKey);
    const privateKeyStr = await exportPrivateKey(keyPair.privateKey);
    const { error: insertError } = await supabase.from("users").insert({
      id: user.id,
      username: username,
      public_key: publicKeyStr,
    });
    if (insertError) throw insertError;
    await saveFile("private_key", privateKeyStr);
    return { id: user.id, username, publicKey: publicKeyStr };
  }
  return profile;
};
export const signInWithOAuth = async (provider) => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: chrome.identity.getRedirectURL(),
      skipBrowserRedirect: true,
    },
  });
  if (error) {
    console.error("[AUTH] Supabase OAuth error:", error);
    throw error;
  }
  const authUrl = data.url;
  return new Promise((resolve, reject) => {
    chrome.identity.launchWebAuthFlow(
      {
        url: authUrl,
        interactive: true,
      },
      (redirectUrl) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
          return;
        }
        const url = new URL(redirectUrl);
        const params = new URLSearchParams(url.hash.substring(1));
        const accessToken = params.get("access_token");
        const refreshToken = params.get("refresh_token");
        if (accessToken && refreshToken) {
          supabase.auth
            .setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            })
            .then(({ data, error }) => {
              if (error) {
                console.error("[AUTH] setSession error:", error);
                reject(error);
              } else resolve(data.user);
            });
        } else {
          console.error("[AUTH] Tokens missing in redirect");
          reject(new Error("No tokens found in redirect URL"));
        }
      },
    );
  });
};
export const signOut = async () => {
  await supabase.auth.signOut();
  await deleteFile("private_key");
};
