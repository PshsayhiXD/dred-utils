const getGameTab = () =>
chrome.tabs.query({ url: "*://*.drednot.io/*" }).then(tabs => tabs[0] ?? null);

chrome.runtime.onMessage.addListener((msg, sender, res) => {
  if (msg.type === "getSession") {
    console.log("ok")
    getGameTab().then(tab => {
      if (!tab) return res(null);
      chrome.cookies.get({ url: tab.url, name: "game_session" })
      .then(c => res(c?.value || null));
    });
    return true;
  }

  if (msg.type === "setSession") {
    chrome.cookies.getAll({ name: "game_session", domain: "drednot.io" }).then(cookies => {
      const dredCookies = cookies.filter(c => c.domain.includes("drednot.io"));
      const existing = dredCookies[0];
      const domain = existing?.domain ?? ".drednot.io";
      const url = `https://${domain.replace(/^\./, "")}/`;
      
      const removePromises = dredCookies.map(c => 
        chrome.cookies.remove({
          url: `https://${c.domain.replace(/^\./, "")}${c.path}`,
          name: c.name
        })
      );

      Promise.all(removePromises).then(() => {
        if (!msg.token) return res(true);

        const details = {
          url,
          name: "game_session",
          value: msg.token,
          secure: existing?.secure ?? true,
          httpOnly: existing?.httpOnly ?? true,
          path: existing?.path ?? "/",
          expirationDate: Math.floor(Date.now() / 1000) + (2 * 24 * 60 * 60)
        };
        
        if (!existing || !existing.hostOnly) {
          details.domain = domain;
        }

        chrome.cookies.set(details).then(() => res(true));
      });
    });
    return true;
  }

  if (msg.type === "reloadGameTabs") {
    chrome.tabs.query({ url: "*://*.drednot.io/*" }).then(tabs => {
      tabs.forEach(t => chrome.tabs.reload(t.id));
      res(true);
    });
    return true;
  }
});