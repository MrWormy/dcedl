import {generateTouchListener, generateClickListener} from './utils.js';

class Tile {
    constructor(tileWrapper) {
        this.wrapper = tileWrapper;
        this.tile = tileWrapper.querySelector('.tile');
        this.flipped = this.tile.classList.contains('tile-flipped');
        this.front = this.tile.querySelector('.tile-front');
        this.back = this.tile.querySelector('.tile-back');
        this.listeners = new Map();
    }

    flip() {
        this.flipped = true;
        this.tile.classList.add('tile-flipped');
    }

    unflip() {
        this.flipped = false;
        this.tile.classList.remove('tile-flipped');
    }

    setValue(value) {
        this.back.textContent = value;
        this.flip();
    }

    value() {
        return (this.flipped) ? this.back.textContent : '';
    }

    addEventListener(type, cb) {
        if (!this.listeners.has(type)) this.listeners.set(type, []);
        this.listeners.get(type).push(cb);
        this.wrapper.addEventListener(type, cb, false);
    }

    addTouchListener(cb) {
        this.addEventListener('touch', generateTouchListener(cb), false);
        this.addEventListener('click', generateClickListener(cb), false);
    }

    removeAllListeners() {
        for (let [type, cbs] of this.listeners) {
            cbs.forEach(cb => this.wrapper.removeEventListener(type, cb, false));
        }
        this.listeners.clear();
    }

    reset() {
        this.unflip();
        this.removeAllListeners();
    }
}

export default class DrawHandler {
    constructor(elem) {
        this.tiles = Array.from(elem.querySelectorAll('.tile-wrapper')).map(tile => new Tile(tile));
    }

    reset() {
        this.tiles.forEach(t => t.reset());
    }

    setValue(value, index) {
        this.tiles[index].setValue(value.toUpperCase());
    }

    attachTouchListener(cb) {
        this.tiles.forEach((tile, index) => {
            tile.addTouchListener(() => cb(index));
        });
    }

    getTile(index) {
        return this.tiles[index];
    }
}
