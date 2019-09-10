(function(win) {
    const words = Object.keys(dlSet).sort().sort((a, b) => {
        return b.length - a.length;
    });

    function isDoable(word, draw) {
        const d = draw.slice(0);

        for (let i = 0, len = word.length; i < len; i++) {
            const ind = d.indexOf(word.charAt(i));
            if (ind === -1) return false;
            delete d[ind];
        }

        return true;
    }

    function computeMaxAvail(words, draw, numWord = 3) {
        let maxWords = [];

        for (let i = 0, len = words.length; i < len; i++) {
            const word = words[i];
            if (isDoable(word, draw)) {
                maxWords.push(`${dlSet[word]} (${word.length})`);
                if (maxWords.length >= numWord) {
                    break;
                }
            }
        }

        return maxWords;
    }

    function drawLetter(type) {
        if (type === 'vowel' || type === 'consonant') {
            const freqs = dlSetFreq[type];
            const p = Math.random();
            for (let i = 0, len = freqs.length; i < len; i++) {
                if (p < freqs[i][1]) return freqs[i][0];
            }
        }
        return null;
    }

    function simulateDraw(length = 10) {
        let i = 0;
        const draw = [];
        while (i < length) {
            i++;
            const p = Math.random();
            if (p < dlSetFreq.vowFreq) draw.push(drawLetter('vowel'));
            else draw.push(drawLetter('consonant'));
        }

        return draw;
    }

    function simulateGame(length = 10) {
        const d = simulateDraw(10);

        return {
            draw: d,
            answer: computeMaxAvail(words, d)
        };
    }

    win.dlDraw = simulateDraw;
    win.dlLetter = drawLetter;
    win.dlMaxAvail = computeMaxAvail.bind(null, words);
})(window);
