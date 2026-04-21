const fs = require('fs');
const path = require('path');

const target = path.join(__dirname, 'app', '(dashboard)');

try {
    console.log(`Aggressively deleting ${target}...`);
    fs.rmSync(target, { recursive: true, force: true });
    console.log('SUCCESS!');
} catch (err) {
    console.error('FAILED TO DELETE VIA NODE:');
    console.error(err);
}
