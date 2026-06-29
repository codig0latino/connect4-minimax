# Project Rules: Connect 4 Minimax

When working on this project, adhere to the following rules:

1. **Theme and Styling**:
   - We use the **"Cheerful Connection"** UI theme.
   - Core colors include `primary` (blue), `secondary` (yellow), `tertiary` (red), `surface` (light blue), and difficulty-specific colors (`difficulty-easy`, `difficulty-medium`, `difficulty-hard`).
   - All styling must be done using Tailwind CSS (`tailwind.config.cjs`). Avoid inline styles.
   - Use Google Fonts: "Plus Jakarta Sans" and Material Symbols Outlined for icons.

2. **Architecture**:
   - The game logic is decoupled from the UI.
   - `src/app/main.js`: Handles DOM manipulation, event listeners, and game state initialization.
   - `src/app/core/game.engine.js`: Manages the board state, piece placement, and win/draw validation.
   - `src/app/core/ai.js`: Contains the Minimax algorithm with alpha-beta pruning for the machine opponent.

3. **Vanilla JS Only**:
   - Do NOT introduce frameworks like React, Vue, or Angular.
   - The UI updates are handled through standard DOM APIs (`document.getElementById`, `classList.add`, etc.).

4. **Responsive Design**:
   - The board and modals must be fully responsive using Tailwind breakpoints (`md:`).
   - Test interactions on both mobile and desktop views.
