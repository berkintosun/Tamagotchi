export const TICK_RATE = 1000;
export const ICONS = ["fish", "poop", "weather"];
export const RAIN_CHANCE = 0.3;
export const SCENES = ["day", "rain"];
export const DAY_LENGTH = 20;
export const NIGHT_LENGTH = 3;
export const getNextHungerTime = (clock) =>
  Math.floor(Math.random() * 4) + 4 + clock;
export const getNextDieTime = (clock) =>
  Math.floor(Math.random() * 2) + 3 + clock;
export const getNextPoopTime = (clock) =>
  Math.floor(Math.random() * 4) + 4 + clock;
export const writeModal = (text) =>
  (document.querySelector(
    ".modal"
  ).innerHTML = `<div class="modal-inner">${text}</div>`);
