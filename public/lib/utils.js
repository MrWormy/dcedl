function handleClick(cb, elem, e) {
    if (e.button === 0) {
        e.preventDefault();
        cb(elem);
    }
}

function handleTouchend(cb, elem, e) {
    if (e.touches.length === 0 && e.changedTouches.length === 1) {
        const cr = e.target.getBoundingClientRect();
        const t = e.changedTouches[0];
        if (t.clientX >= cr.left && t.clientX <= cr.left + cr.width && t.clientY >= cr.top && t.clientY <= cr.top + cr.height) {
            e.preventDefault();
            cb(elem);
        }
    }
}

export function generateClickListener(cb) {
    return function (e) {
        if (e.button === 0) {
            e.preventDefault();
            cb();
        }
    }
}

export function generateTouchListener(cb) {
    return function(e) {
        if (e.touches.length === 0 && e.changedTouches.length === 1) {
            const cr = e.target.getBoundingClientRect();
            const t = e.changedTouches[0];
            if (t.clientX >= cr.left && t.clientX <= cr.left + cr.width && t.clientY >= cr.top && t.clientY <= cr.top + cr.height) {
                e.preventDefault();
                cb();
            }
        }
    }
}

export function detachTouchCb(elem, cb) {
    elem.removeEventListener('touchend', cb, false);
    elem.removeEventListener('mousedown', cb, false);
}

export function attachTouchCb(elem, cb) {
    elem.addEventListener('touchend', cb, false);
    elem.addEventListener('mousedown', cb, false);
}

export function generateTile(str, cb = null) {
    const value = String(str);
    const sp = document.createElement('span');
    const text = document.createTextNode(value.toUpperCase());

    sp.appendChild(text);
    if (typeof cb === 'function') {
        sp.addEventListener('touchend', handleTouchend.bind(null, cb, sp), false);
        sp.addEventListener('mousedown', handleClick.bind(null, cb, sp), false);
    }
    return sp;
}

export function generateDraw(className = null) {
    const draw = document.createElement('div');
    draw.className = `game-draw${className ? ` ${className}` : ''}`;

    return draw;
}

export function generateAnswer(str) {
    const d = document.createElement('div');
    d.className = 'game-answer';
    d.appendChild(document.createTextNode(str));

    return d;
}

export function generateTimer(parent) {
    const tt = document.createElement('div');
    const tr = document.createElement('div');
    const tb = document.createElement('div');
    const tl = document.createElement('div');

    tt.className = 'timer-elem timer-top';
    tr.className = 'timer-elem timer-right';
    tb.className = 'timer-elem timer-bottom';
    tl.className = 'timer-elem timer-left';

    parent.appendChild(tl);
    parent.appendChild(tb);
    parent.appendChild(tr);
    parent.appendChild(tt);
}

export function removeElem(elem) {
    if (elem.parentElement) elem.parentElement.removeChild(elem);
}

export function clean(element) {
    element.innerHTML = '';
    /*let child;
    while ((child = element.firstChild) !== null) {
        element.removeChild(child);
    }*/
}

export function addClass(elem, className) {
    elem.classList.add(className);
}

export function removeClass(elem, className) {
    elem.classList.remove(className);
}

export function greyOut(elem) {
    addClass(elem, 'grayed');
}

export function unGrey(elem) {
    removeClass(elem, 'grayed');
}
