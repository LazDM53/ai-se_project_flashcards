// Import decks and helpers
import { decks, getDeckByID } from "./decks.js"; // ✅ use 'decks' array
import { hexToString, removeColorClasses } from "./colors.js";
import { renderCarouselView } from "./carousel.js";

// DOM Elements
const deckList = document.querySelector(".decks__list");
const deckTemplate = document.getElementById("deck-template");
const decksSection = document.querySelector(".decks");
const carouselSection = document.querySelector(".carousel");
const notFoundSection = document.querySelector("#not-found");
const aboutSection = document.querySelector("#about");

// Get current decks
let currentDecks = decks; // ✅ directly use the exported array

// ----------------------
// Deck Rendering
// ----------------------
function createDeckEl(deck) {
  const deckEl = deckTemplate.content.cloneNode(true);
  const li = deckEl.querySelector(".deck");

  removeColorClasses(li);
  const colorName = hexToString(deck.color);
  li.classList.add(`deck_color_${colorName}`);

  li.querySelector(".deck__title").textContent = deck.name;
  li.querySelector(".deck__count").textContent = `${deck.cards.length} cards`;

  // Delete button
  const deleteBtn = li.querySelector(".deck__delete-btn");
  deleteBtn?.addEventListener("click", (e) => {
    e.stopPropagation();
    currentDecks = currentDecks.filter((d) => d.id !== deck.id);
    localStorage.setItem("flashcardDecks", JSON.stringify(currentDecks));
    li.remove();
  });

  // Link for carousel navigation
  const linkEl = li.querySelector(".deck__link");
  linkEl.href = `#carousel/${deck.id}`;
  linkEl.setAttribute("aria-label", `Open deck: ${deck.name}`);
  linkEl.addEventListener("click", (e) => {
    e.preventDefault();
    window.location.hash = `carousel/${deck.id}`;
  });

  return deckEl;
}

function renderDeckEl(deck) {
  const deckEl = createDeckEl(deck);
  deckList.prepend(deckEl);
}

// Render all decks
currentDecks.forEach(renderDeckEl);

// ----------------------
// Show / Hide Sections
// ----------------------
function showDeckList() {
  decksSection.style.display = "block";
  carouselSection.style.display = "none";
  notFoundSection.style.display = "none";
  aboutSection.style.display = "none";
}

function showAbout() {
  decksSection.style.display = "none";
  carouselSection.style.display = "none";
  notFoundSection.style.display = "none";
  aboutSection.style.display = "block";
}

function showNotFound() {
  decksSection.style.display = "none";
  carouselSection.style.display = "none";
  notFoundSection.style.display = "block";
  aboutSection.style.display = "none";
}

// ----------------------
// Router
// ----------------------
window.addEventListener("hashchange", handleRoute);
window.addEventListener("load", handleRoute);

function handleRoute() {
  const hash = window.location.hash.slice(1);

  // Home
  if (!hash || hash === "home") {
    showDeckList();
    return;
  }

  // About
  if (hash === "about") {
    showAbout();
    return;
  }

  // Carousel route: #carousel/deckId
  if (hash.startsWith("carousel/")) {
    const [, deckId] = hash.split("/");
    if (!deckId) {
      showNotFound();
      return;
    }

    const deck = getDeckByID(deckId);

    if (deck) {
      decksSection.style.display = "none";
      carouselSection.style.display = "block";
      notFoundSection.style.display = "none";
      aboutSection.style.display = "none";

      renderCarouselView(deck);
    } else {
      showNotFound();
    }
    return;
  }

  // 404 fallback
  showNotFound();
}
