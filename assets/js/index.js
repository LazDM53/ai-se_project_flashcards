import { renderDeckView } from "./deckView.js";
import { decks, getDeckByID } from "./decks.js";
import { hexToString, removeColorClasses } from "./colorMap.js";
import { renderCarouselView } from "./carousel.js";

// DOM Elements
const homeSection = document.querySelector(".gallery");
const homeGalleryList = homeSection.querySelector(".gallery__list");

const deckViewSection = document.querySelector("#deck-view");

const deckTemplate = document.getElementById("deck-template");
const carouselSection = document.querySelector(".carousel");
const notFoundSection = document.querySelector("#not-found");
const aboutSection = document.querySelector("#about");

let currentDecks = [...decks];

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

    currentDecks = currentDecks.filter((d) => d.id !== deck.id);
    renderAllDecks();

    if (window.location.hash === `#carousel/${deck.id}`) {
      window.location.hash = "#home";
    }
  });

  const linkEl = li.querySelector(".card__link");
  linkEl.href = `#deck/${deck.id}`;
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
function hideAllSections() {
  homeSection.style.display = "none";
  deckViewSection.style.display = "none";
  carouselSection.style.display = "none";
  notFoundSection.style.display = "none";
  aboutSection.style.display = "none";
}

function showDeckList() {
  hideAllSections();
  homeSection.style.display = "block";
}

function showDeckView() {
  hideAllSections();
  deckViewSection.style.display = "block";
}

function showAbout() {
  hideAllSections();
  aboutSection.style.display = "block";
}

function showNotFound() {
  hideAllSections();
  notFoundSection.style.display = "block";
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

  if (hash.startsWith("deck/")) {
    const [, deckId] = hash.split("/");
    const currentDeck = currentDecks.find((deck) => deck.id === deckId);

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
    const deckStillExists = currentDecks.some((deck) => deck.id === deckId);

    if (currentDeck && deckStillExists) {
      renderCarouselView(currentDeck);
    } else {
      showNotFound();
    }

    return;
  }

  showNotFound();
}

renderAllDecks();

window.addEventListener("hashchange", handleRoute);
window.addEventListener("load", handleRoute);
