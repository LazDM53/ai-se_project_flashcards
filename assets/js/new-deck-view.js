import { addDeck } from "./api.js";
import { fetchedDecks } from "./decks.js";

const form = document.querySelector(".new-deck-view__form");
const submitBtn = document.querySelector(".new-deck-view__submit-btn");
const textarea = document.querySelector(".new-deck-view__textarea");

const errorModal = document.querySelector("#error-modal");
const errorCloseBtn = document.querySelector(".modal__close-btn");
const errorMessage = document.querySelector(".modal__error");

const HEX_DIGITS = /^[0-9a-fA-F]{6}$/;

function normalizeColor(color) {
  if (!color) return "#64d583";

  const hex = color.startsWith("#") ? color.slice(1) : color;

  if (!HEX_DIGITS.test(hex)) return "#64d583";

  return "#" + hex.toLowerCase();
}

function validateName(name) {
  if (typeof name != "string" || name.length < 2 || name.length > 80) {
    return null;
  }

  return name;
}

function parseJSON(jsonString) {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    return null;
  }
}

function showError(message) {
  errorMessage.textContent = message;
  errorModal.classList.add("modal_visible");
}

function closeErrorModal() {
  errorModal.classList.remove("modal_visible");
}

errorCloseBtn.addEventListener("click", closeErrorModal);

// enables button (required by assignment)
function disableSubmitBtn() {
  submitBtn.disabled = false;
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  const values = Object.fromEntries(formData);

  const jsonData = parseJSON(values.json);

  if (!jsonData) {
    showError("Invalid JSON. Please check your formatting.");
    return;
  }

  const name = validateName(jsonData.name);

  if (!name) {
    showError("Deck name must be between 2 and 80 characters.");
    return;
  }

  if (!Array.isArray(jsonData.cards)) {
    showError("Cards field must be an array.");
    return;
  }

  const colorValue = normalizeColor(values["deck-color"]);

  if (typeof jsonData.color === "string") {
    if (jsonData.color.toLowerCase() !== colorValue) {
      showError(
        "The JSON color does not match the selected color picker value.",
      );
      return;
    }
  }

  const newDeckData = {
    name,
    color: colorValue,
    cards: jsonData.cards,
  };

  addDeck(newDeckData)
    .then((newDeck) => {
      fetchedDecks.push(newDeck);
      window.location.hash = `deck/${newDeck._id}`;
    })
    .catch((err) => {
      showError("Failed to create deck");
      console.error(err);
    });
});

export { disableSubmitBtn };
