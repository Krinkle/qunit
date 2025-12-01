---
layout: page
title: QUnit 3.0 Upgrade Guide
---

<p class="lead" markdown="1">If your tests pass without warnings on QUnit 2.24, you can generally upgrade to QUnit 3 without changes.</p>

The QUnit 3.0 release only removes deprecated methods, and promotes warnings to errors. If your tests pass on QUnit 2.24 without warnings, then you should be able to upgrade to QUnit 3 without changes.

As is our tradition, no significant features are introduced in major releases. The new features that you may informally associate with "QUnit 3" have been gradually in the QUnit 2.x series. Learn about the features introduced since QUnit 2.0 in [The Road to QUnit 3]({% post_url 2025-12-08-new-features-road-to-qunit-3 %}).

## Changes

* [New features](#new-features)
* [New theme](#new-theme)
* [Remove QUnit.load](#remove-qunitload)
* [Remove QUnit.onError and QUnit.onUnhandledRejection](remove-qunitonerror-and-qunitonunhandledrejection)
* [Remove support for legacy markup](#remove-support-for-legacy-markup)
* [Remove support for Node.js 10-16](#remove-support-for-nodejs-10-16)
* [Remove support for PhantomJS](#remove-support-for-phantomjs)
* [Remove Bower distribution](#remove-bower-distribution)
* [Remove AMD export](#remove-amd-export)

### New features

Check out [The Road to QUnit 3]({% post_url 2025-12-08-new-features-road-to-qunit-3 %}) to learn more about features introduced between QUnit 2.1 and QUnit 2.24, such as:

* [`assert.step()`]({% link api/assert/verifySteps.md %}) provides a complete and strict way to verify asynchronous or event-driven code.
* [`assert.timeout()`]({% link api/assert/timeout.md %}) to control the allowed duration of an async test.
* [`assert.rejects()`]({% link api/assert/rejects.md %}) to cleanly wait for and match an expected error from any async function or rejected Promise.
* [`assert.true()`]({% link api/assert/true.md %}) and [`assert.false()`]({% link api/assert/false.md %}) shortcuts.
* [`assert.propContains()`]({% link api/assert/propContains.md %}) to partially compare an object while ignoring other properties.
* [`assert.closeTo()`]({% link api/assert/closeTo.md %}) to expect a number within a certain range or tolerance.
* [`QUnit.test.each()`]({% link api/QUnit/test.each.md %}) to generate test cases via a data provider.
* [`QUnit.test.if()`]({% link api/QUnit/test.if.md %}) to automatically skip a test when a condition is false, for example in older browsers.
* Analyze where tests spend their time in Chrome DevTools or Firefox Profiler, with [`QUnit.reporters.perf`]({% link api/reporters/perf.md %}) enabled by default.
* Reliable reporting for early errors from [Callback events](./api/callbacks/index.md) and [Global hooks](./api/QUnit/hooks.md), which were difficult to debug prior to QUnit 2.17.

### New theme

QUnit 3.0 features a new edge to edge design with fresh color palette, improved color contrast, and various UX improvements. See [New QUnit 3.0 Theme](TODO).

### Remove `QUnit.load()`

The `QUnit.load()` method could be used by test runners or CI plugin to customize loading of scripts.

This was deprecated in in favor of the simpler `QUnit.start()`. Refer to [`QUnit.load()`](./api/QUnit/load.md) for a migration guide.

### Remove `QUnit.onError()` and `QUnit.onUnhandledRejection()`

The undocumented `QUnit.onError()` and `QUnit.onUnhandledRejection()` callbacks could be used by an integration plugin or custom test runner. These were deprecated in favor of the supported [`QUnit.onUncaughtException()`](./api/extension/QUnit.onUncaughtException.md) method since [QUnit 2.17]({% post_url 2021-09-05-qunit-2-17-0 %}).

### Remove support for legacy markup

Prior to QUnit 1.2, test pages used the following markup:

```html
<body>
  <h1 id="qunit-header">Tests</h1>
  <h2 id="qunit-banner"></h2>
  <div id="qunit-testrunner-toolbar"></div>
  <h2 id="qunit-userAgent"></h2>
  <ol id="qunit-tests"></ol>
</body>
```

Since QUnit 1.3 (released in 2012), this markup is automatically created and inserted into a `<div id="qunit">` element on the page.

```html
<body>
  <div id="qunit"></div>
</body>
```

QUnit 1.x and 2.x supported manual creation of this markup for backwards compatiblity. This has now been removed. Use `<div id="qunit">` instead. Learn more about HTML test files on the [Browser Runner](./browser.md) page.

### Remove support for Node.js 10-16

Support for Node.js 10-16 was removed. The QUnit CLI now requires Node.js 18 or later.

### Remove support for PhantomJS

QUnit no longer supports running tests in the PhantomJS browser. This was deprecated in [QUnit 2.13]({% post_url 2020-11-29-qunit-2-13-0 %}).

Other browser support remains unchanged. View the support tables for browsers and other runtimes at [Getting Started § Compatibility](./intro.md#compatibility).

### Remove Bower distribution

Future QUnit releases are no longer published to the Bower registry. QUnit 1.x and 2.x packages remain available via the Bower CLI.

Refer to [Download](./intro.md#download) or [Getting started](./intro.md).

### Remove AMD export

The `qunit.js` distribution no longer includes an AMD export for the QUnit API. 

See also [Example: Loading with RequireJS](./api/config/autostart.md#loading-with-requirejs).

You can continue to load your application and QUnit tests via AMD or RequireJS. This change only affects the loading of the `qunit.js` file.

## See also

* [QUnit 3.0.0 Full changelog](https://github.com/qunitjs/qunit/blob/3.0.0-alpha.4/History.md)
* [Blog: QUnit 3.0.0 Released!](% post_url 9999-99-99-qunit-3.0-0 %})
