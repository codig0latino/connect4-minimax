import { Config } from '../config/game.config.js';

const K_P1 = Config.P1;
const K_P2 = Config.P2;
const K_R = Config.ROWS;
const K_C = Config.COLS;
const K_DEP = Config.LTW;

export class Board {
    constructor(board) {
        this._board = board || new Uint8Array(K_R * K_C);
    }

    get(i, j) {
        return this._board[i * K_C + j];
    }

    set(i, j, val) {
        return this._board[i * K_C + j] = val;
    }

    equals(i, j, val) {
        return this._board[i * K_C + j] === val;
    }

    canThrow(i, j) {
        return this._board[i * K_C + j] === 0;
    }

    hasCollide(i, j) {
        const val = this.get(i, j);
        if (!val) return false;
        return this.isColliding(i, j, 1, 0, 1, val) ||   // vertical down
               this.isColliding(i, j, 0, 1, 1, val) ||   // horizontal right
               this.isColliding(i, j, 1, 1, 1, val) ||   // diagonal down-right
               this.isColliding(i, j, -1, 1, 1, val);   // diagonal up-right
    }

    isColliding(i, j, di, dj, dep, val) {
        if (this.outLimit(i, j)) return false;
        if (this.get(i, j) === val) {
            if (dep == K_DEP) return val;
            return this.isColliding(i + di, j + dj, di, dj, dep + 1, val);
        }
        return false;
    }

    // Connect 4 specific: finding the lowest available row in a column
    getRowAvailable(j) {
        let i = K_R - 1;
        while (i >= 0 && this.get(i, j) !== 0) i--;
        return i;
    }

    outLimit(i, j) {
        return i < 0 || j < 0 || i >= K_R || j >= K_C;
    }

    isGameOver() {
        let who;
        let isTie = 0;
        for (let i = 0; i < K_R; i++) {
            for (let j = 0; j < K_C; j++) {
                if (this.get(i, j)) isTie++;
                if ((who = this.hasCollide(i, j))) {
                    return who;
                }
            }
        }
        if (isTie == K_R * K_C) return -1;
        return false;
    }

    getWinningLine() {
        for (let i = 0; i < K_R; i++) {
            for (let j = 0; j < K_C; j++) {
                const val = this.get(i, j);
                if (!val) continue;

                // Check 4 directions: vertical down, horizontal right, diagonal down-right, diagonal up-right
                const directions = [
                    [1, 0],   // vertical down
                    [0, 1],   // horizontal right
                    [1, 1],   // diagonal down-right
                    [-1, 1]   // diagonal up-right
                ];

                for (const [di, dj] of directions) {
                    const line = [];
                    let r = i, c = j;
                    let match = true;
                    for (let step = 0; step < K_DEP; step++) {
                        if (this.outLimit(r, c) || this.get(r, c) !== val) {
                            match = false;
                            break;
                        }
                        line.push([r, c]);
                        r += di;
                        c += dj;
                    }
                    if (match) {
                        return { winner: val, line };
                    }
                }
            }
        }
        return null;
    }

    restart() {
        this._board = this._board.map(() => 0);
    }

    toString() {
        let out = "/*" + "-".repeat(K_C) + "Board status" + "-".repeat(K_C) + "*/\n";
        for (let i = 0; i < K_R; i++) {
            for (let j = 0; j < K_C; j++) {
                out += `[${this.get(i, j) || 0}]`;
            }
            out += "\n";
        }
        out += "/*" + "-".repeat(K_C) + "End of Board" + "-".repeat(K_C) + "*/\n"
        return out;
    }
}
