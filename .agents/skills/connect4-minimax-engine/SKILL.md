---
name: connect4-minimax-engine
description: Understand and modify the core Minimax AI engine and board logic for the Connect 4 project.
---

# Connect 4 Minimax Engine Skill

This skill provides context for the AI engine driving the Connect 4 machine opponent.

## Core Concepts

1. **Board Representation**:
   - The board is a 6 (ROWS) x 7 (COLS) matrix.
   - 0 = Empty, 1 = Player (Red), 2 = Machine (Yellow).

2. **Minimax with Alpha-Beta Pruning**:
   - Located in `src/app/core/ai.js`.
   - The algorithm searches ahead a configurable `depth` of moves (Fácil=random/1, Medio=3, Difícil=5+).
   - Alpha-Beta pruning cuts down the search space for efficiency.
   
3. **Heuristics Evaluation**:
   - Instead of searching to the end of the game (which is computationally impossible for Connect 4 in a browser in real-time), the engine uses a heuristic evaluation function for non-terminal states.
   - It evaluates horizontal, vertical, and diagonal "windows" of 4 slots.
   - Points are awarded for having 2 or 3 pieces in a row with empty slots, heavily penalizing the opponent doing the same.

## Best Practices

- When modifying the heuristic weights, always test across all difficulty levels to ensure "Medio" doesn't become too hard or "Difícil" too slow.
- Do not increase the maximum search depth beyond 7 in the browser without implementing Web Workers, as it will block the main thread and freeze the UI.
- All engine modifications must be purely functional; do not inject DOM dependencies into `ai.js` or `game.engine.js`.
