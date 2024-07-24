import QUnit from './core.js';
import { initBrowser } from './browser/browser-runner.js';
import { window, document } from './globals.js';
import { setQUnitObject } from './start.js';
import exportQUnit from './export.js';

setQUnitObject(QUnit);
exportQUnit(QUnit);

if (window && document) {
  initBrowser(QUnit, window, document);
}
