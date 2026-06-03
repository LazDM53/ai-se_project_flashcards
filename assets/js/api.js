const baseUrl = "https://se-flashcards-api.en.tripleten-services.com/v1";

const headers = {
  "Content-Type": "application/json",
  Authorization: "019e8dc7-6d22-70d9-aa9a-e72d06dfabb5",
};

/**
 * Parses a fetch response and returns JSON data or rejects with an error status.
 *
 * @param {Response} res - The fetch response to process.
 * @returns {Promise<unknown>} Parsed JSON payload on success.
 */
function processResponse(res) {
  if (res.ok) {
    return res.json();
  }

  return Promise.reject(`Error: ${res.status}`);
}

/**
 * Fetches all available flashcard decks from the API.
 *
 * @returns {Promise<unknown>} A promise that resolves to the deck list.
 */
function getDecks() {
  return fetch(`${baseUrl}/decks`, { headers }).then(processResponse);
}

/**
 * Creates a new deck on the API.
 *
 * @param {Object} data - The deck data to send.
 * @returns {Promise<unknown>} A promise that resolves to the created deck.
 */
export function addDeck(data) {
  return fetch(`${baseUrl}/decks`, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  }).then(processResponse);
}

/**
 * Deletes a deck by its identifier.
 *
 * @param {string} deckId - The unique deck identifier.
 * @returns {Promise<unknown>} A promise that resolves when the deck is deleted.
 */
export function deleteDeck(deckId) {
  return fetch(`${baseUrl}/decks/${deckId}`, {
    method: "DELETE",
    headers,
  }).then(processResponse);
}

export { getDecks };
