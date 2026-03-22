const getGameTab = (currentTab) => {
  if (currentTab) return Promise.resolve(currentTab);
  const patterns = ["*://drednot.io/*", "*://*.drednot.io/*"];
  return chrome.tabs.query({ active: true, currentWindow: true, url: patterns })
    .then(tabs => tabs[0] || chrome.tabs.query({ active: true, url: patterns })
    .then(activeAny => activeAny[0] || chrome.tabs.query({ url: patterns })
    .then(all => all[0] || null)));
};

chrome.runtime.onMessage.addListener((msg, sender, res) => {
  const targetTab = sender.tab;

  if (msg.type === "getSession") {
    getGameTab(targetTab).then(tab => {
      if (!tab) return res(null);
      chrome.cookies.get({ url: tab.url, name: "game_session" })
      .then(c => {
        if (c?.value) return res(c.value);
        chrome.cookies.get({ url: tab.url, name: "anon_key" })
        .then(c2 => res(c2?.value || null));
      });
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
    getGameTab(targetTab).then(tab => {
      if (tab) chrome.tabs.reload(tab.id);
      res(true);
    });
    return true;
  }
});