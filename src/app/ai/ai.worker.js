import { AI } from './ai.js';
import { Board } from '../board/board.js';

self.onmessage = function (e) {
    const { boardState, me, human, level } = e.data;
    
    // Reconstruct the board state from the Uint8Array
    const board = new Board(boardState);
    const ai = new AI(me, human, level);
    
    // Compute the best move
    const move = ai.play(board);
    
    // Send the move back to the main thread
    self.postMessage({ move });
};
