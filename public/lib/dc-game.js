import * as dc from './dc.js';
import {generateTile, generateDraw, generateAnswer} from './utils.js';

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
    }

    displaySolution() {
        this.gameElem.appendChild(generateAnswer(this.solution.solution));
    }

    updateSolution(sol) {
        this.solution = sol;
    }

    gameStart() {
        this.gameTimer = setTimeout(() => this.displaySolution(), this.gameDelay);
        dc.solve({draw: this.draw, target: this.target}, (solution) => this.updateSolution(solution));
    }

    spawnTimer() {
        this.timerElem.addEventListener('animationstart', e => this.gameStart(), {once: true});
        this.timerElem.className = 'timer';
    }

    start() {
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
        s.appendChild(generateTile(' '));
        s.appendChild(generateTile(this.target));

        this.gameElem.appendChild(d);
        this.gameElem.appendChild(s);

        // spawn timer and start the game
        this.spawnTimer();
    }
}
