import { hexToString, removeColorClasses } from "./colorMap.js";

const deckViewSection = document.querySelector("#deck-view");
const deckViewTitle = deckViewSection.querySelector(".gallery__title");
const deckViewList = deckViewSection.querySelector(".gallery__list");
const practiceBtn = deckViewSection.querySelector(".gallery__practice-btn");
const cardTemplate = document.getElementById("card-template");

function createCardEl(card, deck) {
  const cardEl = cardTemplate.content.cloneNode(true);
  const li = cardEl.querySelector(".card");
  const titleEl = cardEl.querySelector(".card__title");
  const flipBtn = cardEl.querySelector(".card__flip-btn");
  const deleteBtn = cardEl.querySelector(".card__delete-btn");

  const deckColor = hexToString(deck.color) || "green";
  let showingQuestion = true;

  li.classList.add(`card_color_${deckColor}`);
  titleEl.textContent = card.question;

  flipBtn.addEventListener("click", () => {
    showingQuestion = !showingQuestion;

    removeColorClasses(li);

    if (showingQuestion) {
      titleEl.textContent = card.question;
      li.classList.add(`card_color_${deckColor}`);
    } else {
      titleEl.textContent = card.answer;
      li.classList.add("card_color_white");
    }
  });

  deleteBtn.addEventListener("click", () => {
    li.remove();
  });

  return cardEl;
}

function renderDeckView(deck, showDeckView) {
  const page = document.querySelector(".page");

  page.classList.remove("page_no-mobile-bar");
  page.classList.remove("page_location_carousel");

  deckViewTitle.textContent = deck.name;
  deckViewList.innerHTML = "";

  practiceBtn.onclick = () => {
    window.location.hash = `#carousel/${deck.id}`;
  };

  deck.cards.forEach((card) => {
    deckViewList.append(createCardEl(card, deck));
  });

  showDeckView();
}

export { renderDeckView };
