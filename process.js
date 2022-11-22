import fs from 'fs';
import readline from 'readline';

import { processLineItem, status as statuses } from './utils/index.js';


// TODO
// install yargs
// pass the data file as an argument
// pass the top NN results as an argument
// use typescript
// use prettier for build


const file = 'data/short.data';
const numResults = 3;


let counter = 0;
const scores = new Map();
const skippedRecords = new Map();

const readStream = fs.createReadStream(file);
let rl = readline.createInterface({ input: readStream });

rl.on('line', (line) => {
    const { score, record, status } = processLineItem(line);

    if (status !== statuses.Ok) {
        skippedRecords.set(score, record);

        return;
    }

    const numScores = [...scores].length;

    if (numScores < numResults) {
        scores.set(score, record);
    } else {
        const minScore = Math.min(...scores);

        if (score > minScore) {
            scores.set(score, record).delete(minScore);
        }
    }

    counter++;
});

rl.on('close', () => {
    const allScores = Object.keys(Object.fromEntries(scores)).sort().reverse().reduce((r, k) => {
        const sk = parseInt(k);
        r[sk] = scores.get(sk);

        return r;
    }, {});

    console.log(`Processed ${counter} entries. ${skippedRecords.size} skipped entries.`);
});
