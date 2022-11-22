import fs from 'fs';
import readline from 'readline';

function read() {
    let counter = 0;

    const readStream = fs.createReadStream('data/input-data.data');
    let rl = readline.createInterface({ input: readStream });

    rl.on('line', (line) => {
        // const b = line.split(':');
        counter++;
    });

    rl.on('close', () => {
        console.log(`something happened ${counter} times`);
    });
}

read();
