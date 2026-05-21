import { decks } from "./decks.js";

const form = document.querySelector(".new-deck-view__form");
const submitBtn = document.querySelector(".new-deck-view__submit-btn");
const textarea = document.querySelector(".new-deck-view__textarea");

const HEX_DIGITS = /^[0-9a-fA-F]{6}$/;

function slugify(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeColor(color) {
  if (!color) return "#64d583";

  const hex = color.startsWith("#") ? color.slice(1) : color;

  if (!HEX_DIGITS.test(hex)) return "#64d583";

  return "#" + hex.toLowerCase();
}

// enables button (required by assignment)
function disableSubmitBtn() {
  submitBtn.disabled = false;
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  const values = Object.fromEntries(formData);

  let jsonData;

  try {
    if (!values.json) throw new Error("Missing JSON");
    jsonData = JSON.parse(values.json);
  } catch (err) {
    console.error("Invalid JSON:", err);
    return;
  }

  const name = jsonData.name;
  const cards = jsonData.cards;

  const id = `${slugify(name)}-${Date.now()}`;

  const deck = {
    id,
    color: normalizeColor(values["deck-color"]), // 🔥 FIXED
    name,
    cards,
  };

  decks.push(deck);

  window.location.hash = `deck/${id}`;
});

export { disableSubmitBtn };
