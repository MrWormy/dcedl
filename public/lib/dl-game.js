import * as dl from './dl.js';
import {generateTile, generateDraw, generateAnswer, clean, generateTimer} from './utils.js';

const PICKING = 1;
const STARTED = 2;

export default class {
    constructor(gameElem, timerElem, drawSize = 10, gameDelay = 30) {
        this.draw = [];
        this.drawSize = 10;
        this.gameState = PICKING;
        this.timerElem = timerElem;
        this.gameElem = gameElem;
        this.gameDelay = gameDelay * 1000;
        this.solution = [];
        this.gameTimer = null;
        this.gameStart = () => {
            this.gameTimer = setTimeout(this.displaySolution.bind(this), this.gameDelay);
            this.updateSolution(dl.maxAvail(this.draw));
        }
    }

    displaySolution() {
        this.gameElem.appendChild(generateAnswer(this.solution.join(', ')));
    }

    updateSolution(sol) {
        this.solution = sol;
    }

    spawnTimer() {
        this.gameState = STARTED;
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
        clean(this.gameElem);
        this.removeTimer();
        this.gameState = PICKING;
    }

    initDrawElem() {
        this.drawElem = generateDraw();
        this.gameElem.appendChild(this.drawElem);
    }

    displayDrawLetter(l) {
        const lElem = generateTile(l);
        if (!this.drawElem) {
            this.initDrawElem();
        }
        this.drawElem.appendChild(lElem);
    }

    drawLetter(type) {
        if (this.draw.length < this.drawSize) {
            const l = dl.drawLetter(type);
            this.draw.push(l);
            this.displayDrawLetter(l);
            if (this.draw.length === this.drawSize && this.gameState === PICKING) {
                this.spawnTimer();
            }
        }
    }

    drawSet() {
        if (this.gameState === PICKING) {
            this.draw = dl.simulateDraw(this.drawSize);
            clean(this.gameElem);
            this.draw.forEach((letter) => {
                this.displayDrawLetter(letter);
            });
            this.spawnTimer();
        }
    }
}
