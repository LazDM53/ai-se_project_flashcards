// carousel.js

let handleKeydown; // store the keydown listener reference globally

function renderCarouselView(deck) {
  // ----------------------
  // Show carousel, hide others
  // ----------------------
  const decksSection = document.querySelector(".decks");
  const carouselSection = document.querySelector(".carousel");
  const notFoundSection = document.querySelector("#not-found");

  decksSection.style.display = "none";
  carouselSection.style.display = "flex";
  notFoundSection.style.display = "none";

  // ----------------------
  // State
  // ----------------------
  let currentIndex = 0;
  let showingQuestion = true;

  // ----------------------
  // DOM elements
  // ----------------------
  const titleEl = carouselSection.querySelector(".carousel__title");
  const cardTextEl = carouselSection.querySelector(".carousel__card-text");
  const cardEl = carouselSection.querySelector(".carousel__card");
  const prevBtn = carouselSection.querySelector(".carousel__btn_type_left");
  const nextBtn = carouselSection.querySelector(".carousel__btn_type_right");
  const flipBtn = carouselSection.querySelector(".carousel__btn_type_flip");

  // Set title
  titleEl.textContent = deck.name;

  // Add card counter
  const existingCounter = carouselSection.querySelector(".carousel__counter");
  if (existingCounter) existingCounter.remove();
  const counterEl = document.createElement("p");
  counterEl.className = "carousel__counter";
  titleEl.after(counterEl);

  // Set initial card color
  cardEl.style.backgroundColor = deck.color;

  // ----------------------
  // Update display
  // ----------------------
  function updateDisplay() {
    const currentCard = deck.cards[currentIndex];

    if (showingQuestion) {
      cardTextEl.textContent = currentCard.question;
      cardEl.style.backgroundColor = deck.color;
    } else {
      cardTextEl.textContent = currentCard.answer;
      cardEl.style.backgroundColor = "#ffffff";
    }

    counterEl.textContent = `Card ${currentIndex + 1} of ${deck.cards.length}`;

    prevBtn.disabled = currentIndex === 0;
    prevBtn.classList.toggle("carousel__btn_disabled", currentIndex === 0);
    nextBtn.disabled = currentIndex === deck.cards.length - 1;
    nextBtn.classList.toggle(
      "carousel__btn_disabled",
      currentIndex === deck.cards.length - 1,
    );
  }

  // ----------------------
  // Navigation helpers
  // ----------------------
  function goToCard(index) {
    currentIndex = index;
    showingQuestion = true;
    updateDisplay();
  }

  prevBtn.onclick = () => currentIndex > 0 && goToCard(currentIndex - 1);
  nextBtn.onclick = () =>
    currentIndex < deck.cards.length - 1 && goToCard(currentIndex + 1);
  flipBtn.onclick = () => {
    showingQuestion = !showingQuestion;
    updateDisplay();
  };

  // ----------------------
  // Keyboard navigation
  // ----------------------
  // Remove previous listener if exists
  if (handleKeydown) {
    carouselSection.removeEventListener("keydown", handleKeydown);
  }

  // Define listener
  handleKeydown = (e) => {
    if (e.key === "ArrowLeft" && currentIndex > 0) {
      goToCard(currentIndex - 1);
    } else if (e.key === "ArrowRight" && currentIndex < deck.cards.length - 1) {
      goToCard(currentIndex + 1);
    } else if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      showingQuestion = !showingQuestion;
      updateDisplay();
    }
  };

  // Attach listener
  carouselSection.addEventListener("keydown", handleKeydown);

  // Make carousel focusable and focus
  carouselSection.tabIndex = 0;
  carouselSection.focus();

  // Initial display
  updateDisplay();
}

export { renderCarouselView };
