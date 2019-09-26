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

    pick() {
        this.back.classList.add('grayed');
    }

    unpick() {
        this.back.classList.remove('grayed');
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
        this.unpick();
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

    pick(index) {
        this.tiles[index].pick();
    }

    unpick(index) {
        this.tiles[index].unpick();
    }

    setValue(value, index) {
        this.tiles[index].setValue(value.toUpperCase());
    }

    remove(index) {
        this.tiles[index].unflip();
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
