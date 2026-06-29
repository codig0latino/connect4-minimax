# Connect 4 Minimax

A beautiful, responsive Connect 4 game built with Vanilla JavaScript, HTML, and Tailwind CSS. The game features an intelligent AI opponent powered by the Minimax algorithm with alpha-beta pruning.

## Features

- **Responsive Design**: Playable on both desktop and mobile devices.
- **"Cheerful Connection" UI**: A vibrant, toy-like UI theme with CSS animations for piece dropping and 3D-styled buttons and board.
- **Intelligent AI**: Uses the Minimax algorithm.
- **Difficulty Levels**:
  - **Fácil**: The AI plays mostly random moves. Good for beginners.
  - **Medio**: The AI blocks your wins and looks for immediate opportunities.
  - **Difícil**: The AI searches several moves ahead to set up traps and force wins.

## Development

This project uses Vite for local development and Tailwind CSS for styling.

### Running Locally

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser to the local URL provided by Vite (usually `http://localhost:5173/`).

## Architecture

- **`src/index.html`**: The main entry point and UI structure.
- **`src/app/main.js`**: Handles DOM interactions and game state initialization.
- **`src/app/core/game.engine.js`**: Manages the Connect 4 board rules, piece placement, and win detection.
- **`src/app/core/ai.js`**: The Minimax algorithm implementation for the machine opponent.

## Agent Guidelines

If you are an AI agent working on this project, please refer to the rules in `.agents/AGENTS.md`, read the skill in `.agents/skills/connect4-minimax-engine/SKILL.md`, and review `design.md` before making architectural or styling changes.
