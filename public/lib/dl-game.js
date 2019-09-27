import * as dl from './dl.js';
import DrawHandler from './tile-handler.js'
import {okay, clean, generateTimer} from './utils.js';

const PICKING = 1;
const STARTED = 2;
const ENDED = 3;

export default class {
    constructor(gameElem, timerElem, drawSize = 10, gameDelay = 30) {
        this.draw = [];
        this.picked = [];
        this.drawTiles = new DrawHandler(gameElem.firstElementChild);
        this.pickedTiles = new DrawHandler(gameElem.firstElementChild.nextElementSibling);
        this.drawSize = 10;
        this.gameState = PICKING;
        this.timerElem = timerElem;
        this.gameElem = gameElem;
        this.answerElem = this.gameElem.querySelector('.game-answer');
        this.gameDelay = gameDelay * 1000;
        this.solution = [];
        this.gameTimer = null;
        this.drawTiles.attachTouchListener(this.pick.bind(this));
        this.pickedTiles.attachTouchListener(this.unPick.bind(this));
        this.gameStart = () => {
            this.gameState = STARTED;
            this.gameTimer = setTimeout(this.displaySolution.bind(this), this.gameDelay);
            this.updateSolution(dl.maxAvail(this.draw));
        }
    }

    unPick(pickIndex) {
        if (this.gameState === STARTED && pickIndex < this.picked.length) {
            const tileIndex = this.picked[pickIndex];
            for (let i = pickIndex; i < this.picked.length - 1; i++) {
                this.picked[i] = this.picked[i + 1];
                this.pickedTiles.setValue(this.draw[this.picked[i]], i);
            }
            this.picked.pop();
            this.pickedTiles.remove(this.picked.length);
            this.drawTiles.unpick(tileIndex);
        }
    }

    pick(pickIndex) {
        if (this.gameState === STARTED) {
            const apI = this.picked.indexOf(pickIndex);
            if (apI === -1) {
                this.pickedTiles.setValue(this.draw[pickIndex], this.picked.push(pickIndex) - 1);
                this.drawTiles.pick(pickIndex);
            } else {
                this.unPick(apI);
            }
        }
    }

    get pickedSolution() {
        return this.picked.map((p) => this.draw[p]).join('');
    }

    displaySolution() {
        this.gameState = ENDED;
        if (this.pickedSolution.length > 0) {
            const answer = dl.isOkay(this.pickedSolution, this.draw);
            const isOkay = answer !== null;
            this.answerElem.appendChild(okay(isOkay ? answer : this.pickedSolution, isOkay));
        }
        this.answerElem.appendChild(document.createTextNode('▷ '));
        this.answerElem.appendChild(document.createTextNode(this.solution.join(', ')));
    }

    updateSolution(sol) {
        this.solution = sol;
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
        this.removeTimer();
        this.drawTiles.reset();
        this.pickedTiles.reset();
        clean(this.answerElem);
        this.draw = [];
        this.picked = [];
        this.gameState = PICKING;
    }

    displayDrawLetter(l, index) {
        this.drawTiles.setValue(l, index);
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
            this.draw.forEach((letter, index) => {
                this.displayDrawLetter(letter, index);
            });
            this.spawnTimer();
        }
    }
}
