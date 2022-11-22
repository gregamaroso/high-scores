import fs from 'fs';
import readline from 'readline';

import { processLineItem, status as statuses } from './utils/index.js';


// TODO
// install yargs
// pass the data file as an argument
// pass the top NN results as an argument

const file = 'data/short.data';
const numResults = 5;


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



    counter++;
});

rl.on('close', () => {
    console.log(`Processed ${counter} entries. ${skippedRecords.size} skipped entries.`);
});
