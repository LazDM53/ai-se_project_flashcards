import { decks, getDeckByID } from "./decks.js";
import { hexToString, removeColorClasses } from "./colorMap.js";
import { renderCarouselView } from "./carousel.js";

// DOM Elements
const galleryList = document.querySelector(".gallery__list");
const deckTemplate = document.getElementById("deck-template");
const gallerySection = document.querySelector(".gallery");
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
  linkEl.href = `#carousel/${deck.id}`;
  linkEl.setAttribute("aria-label", `Open deck: ${deck.name}`);

  return deckEl;
}

function renderAllDecks() {
  galleryList.innerHTML = "";
  currentDecks.forEach((deck) => {
    const deckEl = createDeckEl(deck);
    galleryList.prepend(deckEl);
  });
}

// ----------------------
// Show / Hide Sections
// ----------------------
function showDeckList() {
  gallerySection.style.display = "block";
  carouselSection.style.display = "none";
  notFoundSection.style.display = "none";
  aboutSection.style.display = "none";
}

function showAbout() {
  gallerySection.style.display = "none";
  carouselSection.style.display = "none";
  notFoundSection.style.display = "none";
  aboutSection.style.display = "block";
}

function showNotFound() {
  gallerySection.style.display = "none";
  carouselSection.style.display = "none";
  notFoundSection.style.display = "block";
  aboutSection.style.display = "none";
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
