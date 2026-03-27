import { supabase } from "../utils/social/supabase.js";
import { signInWithOAuth, signOut } from "../utils/social/auth.js";
import { backupPrivateKey, restorePrivateKey } from "../utils/social/backup.js";
import {
  PLUGIN_METADATA,
  getPluginStates,
  togglePluginState,
} from "../utils/plugins.js";
import { getConfig, setConfig } from "../storage/config.js";
import { getByPath } from "../utils/helper.js";
import { qs, qsa, createElement } from "../utils/elements/dom.js";
import { showToast } from "../utils/elements/toast.js";

const checkTabUrl = async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const isDrednot = tab?.url?.match(/^https?:\/\/(.*?\.)?drednot\.io/);
  const mainUI = qs("#main-ui");
  const wrongPage = qs("#wrong-page");
  const openBtn = qs("#open-drednot-btn");
  if (isDrednot) {
    mainUI.style.display = "flex";
    wrongPage.style.display = "none";
    return true;
  } else {
    mainUI.style.display = "none";
    wrongPage.style.display = "flex";
    openBtn.onclick = () => chrome.tabs.create({ url: "https://drednot.io" });
    return false;
  }
};

const updateUI = async () => {
  if (!(await checkTabUrl())) return;
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const loginSection = qs("#login-section");
    const accountSection = qs("#account-section");
    const userEmailText = qs("#user-email-text");
    const emailContainer = qs("#user-email-container");
    if (user) {
      accountSection.style.display = "block";
      loginSection.style.display = "none";
      userEmailText.innerText = "Click to reveal email";
      userEmailText.classList.remove("revealed");
      emailContainer.onclick = () => {
        if (!userEmailText.classList.contains("revealed")) {
          userEmailText.innerText = user.email || "No email";
          userEmailText.classList.add("revealed");
        }
      };
    } else {
      accountSection.style.display = "none";
      loginSection.style.display = "block";
    }
    await renderPlugins();
  } catch (err) {
    console.error("[POPUP] updateUI error:", err);
  }
};

