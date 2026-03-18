import { waitForElement } from "./dom.js";

// =======================
//      DOM ELEMENTS
// =======================
export const window_container = document.getElementById("window-container");
export const window_ui_left_container = window_container.querySelector("#ui-container-left");

export const big_ui_container = document.getElementById("big-ui-container");
export const window_dark_container = () => big_ui_container.querySelector(".window.dark");
export const button_container = document.querySelector(".button-container");
export const content_bottom_container = document.getElementById("content-bottom");
export const game_container = document.getElementById("game-container");
export const canvas = document.getElementById("canvas-game");
export const station_ui_container = window_container.querySelector("#station-ui");
export const pui_container = window_container.querySelector("#pui");
export const item_ui_container = document.getElementById("item-ui-container");

export const setting_btn = () =>
  content_bottom_container?.querySelector(
    "button.btn-yellow.btn-small.last-left"
  ) || null;

export const shipyard = async () => 
  await waitForElement(document, "#shipyard") || null;
export const shipyard_ships= async () => {
  const el = await shipyard();
  return el?.querySelector("#shipyard-ships") || await waitForElement(el, "#shipyard-ships") || null;
};
export const shipyard_loading=async()=>{
  const el = await shipyard_ships();
  return el?.firstElementChild || await waitForElement(el, ":scope > *") || null;
};

// =======================
//     CHAT (functions only)
// =======================
export const chat_container = async () =>
  document.getElementById("chat") ||
  (await waitForElement(window_ui_left_container, "#chat")) || null;

export const chat_close = async () =>
  (await chat_container())?.querySelector("#chat-close") || null;

export const chat_content = async () =>
  (await chat_container())?.querySelector("#chat-content") || null;

export const chat_send_btn = async () =>
  (await chat_container())?.querySelector("#chat-send") || null;

export const chat_input = async () =>
  (await chat_container())?.querySelector("#chat-input") || null;

// =======================
//      MOTD (functions only)
// =======================
export const motd_container = document.getElementById("motd");

export const motd_edit = async () =>
  motd_container.querySelector("#motd-edit") ||
  (await waitForElement(motd_container, "#motd-edit"));

export const motd_content = async () =>
  motd_container.querySelector("#motd-content") ||
  (await waitForElement(motd_container, "#motd-content"));

export const motd_text = async () =>
  (await motd_content())?.querySelector("#motd-text") || null;

export const motd_edit_btn = async () =>
  (await motd_content())?.querySelector("#motd-edit-button") || null;

export const motd_toggle = () =>
  motd_container.querySelector("#motd-toggle") || null;

export const motd_textarea = async () =>
  (await motd_edit())?.querySelector("textarea") || null;

export const motd_save_btn = async () =>
  (await motd_edit())?.querySelector(".btn-green") || null;

export const motd_discard_btn = async () =>
  (await motd_edit())?.querySelector(".btn-red") || null;

// =======================
//      TEAM MENU (functions only)
// =======================
export const team_menu_container = async () =>
  document.getElementById("team_menu") ||
  await waitForElement(document, "#team_menu", 5000);

export const team_manager_button = () =>
  button_container.querySelector("#team_manager_button") || null;

export const team_menu_buttons = async () =>
  (await team_menu_container())?.querySelectorAll(":scope > div > div > button") || [];

export const team_menu_ship_settings_btn = async () =>
  (await team_menu_buttons())[0] || null;

export const team_menu_crew_control_btn = async () =>
  (await team_menu_container())?.querySelector("button.btn-green") || null;

export const team_players = async () =>
  (await team_menu_container())?.querySelector("#team_players") || null;

export const team_log = async () =>
  (await team_players())?.querySelector("#team_log") || null;

export const team_players_inner = async () =>
  (await team_players())?.querySelector("#team_players_inner") || null;

export const team_players_inner_codes = async () =>
  (await team_players_inner())?.querySelectorAll("td > code") || [];

export const team_players_inner_tbody = async () =>
  (await team_players_inner())?.querySelector("tbody") || null;

// =======================
//    SECTIONS (functions only)
// =======================
export const server_section = async () => {
  const win =
    big_ui_container.querySelector(".window.dark") ||
    (await waitForElement(big_ui_container, ".window.dark"));
  return win?.querySelectorAll("section")[0] || null;
};
export const server_select = async () =>
  (await server_section())?.querySelector("select") || null;

export const account_section = async () => {
  const win =
    big_ui_container.querySelector(".window.dark") ||
    (await waitForElement(big_ui_container, ".window.dark"));
  return win?.querySelectorAll("section")[1] || null;
};
export const account_username = async () => {
  const el = (await account_section()).querySelector("code.user");
  return el || null;
};
export const account_badge = async () => {
  const el = (await account_section()).querySelector(".user-badge");
  return el || null;
};
export const account_manage_btn = async () => {
  const el = (await account_section()).querySelector("a.btn.btn-small");
  return el || null;
};
export const account_logout_btn = async () => {
  const el = (await account_section()).querySelector("button.btn-small.button-orange");
  return el || null;
};

export const ship_list_section = async () => {
  const win =
    big_ui_container.querySelector(".window.dark") ||
    (await waitForElement(big_ui_container, ".window.dark"));
  return win?.querySelectorAll("section")[2] || null;
};
// =======================
//        ALIASES
// =======================
export const ui_container_left = window_ui_left_container;
export const team_button = team_manager_button;
export const team_players_container = team_menu_container;
export const team_menu_inner = team_players_inner;
export const team_menu_inner_codes = team_players_inner_codes;
export const team_menu_inner_tbody = team_players_inner_tbody;