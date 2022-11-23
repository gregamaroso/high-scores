#!/usr/bin/env node

const fs = require("fs");
const readline = require("readline");
const utils = require("./lib/utils");

// -------------------
// Collect arguments

var argv = require("yargs/yargs")(process.argv.slice(2)).options({
  n: {
    type: "number",
    default: 5,
    describe: "The number of results to display",
  },
  f: {
    type: "string",
    default: "data/input-short.data",
    describe: "Path to input file",
  },
}).argv;

// -------------------
// Validate arguments

const file: string = argv.f;
const numResults: number = argv.n;

if (fs.existsSync(file)) {
  utils.log(`Processing file ${file}`);
} else {
  utils.log(`File '${file}' doesn't exist`);

  process.exit(1);
}

// -------------------
// Run processor

let counter: number = 0;
let timing = { start: utils.now(), finish: 0 };

const scores = new Map<number, string>();
const skippedRecords = new Map<number, string>();

const readStream = fs.createReadStream(file);
let rl = readline.createInterface({ input: readStream });

rl.on("line", (line: string) => {
  const { score, record, status } = utils.processLineItem(line);

  if (status !== utils.recordStatus.Ok) {
    skippedRecords.set(score, record);

    return;
  }

  const numScores = [...scores].length;

  if (numScores < numResults) {
    scores.set(score, record);
  } else {
    const minScore = Math.min(...scores.keys());

    if (score > minScore) {
      scores.set(score, record).delete(minScore);
    }
  }

  counter++;
});

rl.on("close", () => {
  const pi = (i: string | number): number => parseInt(i as string);
  timing.finish = utils.now();

  const elapsed = (timing.finish - timing.start) / 1000;

  const allScores = Object.keys(Object.fromEntries(scores))
    .map((i) => pi(i))
    .sort((a: number, b: number) => (a > b ? -1 : a < b ? 1 : 0))
    .reduce((r, k) => {
      const sk = pi(k);
      r[sk] = JSON.parse(scores.get(sk));

      return r;
    }, {});

  utils.log(
    `Processed ${counter.toLocaleString(
      "en-US"
    )} entries in ${elapsed} seconds. ${skippedRecords.size} skipped entries.`
  );

  console.log(allScores);
});