const createSettingElement = async (
  label,
  type,
  value,
  onChange,
  pluginDir,
) => {
  const labelEl = createElement("label", { innerText: label });
  const container = createElement("div", {
    className: "setting-item",
    style:
      "display:flex; justify-content:space-between; align-items:center; padding:8px 0;",
    children: [labelEl],
  });

  if (type === "checkbox") {
    const input = createElement("input", { type: "checkbox", checked: value });
    input.onchange = (e) => onChange(e.target.checked);
    const slider = createElement("span", { className: "slider" });
    const switchEl = createElement("label", {
      className: "switch",
      children: [input, slider],
    });
    container.appendChild(switchEl);
  } else if (type === "text" || type === "number") {
    const input = createElement("input", {
      type,
      value,
      className: "input-sm",
      style: "width:60px;",
    });
    input.onchange = (e) => onChange(e.target.value);
    container.appendChild(input);
  } else if (type === "register") {
    container.style.cssText =
      "display:flex; flex-direction:column; align-items:stretch; gap:10px; padding:8px 0;";
    labelEl.style.cssText = "font-weight:600; margin-bottom:4px;";

    const inputs = {};
    const fieldsWrapper = createElement("div", {
      style: "display:flex; flex-direction:column; gap:6px;",
    });

    for (const field of value.fields || []) {
      const fieldLabel = createElement("label", {
        innerText: field.label,
        style: "font-size:11px; color:var(--text-secondary);",
      });
      const input = createElement("input", {
        type: "text",
        placeholder: field.placeholder || field.label,
        style:
          "padding:7px 10px; border:1px solid var(--border-color); border-radius:6px; font-size:13px; outline:none; width:100%;",
      });
      inputs[field.key] = input;
      fieldsWrapper.appendChild(
        createElement("div", {
          style: "display:flex; flex-direction:column; gap:2px;",
          children: [fieldLabel, input],
        }),
      );
    }

    const submitBtn = createElement("button", {
      className: "btn",
      innerText: "Register",
      style:
        "background:var(--primary-color); color:white; margin-top:4px; margin-bottom:0;",
    });

    const listTitle = createElement("p", {
      innerText: value.listLabel || "Registered Items",
      style:
        "font-size:11px; color:var(--text-secondary); text-transform:uppercase; letter-spacing:0.5px;",
    });
    const listWrapper = createElement("div", {
      style: "display:flex; flex-direction:column; gap:6px; margin-top:8px;",
      children: [listTitle],
    });

    const renderList = async () => {
      while (listWrapper.children.length > 1)
        listWrapper.removeChild(listWrapper.lastChild);
      const config = await getConfig();
      const saved = getByPath(config, `PLUGIN.${pluginDir}.${value.key}`) || [];
      if (saved.length === 0) {
        listWrapper.appendChild(
          createElement("p", {
            innerText: `No ${(value.listLabel || "items").toLowerCase()} yet.`,
            style: "font-size:12px; color:var(--text-secondary);",
          }),
        );
        return;
      }
      saved.forEach((entry, i) => {
        const text = createElement("span", {
          innerText: Object.values(entry).join(" → "),
        });
        const removeBtn = createElement("button", {
          innerHTML: '<i class="fas fa-times"></i>',
          style:
            "background:none; border:none; cursor:pointer; color:#ff4d4d; font-size:13px; padding:2px 4px;",
        });
        removeBtn.onclick = async () => {
          const cfg = await getConfig();
          const list = [
            ...(getByPath(cfg, `PLUGIN.${pluginDir}.${value.key}`) || []),
          ];
          list.splice(i, 1);
          await setConfig({ PLUGIN: { [pluginDir]: { [value.key]: list } } });
          await renderList();
        };
        listWrapper.appendChild(
          createElement("div", {
            style:
              "display:flex; justify-content:space-between; align-items:center; padding:6px 10px; background:#f8f9fa; border-radius:6px; font-size:13px;",
            children: [text, removeBtn],
          }),
        );
      });
    };

    submitBtn.onclick = async () => {
      const entry = {};
      for (const field of value.fields || []) {
        const val = inputs[field.key].value.trim();
        if (!val && field.required) {
          submitBtn.innerText = "Fill all fields!";
          setTimeout(() => (submitBtn.innerText = "Register"), 1500);
          return;
        }
        entry[field.key] = val;
      }
      const cfg = await getConfig();
      const existing = [
        ...(getByPath(cfg, `PLUGIN.${pluginDir}.${value.key}`) || []),
      ];
      existing.push(entry);
      await setConfig({ PLUGIN: { [pluginDir]: { [value.key]: existing } } });
      for (const field of value.fields || []) inputs[field.key].value = "";
      submitBtn.innerText = "Registered!";
      showToast(value.toastMessage || "Registered!", { type: "success" });
      setTimeout(() => (submitBtn.innerText = "Register"), 1500);
      await renderList();
    };
    container.append(fieldsWrapper, submitBtn, listWrapper);
    await renderList();
  }
  return container;
};

const DB_PAGE_SIZE = 20;

