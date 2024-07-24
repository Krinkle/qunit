import { window } from './globals.js';
import equiv from './equiv.js';
import dump from './dump.js';
import { runSuite, module } from './module.js';
import Assert from './assert.js';
import { test, pushFailure } from './test.js';
import reporters from './reporters.js';
import config from './config.js';
import hooks from './hooks.js';
import { objectType, is } from './utilities.js';
import { createRegisterCallbackFunction } from './callbacks.js';
import { stack } from './stacktrace.js';
import ProcessingQueue from './processing-queue.js';
import { urlParams } from './urlparams.js';
import { on } from './events.js';
import onUncaughtException from './on-uncaught-exception.js';
import diff from './diff.js';
import version from './version.js';
import { start } from './start.js';

// The "currentModule" object would ideally be defined using the createModule()
// function. Since it isn't, add the missing suiteReport property to it now that
// we have loaded all source code required to do so.
//
// TODO: Consider defining currentModule in core.js or module.js in its entirely
// rather than partly in config.js and partly here.
config.currentModule.suiteReport = runSuite;

config._pq = new ProcessingQueue(test);

// Figure out if we're running the tests from a server or not
const isLocal = (window && window.location && window.location.protocol === 'file:');

const begin = createRegisterCallbackFunction('begin');
const done = createRegisterCallbackFunction('done');
const log = createRegisterCallbackFunction('log');
const moduleDone = createRegisterCallbackFunction('moduleDone');
const moduleStart = createRegisterCallbackFunction('moduleStart');
const testDone = createRegisterCallbackFunction('testDone');
const testStart = createRegisterCallbackFunction('testStart');

const assert = Assert.prototype;

const only = test.only;
const skip = test.skip;
const todo = test.todo;

export {
  hooks,
  module,
  start,
  test,

  only,
  skip,
  todo,

  begin,
  done,
  log,
  moduleDone,
  moduleStart,
  on,
  testDone,
  testStart,

  config,

  assert,
  diff,
  dump,
  equiv,
  is,
  isLocal,
  objectType,
  onUncaughtException,
  pushFailure,
  reporters,
  stack,
  urlParams,
  version
};
