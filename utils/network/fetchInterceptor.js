const originalFetch = window.fetch;
const listeners = new Set();

window.fetch = async function (...args) {
  const [input, init] = args;
  const url = typeof input === "string" ? input : input?.url || "";
  const options = typeof input === "string" ? init : input || {};
  for (const listener of listeners) {
    if (listener.onBeforeRequest) {
      listener.onBeforeRequest(url, options);
    }
  }

  try {
    const response = await originalFetch.apply(this, args);
    const clonedResponse = response.clone();
    for (const listener of listeners) {
      if (listener.onResponse) {
        listener.onResponse(url, options, clonedResponse);
      }
    }

    return response;
  } catch (err) {
    for (const listener of listeners) {
      if (listener.onError) {
        listener.onError(url, options, err);
      }
    }
    throw err;
  }
};

export const addFetchListener = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};