const renderTreeNode = (key, value, container, depth = 0) => {
  const indent = depth * 12;
  const isObject = typeof value === "object" && value !== null && !Array.isArray(value);
  const isArray = Array.isArray(value);
  const isPrimitive = !isObject && !isArray;

  // For primitive values: show key: value inline on one row, no expand needed
  if (isPrimitive) {
    const isImg =
      typeof value === "string" &&
      value.startsWith("http") &&
      (value.includes(".png") || value.includes(".jpg") || value.includes(".webp") || value.includes(".pnj") || value.includes("tumblr") || value.includes("imgur"));
    const valEl = isImg
      ? createElement("img", { src: value, style: "width:20px; height:20px; border-radius:3px; object-fit:cover;" })
      : createElement("span", { innerText: String(value), style: "font-size:12px; color:var(--text-color); word-break:break-all;" });
    const row = createElement("div", {
      style: `display:flex; align-items:center; gap:6px; padding:4px 0 4px ${indent}px;`,
      children: [
        createElement("i", { className: "fas fa-file-alt", style: "font-size:11px; color:var(--text-secondary); flex-shrink:0;" }),
        createElement("span", { innerText: `${key}:`, style: "font-size:12px; font-weight:600; color:var(--text-secondary); flex-shrink:0;" }),
        valEl,
      ],
    });
    container.appendChild(row);
    return;
  }

  // For objects and arrays: collapsible row
  const row = createElement("div", {
    style: `display:flex; align-items:center; gap:6px; padding:5px 0 5px ${indent}px; cursor:pointer; user-select:none;`,
  });
  const icon = createElement("i", {
    className: isArray ? "fas fa-list" : "fas fa-folder",
    style: `font-size:12px; color:var(--primary-color);`,
  });
  const chevron = createElement("i", {
    className: "fas fa-chevron-right",
    style: "font-size:9px; color:var(--text-secondary); transition:transform 0.15s;",
  });
  const countBadge = createElement("span", {
    innerText: isArray ? `${value.length}` : `${Object.keys(value).length}`,
    style: "font-size:10px; color:var(--text-secondary); background:#f1f3f5; border-radius:4px; padding:1px 5px; margin-left:2px;",
  });
  const label = createElement("span", {
    innerText: key,
    style: "font-size:13px; font-weight:600;",
  });
  row.append(chevron, icon, label, countBadge);
  const childContainer = createElement("div", {
    style: `border-left:2px solid var(--border-color); margin-left:${indent + 8}px; display:none;`,
  });
  if (isObject) {
    let open = false;
    row.onclick = () => {
      open = !open;
      childContainer.style.display = open ? "block" : "none";
      chevron.style.transform = open ? "rotate(90deg)" : "";
      icon.className = open ? "fas fa-folder-open" : "fas fa-folder";
    };
    for (const [k, v] of Object.entries(value)) {
      renderTreeNode(k, v, childContainer, depth + 1);
    }
  } else if (isArray) {
    let open = false;
    row.onclick = () => {
      open = !open;
      childContainer.style.display = open ? "block" : "none";
      chevron.style.transform = open ? "rotate(90deg)" : "";
    };
    if (value.length === 0) {
      childContainer.appendChild(
        createElement("p", {
          innerText: "Empty array",
          style: `font-size:12px; color:var(--text-secondary); padding:4px 0 4px 8px;`,
        }),
      );
    } else {
      value.forEach((item, i) => {
        if (typeof item === "object" && item !== null) {
          renderTreeNode(String(i), item, childContainer, depth + 1);
        } else {
          const imgEl = typeof item === "string" && item.startsWith("http") && (item.includes(".png") || item.includes(".jpg") || item.includes(".webp"))
            ? createElement("img", { src: item, style: "width:20px; height:20px; border-radius:3px; object-fit:cover; flex-shrink:0;" })
            : null;
          childContainer.appendChild(createElement("div", {
            style: `display:flex; align-items:center; gap:8px; padding:3px 0 3px 8px;`,
            children: [
              createElement("span", { innerText: `${i}:`, style: "font-size:11px; color:var(--text-secondary); flex-shrink:0;" }),
              ...(imgEl ? [imgEl] : [createElement("span", { innerText: String(item), style: "font-size:12px; color:var(--text-color); word-break:break-all;" })]),
            ],
          }));
        }
      });
    }
  }

  container.appendChild(row);
  container.appendChild(childContainer);
};

