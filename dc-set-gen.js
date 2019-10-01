const SET_SIZE = 6;
const NUM_ITEMS = 14;
const NUM_OF_EACH = [2,2,2,2,2,2,2,2,2,2,1,1,1,1];

const current = new Array(SET_SIZE);
let nbSets = 0;

const s = 0x0f;
const bs = Math.ceil(SET_SIZE / 2);

const items = [1,2,3,4,5,6,7,8,9,10,25,50,75,100];

function computeResults(set) {
    const results = new Set();

}

function validateSet(set) {
    const count = new Array(NUM_ITEMS).fill(0);
    set.forEach(i => count[i]++);
    return count.every((e, i) => {
        return e <= NUM_OF_EACH[i];
    });
}

function save(arr) {
    // reject set with more occurrences of an element than the rules tell
    if (validateSet(arr)) {
        nbSets++;
        const b = Buffer.alloc(bs);
        for (let i = 0; i < SET_SIZE; i += 2) {
            // less than (including) 16 items stored on 4 bits each
            let n = ((arr[i] & s) << 4) | ((arr[i + 1]) ? arr[i + 1] & s : 0);
            b.writeUInt8(n, i / 2);
        }
        computeResults(arr.map(i => items[i]));
    }
}

function loopAll(index, startingItem, maxIndex = SET_SIZE - 1, nbOfItems = NUM_ITEMS) {
    for (let i = startingItem; i < nbOfItems; i++) {
        current[index] = i;
        if (index === maxIndex) {
            save(current);
        } else {
            loopAll(index + 1, i, maxIndex, nbOfItems);
        }
    }
}

loopAll(0, 0);
