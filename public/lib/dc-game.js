import * as dc from './dc.js';
import {generateTile, generateDraw, generateAnswer, clean, generateTimer} from './utils.js';

const symbols = ['+', '−', '×', '÷'];

export default class {
    constructor(gameElem, timerElem, gameDelay = 30) {
        const {draw, target} = dc.init();
        this.draw = draw;
        this.target = target;
        this.timerElem = timerElem;
        this.gameElem = gameElem;
        this.gameDelay = gameDelay * 1000;
        this.solution = {};
        this.gameTimer = null;
        this.gameStart = () => {
            this.gameTimer = setTimeout(this.displaySolution.bind(this), this.gameDelay);
            this.updateSolver(dc.solve({draw: this.draw, target: this.target}));
        }
    }

    displaySolution() {
        this.gameElem.appendChild(generateAnswer(this.solution.solution));
    }

    updateSolution(sol) {
        this.solution = sol;
    }

    updateSolver(solverObj) {
        this.solveCancel = solverObj.cancel;
        solverObj.solver.then((solution) => {
            this.solveCancel = null;
            this.updateSolution(solution);
        });
    }

    spawnTimer() {
        this.timerElem.addEventListener('animationstart', this.gameStart, {once: true});
        generateTimer(this.timerElem);
        this.timerElem.className = 'timer';
    }

    removeTimer() {
        clearTimeout(this.gameTimer);
        this.timerElem.removeEventListener('animationstart', this.gameStart);
        this.timerElem.className = 'timer-hdn';
        clean(this.timerElem);
    }

    cancel() {
        if (typeof this.solveCancel === 'function') this.solveCancel();
        clean(this.gameElem);
        this.removeTimer();
    }

    spawnDraw() {
        // numbers draw
        const d = generateDraw();
        this.draw.forEach((tile) => {
            d.appendChild(generateTile(tile, () => {
                console.log(this.target);
            }));
        });

        // symbols
        const s = generateDraw();
        symbols.forEach((symb) => {
            s.appendChild(generateTile(symb));
        });

        // expected result
        s.appendChild(generateTile('#'));
        s.appendChild(generateTile(this.target));

        this.gameElem.appendChild(d);
        this.gameElem.appendChild(s);
    }

    start() {
        // spawn draw
        this.spawnDraw();

        // spawn timer and start the game
        this.spawnTimer();
    }
}
