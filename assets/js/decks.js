export const fetchedDecks = [];

function getDeckByID(id) {
  return fetchedDecks.find((deck) => deck._id === id);
}

function removeDeckByID(deckId) {
  const index = fetchedDecks.findIndex((deck) => deck._id === deckId);

  if (index !== -1) {
    fetchedDecks.splice(index, 1);
  }
}

export { getDeckByID, removeDeckByID };
