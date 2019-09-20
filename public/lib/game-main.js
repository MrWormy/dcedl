'use strict';

import DcGame from './dc-game.js';
import DlGame from './dl-game.js';

// Display logic
let currGame;

function clearGame() {
    if (currGame) {
        currGame.cancel();
        currGame = null;
    }
}

function hideContentButOne(type) {
    const contents = document.querySelectorAll('.container');
    Array.from(contents).forEach((content) => {
        if (content.id === type) {
            content.className = content.className.replace(/dsp-[^\s]*/, 'dsp-flx');
            history.pushState(null, type, `#${type}`);
        }
        else content.className = content.className.replace(/dsp-[^\s]*/, 'dsp-hdn');
    });
}

function displayChoice(e) {
    const type = e.target.value;
    clearGame();
    hideContentButOne(type);
}

Array.from(document.querySelectorAll('.btn-choice')).forEach((choiceEl) => {
    choiceEl.addEventListener('click', displayChoice, false);
});

// Games logic

// dc
const dcLaunch = document.getElementById('dc-launch');
const dcContent = document.getElementById('dc-content');
const dcTimer = document.getElementById('dc-timer');

function startDC() {
    clearGame();
    const dcGame = new DcGame(dcContent, dcTimer);
    currGame = dcGame;
    dcGame.start();
}

dcLaunch.addEventListener('click', startDC, false);

// dl
const dlLaunch = document.getElementById('dl-launch');
const dlVowel = document.getElementById('dl-vowel');
const dlConsonant = document.getElementById('dl-consonant');
const dlContent = document.getElementById('dl-content');
const dlTimer = document.getElementById('dl-timer');

function initDlGame() {
    clearGame();
    currGame = new DlGame(dlContent, dlTimer);
}

function drawLetter(type) {
    if (!currGame || !currGame.drawLetter) {
        initDlGame();
    }
    currGame.drawLetter(type);
}

function draw() {
    initDlGame();
    currGame.drawSet();
}

dlVowel.addEventListener('click', drawLetter.bind(null, 'vowel'), false);
dlConsonant.addEventListener('click', drawLetter.bind(null, 'consonant'), false);
dlLaunch.addEventListener('click', draw, false);
// location.hash.s + window.addEventListener('popstate', e => console.log(e, e.state));
