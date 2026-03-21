import { listAccounts, deleteAccount, saveAccount } from "../switchAccountDB.js";
import { switchAccount, getCurrentSession, setSession, reloadGameTabs } from "../accountLoader.js";
import { createElement } from "../../../utils/elements/dom.js";

export const createSwitchAccountBtn = async () => {

  const id   = "switchAccountBtn";
  const root = createElement("div", { id });

  const btn = createElement("a", {
    className:   "btn btn-small btn-yellow",
    textContent: "Accounts",
  });

  const header = createElement("div", {
    className: "sa-header",
    textContent: "ACCOUNTS",
  });

  const listWrap = createElement("div", { className: "sa-list" });
  const emptyMsg = createElement("div", { className: "sa-list-empty", textContent: "No accounts saved" });

  const switchBtn    = createElement("button", { className: "sa-btn sa-btn-switch",  textContent: "Switch" });
  const delBtn       = createElement("button", { className: "sa-btn sa-btn-danger", textContent: "Delete" });
  const overwriteBtn = createElement("button", { className: "sa-btn",               textContent: "Overwrite" });
  const actions      = createElement("div",    { className: "sa-actions", append: [switchBtn, delBtn, overwriteBtn] });

  const input   = createElement("input",  { className: "sa-input",   placeholder: "account name" });
  const saveBtn = createElement("button", { className: "sa-btn",     textContent: "Save" });

  const addSection = createElement("div", {
    className: "sa-add-section",
    append: [
      createElement("div", { className: "sa-add-label", textContent: "SAVE CURRENT AS" }),
      createElement("div", { className: "sa-input-row", append: [input, saveBtn] }),
    ],
  });
  
  const localLogoutBtn = createElement("a", { 
    className: "btn btn-small btn-red", 
    textContent: "Log Out", 
    style: "cursor: pointer; margin-left: 5px;"
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

  const menu = createElement("div", {
    className: "sa-panel",
    append: [header, body],
  });

  let selected = null;

  const refresh = async () => {
    listWrap.innerHTML = "";
    const acc = await listAccounts();
    if (!acc.length) { listWrap.appendChild(emptyMsg); return; }
    acc.forEach(name => {
      const row = createElement("div", {
        className: "sa-row" + (name === selected ? " selected" : ""),
        append: [
          createElement("span", { className: "sa-dot" }),
          createElement("span", { textContent: name }),
        ],
      });
      row.onclick    = () => {
        selected = name;
        listWrap.querySelectorAll(".sa-row").forEach(r => r.classList.remove("selected"));
        row.classList.add("selected");
      };
      row.ondblclick = async () => await switchAccount(name);
      listWrap.appendChild(row);
    });
  };

  switchBtn.onclick = async () => {
    if (!selected) return;
    await switchAccount(selected);
  };

  delBtn.onclick = async () => {
    if (!selected) return;
    await deleteAccount(selected);
    selected = null;
    await refresh();
  };

  overwriteBtn.onclick = async () => {
    if (!selected) return;
    const token = await getCurrentSession();
    if (!token) return;
    await saveAccount(selected, token);
  };

  saveBtn.onclick = async () => {
    const name = input.value.trim();
    if (!name) return;
    const token = await getCurrentSession();
    if (!token) return;
    await saveAccount(name, token);
    input.value = "";
    await refresh();
  };

  input.onkeydown = e => { if (e.key === "Enter") saveBtn.onclick(); };

  const reposition = () => {
    const r = btn.getBoundingClientRect();
    menu.style.left = r.left + "px";
    menu.style.top  = (r.bottom + 6) + "px";
  };

  btn.onclick = async () => {
    const opening = !menu.classList.contains("open");
    menu.classList.toggle("open", opening);
    if (opening) { reposition(); await refresh(); }
  };

  document.addEventListener("click", e => {
    if (!root.contains(e.target) && !menu.contains(e.target))
      menu.classList.remove("open");
  });

  document.body.appendChild(menu);
  root.appendChild(btn);
  return { container: root, id, localLogoutBtn };
};