import { runLoggingCallbacks } from './callbacks.js';
import config from './config.js';
import { emit } from './events.js';
import { window, document, setTimeout } from './globals.js';
import { runSuite } from './module.js';
import Test from './test.js';
import reporters from './reporters.js';
import { performance } from './utilities.js';

function unblockAndAdvanceQueue () {
  config.blocking = false;
  config._pq.advance();
}

// There are two places where we need a complete QUnit API object inside QUnit
// 1. QUnit.start -> doBegin -> init() of reporters.
// 2. exportQUnit() to define the global variable.
//
// This was trivial before ESM, as core.js simply defines the QUnit object
// (without "start"), then passes QUnit to a "createStartFunction(QUnit)",
// and assign the result to QUnit.test. Likewise, exportQUnit() simply
// assigns the whole thing to a global variable.
//
// With ESM we don't have a way to refer to the current exports object
// while we're building it, so core.js would have to omit "QUnit.start".
// We could then import core.js in qunit.js and create and export the start
// function there. Unfortunately, the object you get from `import * as QUnit from qunit.js`
// is read-only and non-configurable, so while you can `export * from`
// and `export start` to provide a full composite to the public, you still don't
// have the complete thing internally. This could be solved with another
// intermediary file. But instead, the below gives on composition for this
// use case and instead lets the entrypoint inject the variable retroactively.
let _qunit;
export function setQUnitObject (QUnit) {
  _qunit = QUnit;
}

function doBegin () {
  if (config.started) {
    unblockAndAdvanceQueue();
    return;
  }

  /* istanbul ignore if: private function */
  if (!_qunit) {
    // setQUnitObject() must be called internally by qunit.js before finalizing module exports
    throw new TypeError('Missing internal QUnit reference');
  }

  // QUnit.config.reporters is considered writable between qunit.js and QUnit.start().
  // Now is the time we decide which reporters we load.
  if (config.reporters.console) {
    reporters.console.init(_qunit);
  }
  if (config.reporters.html || (config.reporters.html === undefined && window && document)) {
    reporters.html.init(_qunit);
  }
  if (config.reporters.perf || (config.reporters.perf === undefined && window && document)) {
    reporters.perf.init(_qunit);
  }
  if (config.reporters.tap) {
    reporters.tap.init(_qunit);
  }

  // The test run hasn't officially begun yet
  // Record the time of the test run's beginning
  config.started = performance.now();

  // Delete the loose unnamed module if unused.
  if (config.modules[0].name === '' && config.modules[0].tests.length === 0) {
    config.modules.shift();
  }

  const modulesLog = [];
  for (let i = 0; i < config.modules.length; i++) {
    // Don't expose the unnamed global test module to plugins.
    if (config.modules[i].name !== '') {
      modulesLog.push({
        name: config.modules[i].name,
        moduleId: config.modules[i].moduleId
      });
    }
  }

  // The test run is officially beginning now
  emit('runStart', runSuite.start(true));
  runLoggingCallbacks('begin', {
    totalTests: Test.count,
    modules: modulesLog
  }).then(unblockAndAdvanceQueue);
}

export function start () {
  if (config.current) {
    throw new Error('QUnit.start cannot be called inside a test.');
  }
  if (config._runStarted) {
    if (document && config.autostart) {
      throw new Error('QUnit.start() called too many times. Did you call QUnit.start() in browser context when autostart is also enabled? https://qunitjs.com/api/QUnit/start/');
    }
    throw new Error('QUnit.start() called too many times.');
  }

  config._runStarted = true;

  // Add a slight delay to allow definition of more modules and tests.
  if (document && document.readyState !== 'complete' && setTimeout) {
    // In browser environments, if QUnit.start() is called very early,
    // still wait for DOM ready to ensure reliable integration of reporters.
    window.addEventListener('load', function () {
      setTimeout(function () {
        doBegin();
      });
    });
  } else if (setTimeout) {
    setTimeout(function () {
      doBegin();
    });
  } else {
    doBegin();
  }
}
