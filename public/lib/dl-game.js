import * as dl from './dl.js';
import {generateTile, generateDraw, generateAnswer, clean, generateTimer, greyOut, unGrey, removeElem} from './utils.js';

const PICKING = 1;
const STARTED = 2;
const ENDED = 3;

export default class {
    constructor(gameElem, timerElem, drawSize = 10, gameDelay = 30) {
        this.draw = [];
        this.drawSize = 10;
        this.gameState = PICKING;
        this.timerElem = timerElem;
        this.gameElem = gameElem;
        this.gameDelay = gameDelay * 1000;
        this.picked = new Map();
        this.solution = [];
        this.gameTimer = null;
        this.gameStart = () => {
            this.gameTimer = setTimeout(this.displaySolution.bind(this), this.gameDelay);
            this.updateSolution(dl.maxAvail(this.draw));
        }
    }

    get pickedSolution() {
        let pw = '';
        for(let i of this.picked.keys()){pw += this.draw[i]}
        return pw
    }

    initDrawPickedElem() {
        this.pickedElem = generateDraw('game-draw-dl');
        this.gameElem.appendChild(this.pickedElem);
    }

    cleanPicked() {
        removeElem(this.pickedElem);
        this.pickedElem = undefined;
    }

    displayPickedLetter(l, index, letterElem) {
        const lElem = generateTile(l, this.pickLetter.bind(this, index, letterElem));
        if (!this.pickedElem) {
            this.initDrawPickedElem();
        }
        this.pickedElem.appendChild(lElem);
        return lElem;
    }

    pickLetter(index, elem) {
        if (this.gameState === STARTED) {
            if (!this.picked.has(index)) {
                greyOut(elem);
                this.picked.set(index, this.displayPickedLetter(this.draw[index], index, elem));
            } else {
                removeElem(this.picked.get(index));
                this.picked.delete(index);
                unGrey(elem);
                if (this.picked.size === 0) this.cleanPicked();
            }
            // console.log('current word is : ', this.pickedSolution);
        }
    }

    displaySolution() {
        this.gameState = ENDED;
        this.gameElem.appendChild(generateAnswer(this.solution.join(', ')));
        console.log(this.pickedSolution, dl.isOkay(this.pickedSolution, this.draw));
    }

    updateSolution(sol) {
        this.solution = sol;
    }

    spawnTimer() {
        this.gameState = STARTED;
        this.remaining = this.draw.slice(0);
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
        this.removeTimer();
        clean(this.gameElem);
        this.draw = [];
        this.picked = new Map();
        this.gameState = PICKING;
    }

    initDrawElem() {
        this.drawElem = generateDraw('game-draw-dl');
        this.gameElem.appendChild(this.drawElem);
    }

    displayDrawLetter(l, index) {
        const lElem = generateTile(l, this.pickLetter.bind(this, index));
        if (!this.drawElem) {
            this.initDrawElem();
        }
        this.drawElem.appendChild(lElem);
    }

    drawLetter(type) {
        if (this.draw.length < this.drawSize) {
            const l = dl.drawLetter(type);
            this.displayDrawLetter(l, this.draw.push(l) - 1);
            if (this.draw.length === this.drawSize && this.gameState === PICKING) {
                this.spawnTimer();
            }
        }
    }

    drawSet() {
        if (this.gameState === PICKING) {
            this.draw = dl.simulateDraw(this.drawSize);
            clean(this.gameElem);
            this.draw.forEach((letter, index) => {
                this.displayDrawLetter(letter, index);
            });
            this.spawnTimer();
        }
    }
}
