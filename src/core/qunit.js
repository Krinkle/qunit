import * as QUnitCore from './core.js';
import { initBrowser } from './browser/browser-runner.js';
import { window, document } from './globals.js';
import { setQUnitObject } from './start.js';
import exportQUnit from './export.js';

// The imported object from core.js, per ESM/Rollup, is frozen.
// We support adding and replacing QUnit methods, so wrap the exported
// object in Object.create() to create writable version. The caveat is
// that a monkey-patched method like QUnit.test() will be reflected in
// `import QUnit from qunit.js; QUnit.test()`
// the change is not visible to
// `import { test } from qunit.js`
//
// CJS usage is unaffected since there we assign the writeable QUnit
// object to module.exports. The read-only QUnitCore will only
// be exposed to ESM via `export * from './core.js';` below.
const QUnit = Object.create(QUnitCore);

setQUnitObject(QUnit);

exportQUnit(QUnit);

if (window && document) {
  initBrowser(QUnit, window, document);
}

// TODO: Decide how to format the CJS and ESM distribution
// in Rollup config.
// export * from './core.js';
// export default QUnit;