const viewPluginDatabase = async (plugin) => {
  const listView = qs("#plugin-list-view");
  const settingsView = qs("#plugin-settings-view");
  const pluginNameTitle = qs("#settings-plugin-name");
  const settingsContent = qs("#settings-content");
  const backBtn = qs("#settings-back-btn");
  pluginNameTitle.innerText = `${plugin.displayName || plugin.dir} — Database`;
  listView.style.display = "none";
  settingsView.style.display = "block";
  settingsContent.innerHTML = "Loading...";

  // Disconnect any previous IntersectionObserver on this view
  if (settingsView._dbObserver) {
    settingsView._dbObserver.disconnect();
    settingsView._dbObserver = null;
  }

  backBtn.onclick = () => {
    if (settingsView._dbObserver) {
      settingsView._dbObserver.disconnect();
      settingsView._dbObserver = null;
    }
    listView.style.display = "block";
    settingsView.style.display = "none";
  };

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  let files = [];
  try {
    files = await chrome.tabs.sendMessage(tab.id, {
      type: "dredutils:getPluginDatabase",
      namespace: plugin.databaseNamespace,
    });
  } catch (err) {
    settingsContent.innerHTML = `<p style="color:#ff4d4d; font-size:13px;">Failed to read database: ${err.message}</p>`;
    return;
  }

  settingsContent.innerHTML = "";

  if (!files || files.length === 0) {
    settingsContent.appendChild(
      createElement("p", {
        innerText: "No database entries found.",
        style: "font-size:13px; color:var(--text-secondary);",
      }),
    );
    return;
  }

  // Build the tree from flat file list
  const ns = plugin.databaseNamespace;
  const tree = {};
  for (const file of files) {
    const rel = file.id.slice(ns.length + 1);
    const parts = rel.split("/");
    let node = tree;
    for (let i = 0; i < parts.length - 1; i++) {
      node[parts[i]] ??= {};
      node = node[parts[i]];
    }
    const leaf = parts[parts.length - 1];
    try {
      node[leaf] = JSON.parse(file.content);
    } catch {
      node[leaf] = file.content;
    }
  }

  // Namespace header
  settingsContent.appendChild(
    createElement("p", {
      innerText: `${ns}/`,
      style:
        "font-size:11px; color:var(--primary-color); font-weight:700; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:8px;",
    }),
  );

  // Infinite-scroll: render top-level keys in batches
  const topEntries = Object.entries(tree);
  let renderedCount = 0;

  const loadMoreEntries = () => {
    const batch = topEntries.slice(renderedCount, renderedCount + DB_PAGE_SIZE);
    if (batch.length === 0) return false;
    for (const [key, value] of batch) {
      renderTreeNode(key, value, settingsContent, 0);
    }
    renderedCount += batch.length;
    return renderedCount < topEntries.length;
  };

  // Render first batch immediately
  const hasMore = loadMoreEntries();

  if (hasMore) {
    // Counter label
    const countLabel = createElement("p", {
      innerText: `Showing ${renderedCount} / ${topEntries.length}`,
      style:
        "font-size:11px; color:var(--text-secondary); text-align:center; margin:4px 0;",
    });

    // Sentinel element watched by IntersectionObserver
    const sentinel = createElement("div", {
      style: "height:1px;",
    });

    settingsContent.appendChild(countLabel);
    settingsContent.appendChild(sentinel);

    // The scrollable parent is settingsContent itself (or settingsView — whichever overflows)
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        const stillMore = loadMoreEntries();
        countLabel.innerText = `Showing ${renderedCount} / ${topEntries.length}`;
        if (!stillMore) {
          observer.disconnect();
          settingsView._dbObserver = null;
          countLabel.innerText = `All ${topEntries.length} entries loaded`;
          sentinel.remove();
        }
      },
      {
        root: settingsContent,   // scroll container
        rootMargin: "0px",
        threshold: 0,
      },
    );

    observer.observe(sentinel);
    settingsView._dbObserver = observer;
  }
};

const renderPluginSettings = async (container, pluginDir, settingsConfig) => {
  container.innerHTML = "";
  const config = await getConfig();
  for (const setting of settingsConfig) {
    const path = `PLUGIN.${pluginDir}.${setting.key}`;
    const value =
      setting.type === "register"
        ? setting
        : (getByPath(config, path) ?? setting.default);
    const el = await createSettingElement(
      setting.label,
      setting.type,
      value,
      async (newValue) => {
        await setConfig({
          PLUGIN: { [pluginDir]: { [setting.key]: newValue } },
        });
      },
      pluginDir,
    );
    container.appendChild(el);
  }
};

