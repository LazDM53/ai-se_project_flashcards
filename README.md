# Flashcard App

This is a simple and interactive Flashcard App built with the TripleTen curriculum. It helps students study and memorize information by organizing content into decks and cards, with a clean and responsive interface.

The app allows users to browse decks, open a specific deck, flip flashcards to reveal answers, and practice using a carousel interface.

I built this app to strengthen front-end development skills such as DOM manipulation, routing, and responsive design. It solves the problem of needing a lightweight, distraction-free study tool that runs directly in the browser without requiring installation.

---

## Features

- 📂 View multiple flashcard decks
- 📖 Open deck view to see all cards in a selected deck
- ➕ Add new cards within a deck
- ❌ Delete decks and cards with a confirmation modal
- 🔄 Flip cards to reveal answers
- ⬅️➡️ Navigate between cards using a carousel
- 🎯 Practice mode with carousel flashcards
- 🧭 Hash-based routing (no page reloads)
- 📱 Fully responsive design (mobile + desktop)
- 🎨 Dynamic color theming using a color map

---

## Technologies Used

- HTML5
- CSS3 (Flexbox, Grid, BEM methodology)
- JavaScript (ES6 modules)
- Git & GitHub for version control

---

🔧 Recent Updates
Added open deck view for browsing cards inside a deck
Implemented practice mode carousel with flip functionality
Built fully responsive layout (mobile + desktop)
Refactored carousel using CSS Grid
Fixed event duplication issues in carousel
Improved routing and navigation handling
Added mobile UI enhancements (floating buttons, footer behavior)
🆕 New Updates (API + Architecture Refactor)
Added new deck creation feature, allowing users to create flashcard decks dynamically through a form
Integrated a remote REST API, enabling full CRUD operations (create, read, delete decks)
Implemented error handling using modal dialogs, improving UX by displaying validation and API errors without breaking the UI
Replaced static/local data with server-synced deck storage
Added full JSDoc documentation across all major functions for improved readability and maintainability
⚠️ Error Handling

The application now includes a modal-based error system that displays user-friendly messages when:

Invalid JSON is submitted in the deck creation form
Deck validation fails (name, structure, or card format issues)
API requests fail (fetch, create, or delete operations)

This ensures the app remains stable and user-friendly even when errors occur.

🌐 API Integration

This project now communicates with a remote backend API to:

Fetch all flashcard decks
Add new decks to the database
Delete existing decks permanently

All changes are reflected in real time and persist across page reloads.

📖 JSDoc Documentation

All major functions in the codebase are fully documented using JSDoc, including:

Function descriptions
Parameter types
Return types

This improves maintainability, scalability, and readability of the project.

---

## Deployment

Check out the [live site](https://lazdm53.github.io/ai-se_project_flashcards/) on GitHub Pages.

---

## Future Improvements

- Add LocalStorage persistence for saving user data
- Improve animations and transitions
- Add editing functionality for decks and cards
- Enhance accessibility (keyboard navigation, ARIA improvements)

## Project Pitch Video

Check out [this video](https://drive.google.com/file/d/1ISSLlGk0pVZ2ERjRJgFu9OYobSE3fwI7/view?usp=drive_link), where I describe my
project and some challenges I faced while building it.
