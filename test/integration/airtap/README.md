# QUnit ♥️ Airtap

See also <https://github.com/airtap/airtap>.

```bash
npx airtap pass-basic.js

# debug
npx airtap --verbose pass-basic.js

# list available browsers
npx airtap --list --all
```

```
…
```

## Issue 1: Fails with two browsers

```
/qunit/test/integration/airtap/$ npx airtap -a pass-basic.js
TAP version 13
# System Google Chrome 126.0.6478.127 [1]
ok 1 exampleFoo [1]
ok 2 exampleBar [1]
ok 3 exampleBaz [1]
1..3
# pass 3 [1]
# skip 0 [1]
# todo 0 [1]
# fail 0 [1]
TAP version 13
# System Mozilla Firefox 127.0.2 [2]
ok 1 exampleFoo [2]
ok 2 exampleBar [2]
ok 3 exampleBaz [2]
1..3
# pass 3 [2]
# skip 0 [2]
# todo 0 [2]
# fail 0 [2]

/Users/krinkle/Development/qunit/test/integration/airtap/node_modules/airtap/bin/airtap.js:152
  throw err
  ^
143
(Use `node --trace-uncaught ...` to show where the exception was thrown)

Node.js v21.1.0
```

```
/qunit/test/integration/airtap/$ NODE_OPTIONS='--trace-uncaught' npx airtap -a pass-basic.js
…
```

## Issue 2: Fails when invoked directly

```
/qunit/test/integration/airtap/$ npx airtap passing-basic.js
TAP version 13
ok 1 exampleFoo
…
# 1 of 1 browsers ok
```

```
/qunit/test/integration/airtap/$ ./node_modules/.bin/airtap passing-basic.js
Did not receive output from 'System Mozilla Firefox 127.0.2' (5 seconds)
```


This appears to be stripping one too many arguments. There is no `airtap:browserify` log message in the direct command when using `--verbose`. However, there is no error about that, and seemingly no way to fix it from the caller side either. I did try passing the executable to node, but to no avail.

```
/qunit/test/integration/airtap/$ node ./node_modules/.bin/airtap passing-basic.js
Did not receive output from 'System Mozilla Firefox 127.0.2' (5 seconds)
```

### Issue 3: Fails when invoked via node:child_process

(Reduced from qunit:/test/integration/airtap.js)

```
/qunit/test/integration/airtap/$ node -e "require('child_process').execSync('./node_modules/.bin/airtap airtap passing-basic.js',{encoding: 'utf8'});"
Did not receive output from 'System Mozilla Firefox 127.0.2' (5 seconds)
…
```

Idem via npx:

```
/qunit/test/integration/airtap/$ node -e "require('child_process').execSync('npx airtap passing-basic.js',{encoding: 'utf8'});"
Did not receive output from 'System Mozilla Firefox 127.0.2' (5 seconds)
node:child_process:965
    throw err;
    ^

Error: Command failed: npx airtap passing-basic.js
Did not receive output from 'System Mozilla Firefox 127.0.2' (5 seconds)

    at checkExecSyncError (node:child_process:890:11)
    at Object.execSync (node:child_process:962:15)
    at [eval]:1:26
    at runScriptInThisContext (node:internal/vm:144:10)
    at node:internal/process/execution:109:14
    at [eval]-wrapper:6:24
    at runScript (node:internal/process/execution:92:62)
    at evalScript (node:internal/process/execution:123:10)
    at node:internal/main/eval_string:51:3 {
  status: 1,
  signal: null,
  output: [
    null,
    '',
    "Did not receive output from 'System Mozilla Firefox 127.0.2' (5 seconds)\n"
  ],
  pid: 12616,
  stdout: '',
  stderr: "Did not receive output from 'System Mozilla Firefox 127.0.2' (5 seconds)\n"
}

Node.js v21.1.0
```

### Issue 4: When run via qunit, the first child process always fails

I extracted Issue 1-3 from this. I was expecting something in QUnit to cause the failure,
but the above shows stuff fails unconditionally via child_process. There appears to be something
about running it via QUnit that actually makes it pass, but only the second and third child process.

```
qunit$ npm install && npm run build
qunit$ node bin/qunit.js test/integration/airtap.js

TAP version 13
Did not receive output from 'System Mozilla Firefox 127.0.2' (5 seconds)
not ok 1 airtap > passing [basic]
  ---
  message: stderr
  severity: failed
  actual  : ""
  expected: null
  stack: |
        at Object.<anonymous> (/Users/krinkle/Development/qunit/test/integration/airtap.js:50:14)
  ...
ok 2 airtap > passing [async]
ok 3 airtap > failing [assert]
1..3
# pass 2
# skip 0
# todo 0
# fail 1
```
