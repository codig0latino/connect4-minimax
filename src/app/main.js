import { Config } from './config/game.config.js';
import { Engine } from './core/game.engine.js';
import { AI } from './ai/ai.js';

const DIFFICULTY_MAP = {
    'fácil': Config.Dificult.Easy,
    'medio': Config.Dificult.Medium,
    'difícil': Config.Dificult.Hard
};

const app = {
    init: function () {
        this.engine = new Engine();
        this.ai = null;
        this.isGameStarted = false;

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

        const boardContainer = document.getElementById('board-container');
        if (boardContainer) {
             boardContainer.addEventListener('click', (e) => {
                  const target = e.target.closest('[data-col]');
                  if (target && this.isGameStarted && !this.engine._isGameOver && this.engine._currentPlayer === Config.P1 && !this.isProcessingMove) {
                      const col = parseInt(target.getAttribute('data-col'), 10);
                      this.handlePlayerMove(col);
                  }
             });
        }

        // Difficulty selection buttons
        document.querySelectorAll('[data-difficulty]').forEach(btn => {
            btn.addEventListener('click', () => {
                const difficulty = btn.getAttribute('data-difficulty');
                this.startGame(difficulty);
            });
        });

        // Show difficulty selector buttons
        const btnShowDifficulty = document.getElementById('btn-show-difficulty');
        if (btnShowDifficulty) {
            btnShowDifficulty.addEventListener('click', () => this.showDifficultySelector());
        }
        const btnShowDifficultyMobile = document.getElementById('btn-show-difficulty-mobile');
        if (btnShowDifficultyMobile) {
            btnShowDifficultyMobile.addEventListener('click', () => this.showDifficultySelector());
        }

        // Restart / Play Again buttons
        const restartBtns = document.querySelectorAll('button');
        restartBtns.forEach(btn => {
            const text = btn.textContent.trim().toUpperCase();
            if (text.includes('REINICIAR') || text.includes('JUGAR DE NUEVO')) {
                 btn.addEventListener('click', (e) => {
                      e.preventDefault();
                      this.reset();
                 });
            }
        });
    },

    startGame: function (difficulty) {
        const depth = DIFFICULTY_MAP[difficulty] || Config.Dificult.Medium;
        this.ai = new AI(Config.P2, Config.P1, depth);
        this.isGameStarted = true;

        // Update UI labels and colors
        const difficultyBadge = document.getElementById('difficulty-badge');
        if (difficultyBadge) difficultyBadge.innerText = difficulty.toUpperCase();
        
        const btnShowDifficulty = document.getElementById('btn-show-difficulty');
        if (btnShowDifficulty) {
            btnShowDifficulty.className = 'flex items-center gap-2 py-2 px-6 rounded-full font-bold transition-all shadow-md text-white hover:opacity-90 active:scale-95';
            if (difficulty === 'fácil') btnShowDifficulty.classList.add('bg-difficulty-easy');
            else if (difficulty === 'medio') btnShowDifficulty.classList.add('bg-difficulty-medium');
            else if (difficulty === 'difícil') btnShowDifficulty.classList.add('bg-difficulty-hard');
        }

        // Hide difficulty modal
        const difficultyModal = document.getElementById('difficulty-modal');
        if (difficultyModal) {
            difficultyModal.classList.add('opacity-0', 'pointer-events-none');
        }

        this.reset();
    },

    showDifficultySelector: function () {
        const difficultyModal = document.getElementById('difficulty-modal');
        if (difficultyModal) {
            difficultyModal.classList.remove('opacity-0', 'pointer-events-none');
        }
    },

    updateActiveCard: function () {
        const turnText = document.getElementById('turn-text');
        const turnDot = document.getElementById('turn-dot');
        const cardPlayer = document.getElementById('card-player');
        const cardMachine = document.getElementById('card-machine');

        if (!turnText || !turnDot || !cardPlayer || !cardMachine) return;

        if (this.engine._currentPlayer === Config.P1) {
            cardPlayer.classList.add('scale-110');
            cardMachine.classList.remove('scale-110');
            turnText.innerText = "TU TURNO";
            turnDot.className = "w-3 h-3 rounded-full bg-tertiary";
        } else {
            cardMachine.classList.add('scale-110');
            cardPlayer.classList.remove('scale-110');
            turnText.innerText = "MÁQUINA PENSANDO";
            turnDot.className = "w-3 h-3 rounded-full bg-secondary";
        }
    },

    endGame: function (winner) {
        const winnerModal = document.getElementById('winner-modal');
        const winnerTitle = document.getElementById('winner-title');
        const winnerIcon = document.getElementById('winner-icon');
        const winnerSubtitle = document.getElementById('winner-subtitle');
        const scorePlayerEl = document.getElementById('score-player');
        const scoreMachineEl = document.getElementById('score-machine');

        if (!winnerModal) return;

        if (winner === Config.P1) {
            this.scores.player++;
            if (scorePlayerEl) scorePlayerEl.innerText = this.scores.player;
            winnerTitle.innerText = "¡HAS GANADO!";
            if (winnerSubtitle) winnerSubtitle.innerText = "¡Eres un genio de la estrategia!";
            winnerIcon.className = "material-symbols-outlined text-8xl text-secondary";
            winnerIcon.innerText = "stars";
        } else if (winner === Config.P2) {
            this.scores.machine++;
            if (scoreMachineEl) scoreMachineEl.innerText = this.scores.machine;
            winnerTitle.innerText = "GANÓ LA MÁQUINA";
            if (winnerSubtitle) winnerSubtitle.innerText = "¡Casi lo logras! ¡Inténtalo de nuevo!";
            winnerIcon.className = "material-symbols-outlined text-8xl text-primary";
            winnerIcon.innerText = "smart_toy";
        } else {
            winnerTitle.innerText = "¡EMPATE!";
            if (winnerSubtitle) winnerSubtitle.innerText = "¡Ha sido una partida increíble!";
            winnerIcon.className = "material-symbols-outlined text-8xl text-on-surface-variant";
            winnerIcon.innerText = "handshake";
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
                slot.className = 'slot w-[44px] h-[44px] md:w-[80px] md:h-[80px] rounded-full bg-white';
                slot.setAttribute('data-col', j);
                slot.setAttribute('data-row', i);
                grid.appendChild(slot);
            }
        }
    },

    renderPiece: function (i, j, piece) {
        const slot = document.querySelector(`[data-row="${i}"][data-col="${j}"]`);
        if (slot) {
            const pieceEl = document.createElement('div');
            pieceEl.className = `piece w-full h-full rounded-full ${piece === Config.P1 ? 'piece-red' : 'piece-yellow'}`;
            slot.appendChild(pieceEl);
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
