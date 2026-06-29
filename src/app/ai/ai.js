import { Config } from '../config/game.config.js';

const K_MAX_POINT = 10000;
const K_MIN_POINT = -10000;
const K_WILD_P = 3;

export class AI {
    constructor(me, human, level) {
        this.me = me;
        this.human = human;
        this.level = level;
        this.humanMoves = null;
        this.meMoves = null;
    }

    playAsync(board) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(this.MiniMax(board));
            }, 0);
        });
    }

    play(board) {
        return this.MiniMax(board);
    }

    getId(i, j) {
        return i * Config.COLS + j;
    }

    // Adapt getGameNodes for Connect 4: only the top available slot in each column is valid
    // Ordered middle-out (3, 2, 4, 1, 5, 0, 6) to maximize alpha-beta pruning efficiency
    getGameNodes(board) {
        const nodes = [];
        const order = [3, 2, 4, 1, 5, 0, 6];
        for (const j of order) {
            const i = board.getRowAvailable(j);
            if (i !== -1) {
                nodes.push([i, j]);
            }
        }
        return nodes;
    }

    MiniMax(board) {
        this.humanMoves = new Array(Config.ROWS * Config.COLS).fill(0);
        this.meMoves = new Array(Config.ROWS * Config.COLS).fill(0);
        let bestMove = [-1, -1];
        let max = -Number.MAX_SAFE_INTEGER;

        const nodes = this.getGameNodes(board);
        if (nodes.length === 0) return [-1, -1];

        // default best move if all choices are equally bad
        bestMove = nodes[Math.floor(nodes.length / 2)] || nodes[0];

        for (let idx = 0; idx < nodes.length; idx++) {
            const [i, j] = nodes[idx];
            board.set(i, j, this.me);
            this.meMoves[this.getId(i, j)] = [i, j];

            const prediction = this.minValue(board, 0, -Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER);

            board.set(i, j, 0);
            this.meMoves[this.getId(i, j)] = 0;

            if (prediction > max) {
                max = prediction;
                bestMove = [i, j];
            }
        }
        return bestMove;
    }

    minValue(board, depth, alpha, beta) {
        const isGameOver = board.isGameOver();
        if (depth > this.level || isGameOver) return this.heuristic(board, isGameOver);

        const nodes = this.getGameNodes(board);
        for (let idx = 0; idx < nodes.length; idx++) {
            const [i, j] = nodes[idx];
            board.set(i, j, this.human);
            this.humanMoves[this.getId(i, j)] = [i, j];

            beta = Math.min(beta, this.maxValue(board, depth + 1, alpha, beta));

            board.set(i, j, 0);
            this.humanMoves[this.getId(i, j)] = 0;

            if (alpha >= beta) return alpha;
        }
        return beta;
    }

    maxValue(board, depth, alpha, beta) {
        const isGameOver = board.isGameOver();
        if (depth > this.level || isGameOver) return this.heuristic(board, isGameOver);

        const nodes = this.getGameNodes(board);
        for (let idx = 0; idx < nodes.length; idx++) {
            const [i, j] = nodes[idx];
            board.set(i, j, this.me);
            this.meMoves[this.getId(i, j)] = [i, j];

            alpha = Math.max(alpha, this.minValue(board, depth + 1, alpha, beta));

            board.set(i, j, 0);
            this.meMoves[this.getId(i, j)] = 0;

            if (alpha >= beta) return beta;
        }
        return alpha;
    }

    heuristic(board, gmovr) {
        let cost = 0;
        if (gmovr === this.me) return K_MAX_POINT;
        if (gmovr === this.human) return K_MIN_POINT;
        if (gmovr === Config.TIE) return 0;

        cost = this.unitCost(board, this.human, this.me);
        cost = this.unitCost(board, this.me, this.human) - cost;

        return cost;
    }

    canWin(i, j, di, dj, depth, board, vs) {
        if (board.outLimit(i, j)) return depth - 1;
        if (board.get(i, j) !== vs && board.get(i, j) !== K_WILD_P) {
            if (depth === Config.LTW) return true;
            return this.canWin(i + di, j + dj, di, dj, depth + 1, board, vs);
        }
        return depth - 1;
    }

    linesToWin(i, j, board, vs) {
        const START = 1;
        let k = 0;
        let tmp = 0;

        tmp = this.canWin(i, j, -1, -1, START, board, vs);
        (tmp === true) && (tmp = 1) && k++;
        (this.canWin(i, j, 1, 1, tmp, board, vs) === true) && k++;

        tmp = this.canWin(i, j, -1, 0, START, board, vs);
        (tmp === true) && (tmp = 1) && k++;
        (this.canWin(i, j, 1, 0, tmp, board, vs) === true) && k++;

        tmp = this.canWin(i, j, 0, -1, START, board, vs);
        (tmp === true) && (tmp = 1) && k++;
        (this.canWin(i, j, 0, 1, tmp, board, vs) === true) && k++;

        tmp = this.canWin(i, j, -1, 1, START, board, vs);
        (tmp === true) && (tmp = 1) && k++;
        (this.canWin(i, j, 1, -1, tmp, board, vs) === true) && k++;

        return k;
    }

    getNodes(plyr) {
        if (plyr === this.me) {
            return this.meMoves;
        } else {
            return this.humanMoves;
        }
    }

    unitCost(board, plyr, vs) {
        const nodes = this.getNodes(plyr);
        let k = 0;
        for (let idx = 0; idx < nodes.length; idx++) {
            if (nodes[idx] !== 0) {
                const node = nodes[idx];
                const i = node[0];
                const j = node[1];
                const winPosible = this.linesToWin(i, j, board, vs);
                k += winPosible;
                if(winPosible > 0) board.set(i, j, K_WILD_P);
            }
        }
        for (let i = 0; i < nodes.length; i++) {
            if (nodes[i] !== 0) {
                const node = nodes[i];
                board.set(node[0], node[1], plyr);
            }
        }
        return k;
    }
}