const renderPlugins = async () => {
  const pluginList = qs("#plugin-list");
  try {
    const plugins = PLUGIN_METADATA();
    const states = await getPluginStates();
    if (plugins.length === 0) {
      pluginList.innerHTML = "<p>No plugins found.</p>";
      return;
    }
    pluginList.innerHTML = plugins
      .map(
        (p) => `
        <div class="plugin-item">
          <div class="plugin-info">
            <h4>${p.displayName || p.dir.charAt(0).toUpperCase() + p.dir.slice(1)}</h4>
          </div>
          <div class="plugin-actions">
            ${
              p.databaseNamespace
                ? `<button class="plugin-db-btn" data-plugin-db="${p.dir}" title="View Database">
                  <i class="fas fa-database"></i>
                </button>`
                : ""
            }
            ${
              p.settings
                ? `<button class="plugin-settings-btn" data-plugin="${p.dir}" title="Settings">
                  <i class="fas fa-cog"></i>
                </button>`
                : ""
            }
            <label class="switch">
              <input type="checkbox" data-plugin="${p.dir}" ${states[p.dir] ? "checked" : ""}>
              <span class="slider"></span>
            </label>
          </div>
        </div>`,
      )
      .join("");
    qsa(".plugin-settings-btn", pluginList).forEach((btn) => {
      btn.onclick = (e) => {
        const pluginDir = e.currentTarget.getAttribute("data-plugin");
        const plugin = plugins.find((p) => p.dir === pluginDir);
        openPluginSettings(plugin);
      };
    });
    qsa(".plugin-db-btn", pluginList).forEach((btn) => {
      btn.onclick = (e) => {
        const pluginDir = e.currentTarget.getAttribute("data-plugin-db");
        const plugin = plugins.find((p) => p.dir === pluginDir);
        viewPluginDatabase(plugin);
      };
    });

    qsa('input[type="checkbox"]', pluginList).forEach((input) => {
      input.onchange = async (e) => {
        const pluginId = e.target.getAttribute("data-plugin");
        await togglePluginState(pluginId);
      };
    });
  } catch (err) {
    console.error("[POPUP] renderPlugins error:", err);
    pluginList.innerHTML = "<p>Error loading plugins.</p>";
  }
};

const openPluginSettings = (plugin) => {
  const listView = qs("#plugin-list-view");
  const settingsView = qs("#plugin-settings-view");
  const pluginNameTitle = qs("#settings-plugin-name");
  const settingsContent = qs("#settings-content");
  const backBtn = qs("#settings-back-btn");
  pluginNameTitle.innerText = plugin.displayName || plugin.dir;
  if (plugin.settings && Array.isArray(plugin.settings)) renderPluginSettings(settingsContent, plugin.dir, plugin.settings);
  else settingsContent.innerHTML = `<p>No settings available for <b>${plugin.displayName || plugin.dir}</b>.</p>`;
  listView.style.display = "none";
  settingsView.style.display = "block";
  backBtn.onclick = () => {
    listView.style.display = "block";
    settingsView.style.display = "none";
  };
};

// Tab Switching
qsa(".nav-item").forEach((item) => {
  item.addEventListener("click", () => {
    const tab = item.getAttribute("data-tab");
    qsa(".nav-item").forEach((n) => n.classList.remove("active"));
    item.classList.add("active");
    qsa(".tab-content").forEach((c) => c.classList.remove("active"));
    qs(`#${tab}`).classList.add("active");
  });
});

// OAuth handlers
qs("#discord-login-btn").onclick = () => handleOAuth("discord");
const handleOAuth = async (provider) => {
  const btn = qs(`#${provider}-login-btn`);
  const spinner = qs("#login-spinner");
  const span = btn.querySelector("span");
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      updateUI();
      return;
    }
    btn.disabled = true;
    if (spinner) spinner.style.display = "inline-block";
    if (span) span.innerText = "Logging in...";
    await signInWithOAuth(provider);
    updateUI();
  } catch (err) {
    showToast("Login failed: " + err.message, { type: "error" });
  } finally {
    btn.disabled = false;
    if (spinner) spinner.style.display = "none";
    if (span)
      span.innerText = `Login with ${provider.charAt(0).toUpperCase() + provider.slice(1)}`;
  }
};

// Backup / Restore
qs("#backup-btn").onclick = async () => {
  const password = prompt("Enter a password to encrypt your backup:");
  if (password) {
    try {
      await backupPrivateKey(password);
      showToast("Backup successful!", { type: "success" });
    } catch (err) {
      showToast("Backup failed: " + err.message, { type: "error" });
    }
  }
};

qs("#restore-btn").onclick = async () => {
  const password = prompt("Enter your backup password:");
  if (password) {
    try {
      await restorePrivateKey(password);
      showToast("Restore successful!", { type: "success" });
      updateUI();
    } catch (err) {
      showToast("Restore failed: " + err.message, { type: "error" });
    }
  }
};

qs("#logout-btn").onclick = async () => {
  await signOut();
  updateUI();
};

updateUI();