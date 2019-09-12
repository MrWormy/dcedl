function drawNumbers(length = 6, nums = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 25, 50, 75, 100]) {
    const draw = [];

    for (let i = 0, l = Math.min(nums.length, length); i < l; i++) {
        draw.push(nums.splice(Math.floor(Math.random() * nums.length), 1)[0]);
    }

    return draw;
}

function drawTarget(min = 101, max = 999) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function init(drawSize = 6, min = 101, max = 999, nums = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 25, 50, 75, 100]) {
    return {
        draw: drawNumbers(drawSize, nums),
        target: drawTarget(min, max)
    }
}

function solve(gameState, cb) {
    const w = new Worker('public/lib/dc-solver.js');
    w.onmessage = function(e) {
        cb(e.data);
    };
    w.postMessage(gameState);
}

export {
    init,
    solve
}
