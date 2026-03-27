import {
  getAccounts,
  deleteAccount,
  saveAccount,
  getAccount,
} from "../switchAccountDB.js";
import {
  switchAccount,
  getCurrentSession,
  setSession,
  reloadGameTabs,
} from "../accountLoader.js";
import { createElement, addEventListener } from "../../../utils/elements/dom.js";

export const createSwitchAccountBtn = async () => {
  const id = "switchAccountBtn";
  const root = createElement("div", { id });
  const btn = createElement("a", {
    className: "btn btn-small btn-yellow",
    textContent: "Accounts",
  });
  const header = createElement("div", {
    className: "sa-header",
    textContent: "ACCOUNTS",
  });
  const listWrap = createElement("div", { className: "sa-list" });
  const emptyMsg = createElement("div", {
    className: "sa-list-empty",
    textContent: "No accounts saved",
  });
  const switchBtn = createElement("button", {
    className: "sa-btn sa-btn-switch",
    textContent: "Switch",
  });
  const delBtn = createElement("button", {
    className: "sa-btn sa-btn-danger",
    textContent: "Delete",
  });
  const overwriteBtn = createElement("button", {
    className: "sa-btn",
    textContent: "Overwrite",
  });
  const actions = createElement("div", {
    className: "sa-actions",
    append: [switchBtn, delBtn, overwriteBtn],
  });
  const input = createElement("input", {
    className: "sa-input",
    placeholder: "account name",
  });
  const saveBtn = createElement("button", {
    className: "sa-btn",
    textContent: "Save",
  });
  const addSection = createElement("div", {
    className: "sa-add-section",
    append: [
      createElement("div", {
        className: "sa-add-label",
        textContent: "SAVE CURRENT AS",
      }),
      createElement("div", {
        className: "sa-input-row",
        append: [input, saveBtn],
      }),
    ],
  });
  const localLogoutBtn = createElement("a", {
    className: "btn btn-small btn-red",
    textContent: "Log Out",
    style: "cursor: pointer; margin-left: 5px;",
  });
  localLogoutBtn.onclick = async () => {
    await setSession("");
    await reloadGameTabs();
  };
  const body = createElement("div", {
    className: "sa-body",
    append: [
      listWrap,
      actions,
      createElement("hr", { className: "sa-divider" }),
      addSection,
    ],
  });
  const notifyElem = createElement("div", { className: "sa-notification" });
  let notifyTimeout = null;
  const notify = (msg, type = "info") => {
    notifyElem.textContent = msg;
    notifyElem.className = `sa-notification sa-notification-${type} show`;
    clearTimeout(notifyTimeout);
    notifyTimeout = setTimeout(() => notifyElem.classList.remove("show"), 2500);
  };
  const menu = createElement("div", {
    className: "sa-panel",
    append: [header, body, notifyElem],
  });
  let selected = null;
  const refresh = async () => {
    listWrap.innerHTML = "";
    const db = await getAccounts();
    const acc = Object.keys(db);
    if (!acc.length) {
      listWrap.appendChild(emptyMsg);
      return;
    }
    const currentToken = await getCurrentSession();
    let foundCurrent = false;
    for (const name of acc) {
      const token = db[name];
      const isCurrent = !foundCurrent && currentToken && token === currentToken;
      if (isCurrent) foundCurrent = true;
      const row = createElement("div", {
        className: "sa-row" + (name === selected ? " selected" : ""),
        append: [
          createElement("span", {
            className: "sa-dot" + (isCurrent ? " current" : ""),
          }),
          createElement("span", { textContent: name }),
          isCurrent
            ? createElement("span", {
                className: "sa-current-tag",
                textContent: "(current)",
              })
            : null,
        ].filter(Boolean),
      });
      row.onclick = () => {
        selected = name;
        listWrap
          .querySelectorAll(".sa-row")
          .forEach((r) => r.classList.remove("selected"));
        row.classList.add("selected");
      };
      row.ondblclick = async () => {
        if (isCurrent) return notify("You are already on this account", "info");
        const success = await switchAccount(name);
        if (success) notify(`Switched to ${name}`, "success");
        else notify("Failed to switch account", "error");
      };
      listWrap.appendChild(row);
    }
  };
  switchBtn.onclick = async () => {
    if (!selected) return notify("Select an account first", "error");
    const currentToken = await getCurrentSession();
    const targetToken = await getAccount(selected);
    if (currentToken && targetToken === currentToken) return notify("You are already on this account", "info");
    const success = await switchAccount(selected);
    if (success) notify(`Switched to ${selected}`, "success");
    else notify("Failed to switch account", "error");
  };
  delBtn.onclick = async () => {
    if (!selected) return notify("Select an account first", "error");
    const name = selected;
    await deleteAccount(name);
    selected = null;
    await refresh();
    notify(`Deleted ${name}`, "success");
  };
  overwriteBtn.onclick = async () => {
    if (!selected) return notify("Select an account first", "error");
    const token = await getCurrentSession();
    if (!token) return notify("No session to save", "error");
    const db = await getAccounts();
    const existingName = Object.keys(db).find(
      (k) => db[k] === token && k !== selected,
    );
    if (existingName)
      return notify(`Token already saved as '${existingName}'`, "error");
    await saveAccount(selected, token);
    notify(`Updated ${selected}`, "success");
  };

  saveBtn.onclick = async () => {
    const name = input.value.trim();
    if (!name) return notify("Enter an account name", "error");
    const db = await getAccounts();
    if (db[name]) return notify(`'${name}' already exists`, "error");
    const token = await getCurrentSession();
    if (!token) return notify("No session to save", "error");
    const existingName = Object.keys(db).find((k) => db[k] === token);
    if (existingName)
      return notify(`Token already saved as '${existingName}'`, "error");
    await saveAccount(name, token);
    notify(`Saved ${name}`, "success");
    input.value = "";
    await refresh();
  };

  input.onkeydown = (e) => {
    if (e.key === "Enter") saveBtn.onclick();
  };

  const reposition = () => {
    const r = btn.getBoundingClientRect();
    menu.style.left = r.left + "px";
    menu.style.top = r.bottom + 6 + "px";
  };

  btn.onclick = async () => {
    const opening = !menu.classList.contains("open");
    menu.classList.toggle("open", opening);
    if (opening) {
      reposition();
      await refresh();
      setTimeout(() => input.focus(), 50);
    }
  };

  root.appendChild(btn);
  return { 
    initMenu: () => {
      addEventListener(document, "click", (e) => {
        if (!root.contains(e.target) && !menu.contains(e.target))
          menu.classList.remove("open");
      });
      document.body.appendChild(menu);
    },
    container: root, 
    id, 
    localLogoutBtn 
  };
};