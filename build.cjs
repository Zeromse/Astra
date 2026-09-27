const fs = require('node:fs');
const path = require('node:path');
const output = path.join(__dirname, 'dist');
fs.mkdirSync(output, { recursive: true });
for (const name of ['index.html', 'styles.css', 'app.js', 'diagrams.js']) fs.copyFileSync(path.join(__dirname, name), path.join(output, name));
fs.cpSync(path.join(__dirname, 'assets'), path.join(output, 'assets'), { recursive: true });
console.log('Built static site in celestial-atlas/dist');
