(function(win, document){
    // Display logic
    let gameTimer;
    let dcSol;
    let gameState;
    let gameContent;
    let timerElement;

    function clearGame() {
        let child;
        gameState = null;
        if (timerElement) {
            timerElement.className = '';
            timerElement = null;
        }
        if (gameTimer) {
            clearTimeout(gameTimer);
            gameTimer = null;
        }
        if (dcSol) {
            clearTimeout(dcSol);
            dcSol = null;
        }
        if (gameContent) {
            while ((child = gameContent.firstChild) !== null) {
                gameContent.removeChild(child);
            }
        }
    }

    function hideContentButOne(type) {
        const contents = document.querySelectorAll('.content');
        Array.from(contents).forEach((content) => {
            if (content.id === type) content.className = content.className.replace(/dsp-[^\s]*/, 'dsp-flx');
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
    function tileClick(e) {
        if (gameTimer) {
            e.target.style.backgroundColor = '#aaa';
        }
    }

    function generateTile(str) {
        const sp = document.createElement('span');
        const text = document.createTextNode(String(str).toUpperCase());

        sp.appendChild(text);
        sp.addEventListener('mousedown', tileClick, false);
        sp.addEventListener('touchdown', tileClick, false);
        return sp;
    }

    function generateDraw() {
        const draw = document.createElement('div');
        draw.className = 'game-draw';

        return draw;
    }

    function generateAnswer(str) {
        const d = document.createElement('div');
        d.className = 'game-answer';
        d.appendChild(document.createTextNode(str));

        return d;
    }

    /**
     <div class="horloge">
         <div class="static-back-horloge"></div>
         <div class="back-horloge"></div>
         <div class="front-horloge"></div>
     </div>
     */

    function spawnTimer(timerEl, timerStartCb = null) {
        if (timerEl) {
            timerElement = timerEl;
            if (timerStartCb) timerElement.addEventListener('animationstart', timerStartCb, {once: true});
            timerElement.className = 'timer';
        }
        /*const timer = document.createElement('div');
        const staticBack = document.createElement('div');
        const movingBack = document.createElement('div');
        const hidingFront = document.createElement('div');

        timer.className = 'horloge';
        staticBack.className = 'static-back-horloge';
        movingBack.className = 'back-horloge';
        hidingFront.className = 'front-horloge';

        if (timerStartCb) movingBack.addEventListener('animationstart', timerStartCb, {once: true});

        timer.appendChild(staticBack);
        timer.appendChild(movingBack);
        timer.appendChild(hidingFront);

        return timer;*/
    }

    // dc
    const dcLaunch = document.getElementById('dc-launch');
    const dcContent = document.getElementById('dc-content');
    const dcTimer = document.getElementById('dc-timer');

    function startDC() {
        let s;
        const g = win.dcInit();
        gameContent = dcContent;
        clearGame();
        const draw = generateDraw();
        for(const num of g.draw) {
            draw.appendChild(generateTile(num));
        }
        const draw2 = generateDraw();
        draw2.appendChild(generateTile('+'));
        draw2.appendChild(generateTile('−'));
        draw2.appendChild(generateTile('×'));
        draw2.appendChild(generateTile('÷'));
        draw2.appendChild(generateTile('')); //►
        draw2.appendChild(generateTile(g.target));
        spawnTimer(dcTimer, () => {
            gameTimer = setTimeout(() => {
                dcContent.appendChild(generateAnswer(`${s.solution}`));
            }, 30000);
            dcSol = setTimeout(() => {
                s = win.dcSolve(g);
            }, 5000)
        });
        dcContent.appendChild(draw);
        dcContent.appendChild(draw2);
    }

    dcLaunch.addEventListener('click', startDC, false);

    // dl
    const dlLaunch = document.getElementById('dl-launch');
    const dlVowel = document.getElementById('dl-vowel');
    const dlConsonant = document.getElementById('dl-consonant');
    const dlContent = document.getElementById('dl-content');
    const dlTimer = document.getElementById('dl-timer');

    function drawLetter(type) {
        gameContent = dlContent;
        if (Array.isArray(gameState)) {
            if(gameState.length < 10) {
                const l = win.dlLetter(type);
                gameState.push(l);
                dlContent.firstChild.appendChild(generateTile(l));
                if (gameState.length === 10 && !gameTimer) {
                    startDL();
                }
            }
        } else {
            const l = win.dlLetter(type);
            gameState = [l];
            const draw = generateDraw();
            draw.appendChild(generateTile(l));
            dlContent.appendChild(draw);
        }
    }

    function draw() {
        gameContent = dlContent;
        clearGame();
        gameState = win.dlDraw();
        const draw = generateDraw();
        for (const letter of gameState) {
            draw.appendChild(generateTile(letter));
        }
        dlContent.appendChild(draw);
        startDL();
    }

    function startDL() {
        clearTimeout(gameTimer);
        spawnTimer(dlTimer, () => {
            gameTimer = setTimeout(() => {
                if (Array.isArray(gameState)) {
                    const s = win.dlMaxAvail(gameState);
                    dlContent.appendChild(generateAnswer(`${s.join(', ')}`));
                    clearTimeout(gameTimer);
                    gameTimer = null;
                }
            }, 30000);
        });
    }

    dlVowel.addEventListener('click', drawLetter.bind(null, 'vowel'), false);
    dlConsonant.addEventListener('click', drawLetter.bind(null, 'consonant'), false);
    dlLaunch.addEventListener('click', draw, false);
})(window, document);
