function handleClick(cb, e) {
    e.preventDefault();
    cb();
}

function handleTouchend(cb, e) {
    e.preventDefault();
    if (e.touches.length === 0 && e.changedTouches.length === 1) {
        const cr = e.target.getBoundingClientRect();
        const t = e.changedTouches[0];
        if (t.clientX >= cr.left && t.clientX <= cr.left + cr.width && t.clientY >= cr.top && t.clientY <= cr.top + cr.height) {
            cb();
        }
    }
}

export function generateTile(str, cb = null) {
    const sp = document.createElement('span');
    const text = document.createTextNode(String(str).toUpperCase());

    sp.appendChild(text);
    if (typeof cb === 'function') {
        sp.addEventListener('touchend', handleTouchend.bind(null, cb), false);
        sp.addEventListener('mousedown', handleClick.bind(null, cb), false);
    }
    return sp;
}

export function generateDraw() {
    const draw = document.createElement('div');
    draw.className = 'game-draw';

    return draw;
}

export function generateAnswer(str) {
    const d = document.createElement('div');
    d.className = 'game-answer';
    d.appendChild(document.createTextNode(str));

    return d;
}
