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

    const deckIndex = currentDecks.findIndex((d) => d._id === deck._id);

    if (deckIndex !== -1) {
      currentDecks.splice(deckIndex, 1);
    }

    renderAllDecks();

    if (window.location.hash === `#carousel/${deck._id}`) {
      window.location.hash = "#home";
    }
  });

  const linkEl = li.querySelector(".card__link");
  linkEl.href = `#deck/${deck._id}`;
  linkEl.setAttribute("aria-label", `Open deck: ${deck.name}`);

  return deckEl;
}

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

function showDeckList() {
  page.classList.remove("page_no-mobile-bar");
  page.classList.remove("page_location_carousel");
  showView(homeSection, "block");
}

function showDeckView() {
  page.classList.remove("page_no-mobile-bar");
  page.classList.remove("page_location_carousel");
  showView(deckViewSection, "block");
}

function showAbout() {
  page.classList.remove("page_no-mobile-bar");
  page.classList.remove("page_location_carousel");
  showView(aboutSection, "block");
}

function showNewDeckView() {
  page.classList.remove("page_no-mobile-bar");
  page.classList.remove("page_location_carousel");
  showView(newDeckSection, "block");
}

function showNotFound() {
  page.classList.add("page_no-mobile-bar");
  page.classList.remove("page_location_carousel");
  showView(notFoundSection, "block");
}

// ----------------------
// Router
// ----------------------
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
