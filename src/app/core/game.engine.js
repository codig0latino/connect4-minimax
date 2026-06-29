import { Config } from '../config/game.config.js';
import { Board } from '../board/board.js';
import { AI } from '../ai/ai.js';

export class Engine {
    constructor() {
        this._isGameOver = false;
        this._currentPlayer = Config.P1;
        this._board = new Board();
        this.onPlay = () => {};
        this.onGameOver = () => {};
    }

    makePlay(i, j, player) {
        if(this._currentPlayer != player) {
            console.log("Is not your turn");
            return;
        }
        if (this._board.set(i, j, this._currentPlayer)) {
            const piece = this._currentPlayer;
            this._currentPlayer = this._currentPlayer == Config.P1 ? Config.P2 : Config.P1;
            console.info(this._board.toString());
            this.onPlay(i, j, piece);
        } else {
            console.info("Move not valid");
        }
    }

    async play(i, j, ai) {
        if (this._isGameOver) return;

        // Connect 4 enforces pieces falling to bottom, so we calculate i based on j
        const actualI = this._board.getRowAvailable(j);
        if(actualI === -1) {
             console.log("Column is full");
             return;
        }

        this.makePlay(actualI, j, this._currentPlayer);

        let over = this._board.isGameOver();
        if (over) {
            this._isGameOver = true;
            this.onGameOver(over);
            return;
        }

        // AI Turn
        if (ai) {
             // Let UI render user piece first
             await new Promise(res => setTimeout(res, 50));
             const move = ai.play(this._board);
             const aiActualI = this._board.getRowAvailable(move[1]);
             if (aiActualI !== -1) {
                  this.makePlay(aiActualI, move[1], ai.me);
                  over = this._board.isGameOver();
                  if (over) {
                      this._isGameOver = true;
                      this.onGameOver(over);
                  }
             }
        }
    }

    restart() {
        this._isGameOver = false;
        this._currentPlayer = Config.P1;
        this._board.restart();
    }

    getBoard() {
        return this._board;
    }
}
