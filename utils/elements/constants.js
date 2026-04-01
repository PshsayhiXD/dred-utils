// =======================
//      DOM ELEMENTS
// =======================
export const window_container = document.getElementById("window-container");
export const window_ui_left_container = window_container.querySelector("#ui-container-left");

export const big_ui_container = document.getElementById("big-ui-container");
export const window_dark_container = () => big_ui_container.querySelector(".window.dark");
export const content_bottom_container = document.getElementById("content-bottom");
export const game_container = document.getElementById("game-container");
export const canvas = document.getElementById("canvas-game");
export const station_ui_container = window_container.querySelector("#station-ui");
export const pui_container = window_container.querySelector("#pui");
export const item_ui_container = document.getElementById("item-ui-container");
export const disconnect_pop_up = () => window_container.querySelector("#disconnect-popup") || "#disconnect-popup";
export const content_bottom = document.getElementById("content-bottom");
export const button_container = content_bottom.querySelector(".button-container");
export const container_right = content_bottom.querySelector(".container-right");
export const bottom_bar = container_right.querySelector("#bottom-bar");

export const top_bar = document.getElementById("top-bar");

export const setting_btn = () =>
  content_bottom_container?.querySelector(
    "button.btn-yellow.btn-small.last-left"
  ) || "button.btn-yellow.btn-small.last-left";

export const shipyard = () => 
  document.getElementById("shipyard") || "shipyard";
export const shipyard_ships = () => typeof shipyard() === "string" ? "#shipyard-ships" 
  : shipyard().querySelector("#shipyard-ships") || "#shipyard-ships";
export const shipyard_loading = () => typeof shipyard_ships() === "string" ? null : shipyard_ships().firstElementChild || null;
// =======================
//     CHAT (functions only)
// =======================
export const chat_container = () =>
  ui_container_left.querySelector("#chat") || "#chat";

export const chat_close = () =>
  chat_container().querySelector("#chat-close") || "#chat-close";

export const chat_content = () =>
  chat_container().querySelector("#chat-content") || "#chat-content";

export const chat_send_btn = () =>
  chat_container().querySelector("#chat-send") || "#chat-send";

export const chat_input = () =>
  chat_container().querySelector("#chat-input") || "#chat-input";

// =======================
//      MOTD (functions only)
// =======================
export const motd_container = document.getElementById("motd");

export const motd_edit = () =>
  motd_container.querySelector("#motd-edit") || "motd-edit";

export const motd_content = () =>
  motd_container.querySelector("#motd-content") || "motd-content";

export const motd_text = () =>
  motd_container.querySelector("#motd-text") || "motd-text";

export const motd_edit_btn = () =>
  motd_container.querySelector("#motd-edit-button") || "motd-edit-button";

export const motd_toggle = () =>
  motd_container.querySelector("#motd-toggle") || "motd-toggle";

export const motd_textarea = () =>
  motd_container.querySelector("#motd-textarea") || "motd-textarea";

export const motd_save_btn = () =>
  motd_container.querySelector("#motd-save-button") || "motd-save-button";

export const motd_discard_btn = () =>
  motd_container.querySelector("#motd-discard-button") || "motd-discard-button";

// =======================
//      TEAM MENU (functions only)
// =======================
export const team_menu_container = () =>
  document.getElementById("team_menu") || "team_menu";

export const team_manager_button = () =>
  button_container.querySelector("#team_manager_button") || "team_manager_button";

export const team_menu_buttons = () =>
  team_menu_container()?.querySelectorAll(":scope > div > div > button") || [];

export const team_menu_ship_settings_btn = () =>
  team_menu_buttons()[0] || null;

export const team_menu_crew_control_btn = () =>
  team_menu_container()?.querySelector("button.btn-green") || "button.btn-green";

export const team_players = () =>
  team_menu_container()?.querySelector("#team_players") || "team_players";

export const team_log = () =>
  team_players()?.querySelector("#team_log") || "team_log";

export const team_input = () =>
  team_players()?.querySelector("input") || null;

export const team_players_inner = () =>
  team_players()?.querySelector("#team_players_inner") || "team_players_inner";

export const team_players_inner_meme_btn = (side) => {
  if (!["up", "down", "left", "right"].includes(side)) return false;
  if (team_input().value !== "coolsnake303") return false;
  return team_players_inner()?.querySelector(`button.btn-meme i.fa-arrow-${side}`) || `button.btn-meme i.fa-arrow-${side}`;
};

export const team_players_inner_meme_btns = () => {
  if (team_input().value !== "coolsnake303") return [];
  return team_players_inner()?.querySelectorAll("button.btn-meme") || [];
};

export const team_players_inner_codes = () =>
  team_players_inner()?.querySelectorAll("td > code") || [];

export const team_players_inner_tbody = () =>
  team_players_inner()?.querySelector("tbody") || "tbody";

// =======================
//    SECTIONS (functions only)
// =======================
export const server_section = () => {
  const win =
    big_ui_container.querySelector(".window.dark");
  return win?.querySelectorAll("section")[0] || null;
};
export const server_select = () => server_section()?.querySelector("select") || null;

export const account_section = () => {
  const win =
    big_ui_container.querySelector(".window.dark");
  return win?.querySelectorAll("section")[1] || null;
};
export const account_username = () => account_section().querySelector("code.user") || null;
export const account_badge = () => account_section().querySelector(".user-badge") || null;
export const account_manage_btn = () => account_section().querySelector("a.btn.btn-small") || null;
export const account_logout_btn = () => account_section().querySelector("button.btn-small.button-orange") || null;

export const ship_list_section = () => {
  const win =
    big_ui_container.querySelector(".window.dark");
  return win?.querySelectorAll("section")[2] || null;
};
export const ship_list_refresh_btn = () => ship_list_section().querySelector("button.btn-small") || null;
export const ship_list_section_title = () => ship_list_section().querySelector("h3") || null;
export const ship_list_p = () => ship_list_section().querySelectorAll("p") || [];
export const ship_list_p1 = () => ship_list_p()[0];
export const ship_list_p2 = () => ship_list_p()[1];
export const ship_list_p3 = () => ship_list_p()[2];
export const ship_list_p4 = () => ship_list_p()[3];

export const ship_list_ship_input = () => ship_list_p1().querySelector("input") || null;


// =======================
//        ALIASES
// =======================
export const ui_container_left = window_ui_left_container;