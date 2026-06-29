import { Config } from './config/game.config.js';
import { Engine } from './core/game.engine.js';
import { AI } from './ai/ai.js';

const app = {
    init: function () {
        this.engine = new Engine();
        this.ai = new AI(Config.P2, Config.P1, Config.Dificult.Medium);

        this.scores = { player: 0, machine: 0 };
        this.isProcessingMove = false;

        this.bindEvents();
        this.renderBoard();
        this.updateActiveCard();
    },

    bindEvents: function () {
        this.engine.onPlay = (i, j, piece) => {
            this.renderPiece(i, j, piece);
            this.updateActiveCard();
        };

        this.engine.onGameOver = (winner) => {
            setTimeout(() => {
                this.endGame(winner);
            }, 500);
        };

        const grid = document.getElementById('grid-visual');
        if (grid) {
             grid.addEventListener('click', (e) => {
                  const target = e.target.closest('[data-col]');
                  if (target && !this.engine._isGameOver && this.engine._currentPlayer === Config.P1 && !this.isProcessingMove) {
                      const col = parseInt(target.getAttribute('data-col'), 10);
                      this.handlePlayerMove(col);
                  }
             });
        }

        const restartBtns = document.querySelectorAll('button');
        restartBtns.forEach(btn => {
            if(btn.textContent.trim().toUpperCase().includes('RESET') || btn.textContent.trim().toUpperCase().includes('PLAY AGAIN') || btn.textContent.trim().toUpperCase().includes('RESTART')) {
                 btn.addEventListener('click', (e) => {
                      e.preventDefault();
                      this.reset();
                 });
            }
        });
    },

    updateActiveCard: function () {
        const turnText = document.getElementById('turn-text');
        const turnDot = document.getElementById('turn-dot');
        const cardPlayer = document.getElementById('card-player');
        const cardMachine = document.getElementById('card-machine');

        if (!turnText || !turnDot || !cardPlayer || !cardMachine) return;

        if (this.engine._currentPlayer === Config.P1) {
            cardPlayer.classList.add('border-error');
            cardMachine.classList.remove('border-secondary-fixed-dim');
            turnText.innerText = "YOUR TURN";
            turnDot.className = "w-3 h-3 rounded-full bg-error";
        } else {
            cardMachine.classList.add('border-secondary-fixed-dim');
            cardPlayer.classList.remove('border-error');
            turnText.innerText = "MACHINE THINKING";
            turnDot.className = "w-3 h-3 rounded-full bg-secondary-fixed-dim animate-pulse";
        }
    },

    endGame: function (winner) {
        const winnerModal = document.getElementById('winner-modal');
        const winnerTitle = document.getElementById('winner-title');
        const winnerIcon = document.getElementById('winner-icon');
        const scorePlayerEl = document.getElementById('score-player');
        const scoreMachineEl = document.getElementById('score-machine');

        if (!winnerModal) return;

        if (winner === Config.P1) {
            this.scores.player++;
            if (scorePlayerEl) scorePlayerEl.innerText = this.scores.player;
            winnerTitle.innerText = "YOU WIN!";
            winnerIcon.className = "material-symbols-outlined text-6xl text-secondary-container";
            winnerIcon.innerText = "emoji_events";
        } else if (winner === Config.P2) {
            this.scores.machine++;
            if (scoreMachineEl) scoreMachineEl.innerText = this.scores.machine;
            winnerTitle.innerText = "MACHINE WINS";
            winnerIcon.className = "material-symbols-outlined text-6xl text-error";
            winnerIcon.innerText = "smart_toy";
        } else {
            winnerTitle.innerText = "IT'S A DRAW!";
            winnerIcon.className = "material-symbols-outlined text-6xl text-on-surface-variant";
            winnerIcon.innerText = "balance";
        }

        winnerModal.classList.remove('opacity-0', 'pointer-events-none');
    },

    handlePlayerMove: async function (col) {
        this.isProcessingMove = true;
        await this.engine.play(0, col, this.ai);
        this.isProcessingMove = false;
    },

    reset: function () {
        this.engine.restart();
        this.renderBoard();
        this.updateActiveCard();
        const winnerModal = document.getElementById('winner-modal');
        if (winnerModal) {
            winnerModal.classList.add('opacity-0', 'pointer-events-none');
        }
    },

    renderBoard: function () {
        const grid = document.getElementById('grid-visual');
        if (!grid) return;

        grid.innerHTML = '';
        for (let i = 0; i < Config.ROWS; i++) {
            for (let j = 0; j < Config.COLS; j++) {
                const slot = document.createElement('div');
                slot.className = 'w-slot-size-mobile h-slot-size-mobile md:w-slot-size-desktop md:h-slot-size-desktop rounded-full bg-surface shadow-inner flex items-center justify-center cursor-pointer relative overflow-hidden';
                slot.setAttribute('data-col', j);
                slot.setAttribute('data-row', i);

                const inner = document.createElement('div');
                inner.id = `slot-${i}-${j}`;
                inner.className = 'w-[85%] h-[85%] rounded-full transition-all duration-300 transform scale-0';

                slot.appendChild(inner);
                grid.appendChild(slot);
            }
        }
    },

    renderPiece: function (i, j, piece) {
        const inner = document.getElementById(`slot-${i}-${j}`);
        if (inner) {
             if (piece === Config.P1) {
                  inner.classList.add('bg-error', 'shadow-md');
             } else if (piece === Config.P2) {
                  inner.classList.add('bg-secondary', 'shadow-md');
             }
             inner.classList.remove('scale-0');
             inner.classList.add('scale-100');
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    app.init();
});

// For inline onClick handlers from the HTML
window.resetGame = () => {
    app.reset();
};
