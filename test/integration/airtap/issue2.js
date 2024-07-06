// Reduced from qunit:/test/integration/airtap.js
// Run original as:
// qunit$ npm install
// qunit$ npm run build
// qunit$ node bin/qunit.js test/integration/airtap.js

const cp = require('child_process');
const fs = require('fs');
const path = require('path');
const DIR = path.join(__dirname, '.');

// before
fs.existsSync(path.join(DIR, 'node_modules')) || cp.execSync('npm install --prefer-offline --no-audit --omit=dev --update-notifier=false', { cwd: DIR, encoding: 'utf8' });

// test 1 - always fails, but runs fine in a shell
try {
  const ret = cp.execSync('./node_modules/.bin/airtap --verbose passing-basic.js', {
    // cwd: DIR,
    // env: { PATH: process.env.PATH, HOME: process.env.HOME },
    encoding: 'utf8'
  });
  console.log(ret);
} catch (e) {
  console.error(e);
}

// test 2
try {
  const ret = cp.execSync('./node_modules/.bin/airtap passing-async.js', {
    // cwd: DIR,
    // env: { PATH: process.env.PATH, HOME: process.env.HOME },
    encoding: 'utf8'
  });
  console.log(ret);
} catch (e) {
  console.error(e);
}
