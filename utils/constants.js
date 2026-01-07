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

export const setting_btn = [...content_bottom_container.querySelectorAll("button")].find(
  (button) => button.textContent.trim() === "Settings" && button.classList.contains("menu-btn-yellow btn-small last-left")
);

export const chat_container = window_ui_left_container.querySelector("#chat");
export const chat_close = chat_container.querySelector("#close");
export const chat_content = chat_container.querySelector("#chat-content");
export const chat_send_btn = chat_container.querySelector("#chat-send");
export const chat_input = chat_container.querySelector("#chat-input");

export const motd_container = document.getElementById("motd");
export const motd_edit = motd_container.querySelector("#motd-edit");
export const motd_content = motd_container.querySelector("#motd-content");
export const motd_text = motd_content.querySelector("#motd-text");
export const motd_edit_btn = motd_content.querySelector("#motd-edit-button")
export const motd_toggle = motd_container.querySelector("#motd-toggle");
export const motd_textarea = () =>
  motd_edit.querySelector("textarea");
export const motd_save_btn = motd_edit.querySelector(".btn-green");
export const motd_discard_btn = motd_edit.querySelector(".btn-red");

export const team_menu_container = document.getElementById("team_menu");
export const team_manager_button = button_container.querySelector("#team_manager_button");
export const team_players = () => team_menu_container?.querySelector("#team_players");
export const team_log = () => team_players()?.querySelector("#team_log");
export const team_players_inner = () => team_players()?.querySelector("#team_players_inner");
export const team_players_inner_codes = () => team_players_inner()?.querySelectorAll("td > code") || [];
export const team_players_inner_tbody = () => team_players_inner()?.querySelector("tbody");


export const server_section = () => window_dark_container()?.querySelector("section");
export const server_select = () => server_section()?.querySelector("select");
export const server_cards_container = () => server_section()?.querySelector(".serverCards");


// aliases
export const ui_container_left = window_ui_left_container;
export const team_button = team_manager_button;
export const team_player_container = team_menu_container;


// =======================
//        CONSTANTS
// =======================
/**
 * Predefined color for ranks.
 * @readonly
 * @type {Object.<string,string>}
 */
export const colors = {
  owner:"#b388ff", captain:"#55d7ff", crew:"#ffd24d", guest:"#9aa0a6",
  offline:"#7a7f87", banned:"#ff3b3b", online:"#4caf50"
};
