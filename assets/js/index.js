import { deleteDeck } from "./api.js";
import { removeDeckByID } from "./decks.js";
import { disableSubmitBtn } from "./new-deck-view.js";
import { renderDeckView } from "./deckView.js";
import { getDeckByID, fetchedDecks } from "./decks.js";
import { getDecks } from "./api.js";
import { hexToString, removeColorClasses } from "./colorMap.js";
import { renderCarouselView } from "./carousel.js";

// DOM Elements
const page = document.querySelector(".page");

const homeSection = document.querySelector(".gallery");
const homeGalleryList = homeSection.querySelector(".gallery__list");

const deckViewSection = document.querySelector("#deck-view");

const deckTemplate = document.getElementById("deck-template");
const carouselSection = document.querySelector(".carousel");
const notFoundSection = document.querySelector("#not-found");
const aboutSection = document.querySelector("#about");

const newDeckSection = document.querySelector("#new-deck-view");

const newDeckBtn = homeSection.querySelector(".gallery__new-card-btn");

// STATE (replaces local decks.js data)
let currentDecks = [];

// ----------------------
// Helpers
// ----------------------
/**
 * Logs and displays a user-facing error message.
 *
 * @param {string} message - The error text to show.
 */
function showError(message) {
  console.error(message);

  const errorEl = document.querySelector(".error");
  if (errorEl) {
    errorEl.textContent = message;
    errorEl.style.display = "block";
  }
}

// ----------------------
// Deck Rendering
// ----------------------
/**
 * Creates a deck card element for the home gallery.
 *
 * @param {Object} deck - The deck details to render.
 * @returns {DocumentFragment} A cloned deck card fragment.
 */
function createDeckEl(deck) {
  const deckEl = deckTemplate.content.cloneNode(true);
  const li = deckEl.querySelector(".card");

  removeColorClasses(li);

  const colorName = hexToString(deck.color) || "green";
  li.classList.add(`card_color_${colorName}`);

  li.querySelector(".card__title").textContent = deck.name;
  li.querySelector(".card__count").textContent = `${deck.cards.length} cards`;

  const deleteBtn = li.querySelector(".card__delete-btn");
  deleteBtn.addEventListener("click", (evt) => {
    evt.preventDefault();
    evt.stopPropagation();

    deleteDeck(deck._id)
      .then(() => {
        // 1. remove from UI state
        const index = currentDecks.findIndex((d) => d._id === deck._id);

        if (index !== -1) {
          currentDecks.splice(index, 1);
        }

        // 2. remove from fetched cache
        removeDeckByID(deck._id);

        // 3. update UI
        renderAllDecks();

        // 4. fix navigation if user is inside deleted deck
        if (window.location.hash === `#carousel/${deck._id}`) {
          window.location.hash = "#home";
        }
      })
      .catch(() => {
        showError("Failed to delete deck");
      });
  });

  const linkEl = li.querySelector(".card__link");
  linkEl.href = `#deck/${deck._id}`;
  linkEl.setAttribute("aria-label", `Open deck: ${deck.name}`);

  return deckEl;
}

/**
 * Renders every current deck card in the home gallery.
 */
function renderAllDecks() {
  homeGalleryList.innerHTML = "";

  currentDecks.forEach((deck) => {
    const deckEl = createDeckEl(deck);
    homeGalleryList.prepend(deckEl);
  });
}

// ----------------------
// Show / Hide Sections
// ----------------------
/**
 * Shows one section and hides the rest of the page sections.
 *
 * @param {HTMLElement} currentSection - The section to reveal.
 * @param {string} displayValue - The CSS display mode to apply.
 */
function showView(currentSection, displayValue) {
  const sections = [
    homeSection,
    deckViewSection,
    carouselSection,
    notFoundSection,
    aboutSection,
    newDeckSection,
  ];

  sections.forEach((section) => {
    section.style.display = "none";
  });

  currentSection.style.display = displayValue;
}

/**
 * Shows the home deck list view.
 */
function showDeckList() {
  page.classList.remove("page_no-mobile-bar");
  page.classList.remove("page_location_carousel");
  showView(homeSection, "block");
}

/**
 * Shows the deck detail view.
 */
function showDeckView() {
  page.classList.remove("page_no-mobile-bar");
  page.classList.remove("page_location_carousel");
  showView(deckViewSection, "block");
}

/**
 * Shows the about page section.
 */
function showAbout() {
  page.classList.remove("page_no-mobile-bar");
  page.classList.remove("page_location_carousel");
  showView(aboutSection, "block");
}

/**
 * Shows the new deck creation view.
 */
function showNewDeckView() {
  page.classList.remove("page_no-mobile-bar");
  page.classList.remove("page_location_carousel");
  showView(newDeckSection, "block");
}

/**
 * Shows the not-found section for invalid routes.
 */
function showNotFound() {
  page.classList.add("page_no-mobile-bar");
  page.classList.remove("page_location_carousel");
  showView(notFoundSection, "block");
}

// ----------------------
// Router
// ----------------------
/**
 * Resolves the current hash route and renders the matching page section.
 */
function handleRoute() {
  const hash = window.location.hash.slice(1);

  if (!hash || hash === "home") {
    showDeckList();
    return;
  }

  if (hash === "about") {
    showAbout();
    return;
  }

  if (hash === "new-deck-view") {
    showNewDeckView();
    disableSubmitBtn();
    return;
  }

  if (hash.startsWith("deck/")) {
    const [, deckId] = hash.split("/");
    const currentDeck = currentDecks.find((deck) => deck._id === deckId);

    if (currentDeck) {
      renderDeckView(currentDeck, showDeckView);
    } else {
      showNotFound();
    }

    return;
  }

  if (hash.startsWith("carousel/")) {
    const [, deckId] = hash.split("/");

    if (!deckId) {
      showNotFound();
      return;
    }

    const currentDeck = getDeckByID(deckId);
    const deckStillExists = currentDecks.some((deck) => deck._id === deckId);

    if (currentDeck && deckStillExists) {
      renderCarouselView(currentDeck);
    } else {
      showNotFound();
    }

    return;
  }

  showNotFound();
}

// ----------------------
// INIT: Fetch decks from API
// ----------------------
document.addEventListener("DOMContentLoaded", () => {
  getDecks()
    .then((decks) => {
      fetchedDecks.push(...decks); //  REQUIRED

      currentDecks = decks;
      renderAllDecks();
    })
    .catch(() => {
      showError("Can't fetch decks");
    })
    .finally(() => {
      handleRoute();
    });
});

// ----------------------
// Events
// ----------------------
if (newDeckBtn) {
  newDeckBtn.addEventListener("click", () => {
    window.location.hash = "#new-deck-view";
  });
}

window.addEventListener("hashchange", handleRoute);
window.addEventListener("load", handleRoute);
