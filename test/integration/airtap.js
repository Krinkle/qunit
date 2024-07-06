const cp = require('child_process');
const fs = require('fs');
const path = require('path');
const DIR = path.join(__dirname, 'airtap');

function normalize (str) {
  return str
    .trim()
    .replace(/@http:\/\/.*$/gm, '@http://localhost/___')
    .replace(/^(\s+).*(fail-assert\.js).*(@)/gm, '$1___/$2$3');
}

QUnit.module('airtap', function (hooks) {
  hooks.before(function () {
    fs.existsSync(path.join(DIR, 'node_modules')) || cp.execSync('npm install --prefer-offline --no-audit --omit=dev --update-notifier=false', { cwd: DIR, encoding: 'utf8' });
  });

  QUnit.test.each('passing', {
    basic: ['passing-basic.js', `
TAP version 13
ok 1 exampleFoo
ok 2 exampleBar
ok 3 exampleBaz
1..3
# pass 3
# skip 0
# todo 0
# fail 0
# 1 of 1 browsers ok`],
    async: ['pass-async.js', `
TAP version 13
ok 1 exampleFoo
ok 2 exampleBar
ok 3 exampleBaz
1..3
# pass 3
# skip 0
# todo 0
# fail 0
# 1 of 1 browsers ok`]
  }, (assert, [files, expected]) => {
    let ret;
    try {
      ret = cp.execSync('npx airtap ' + files, {
        cwd: DIR,
        env: { PATH: process.env.PATH, HOME: process.env.HOME },
        encoding: 'utf8'
      });
    } catch (e) {
      assert.equal(normalize(e.stdout), null, 'stderr');
      return;
    }
    assert.equal(normalize(ret), expected.trim(), 'stdout');
  });

  QUnit.test.each('failing', {
    assert: ['fail-assert.js', `
TAP version 13
not ok 1 example
  ---
  message: some message
  severity: failed
  actual  : foo
  expected: bar
  stack: |
    ___/fail-assert.js@http://localhost/___
  ...
1..1
# pass 0
# skip 0
# todo 0
# fail 1
# 0 of 1 browsers ok`
    ]
  }, (assert, [files, expected]) => {
    try {
      const ret = cp.execSync('npx airtap ' + files, {
        cwd: DIR,
        env: { PATH: process.env.PATH, HOME: process.env.HOME },
        encoding: 'utf8'
      });
      assert.equal(ret, null, 'stdout');
    } catch (e) {
      assert.equal(normalize(e.stdout), expected.trim(), 'stderr');
      assert.true(e.status > 0, 'non-zero exit code');
    }
  });
});
