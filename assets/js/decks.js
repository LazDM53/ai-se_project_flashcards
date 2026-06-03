export const fetchedDecks = [];

/**
 * Finds a deck in the local fetched deck cache by its identifier.
 *
 * @param {string} id - The deck identifier to look up.
 * @returns {Object|undefined} The matching deck, if one exists.
 */
function getDeckByID(id) {
  return fetchedDecks.find((deck) => deck._id === id);
}

/**
 * Removes a deck from the local fetched deck cache.
 *
 * @param {string} deckId - The deck identifier to remove.
 */
function removeDeckByID(deckId) {
  const index = fetchedDecks.findIndex((deck) => deck._id === deckId);

  if (index !== -1) {
    fetchedDecks.splice(index, 1);
  }
}

export { getDeckByID, removeDeckByID };
