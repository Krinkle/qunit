---
layout: post
title: "The Road to QUnit 3: New features"
author: krinkle
excerpt: Step API, data providers, conditional skip, global hooks, and more.
tags:
- feature
---

Check out the [blog archive]({% link blog/archive.md %}) or [repository changelog](https://github.com/qunitjs/qunit/blob/main/History.md) for a more detailed history.

## Step API

The [Step API]({% link api/assert/verifySteps.md %}) provides a complete and strict way to verify asynchronous or event-driven code. You use it via the `assert.step()` and [`assert.verifySteps()`]({% link api/assert/verifySteps.md %}) methods, introduced in QUnit 2.2.

By simply marking and verifying steps, you automatically observe details about what is called, how it is called, when it is called, and how often. You can also capture unexpected steps, which are detected and reported as a test failure.

```js
QUnit.test('example', function (assert) {
  const finder = new WordFinder();
  finder.on('start', () => assert.step('start'));
  finder.on('data', (word) => assert.step(word));
  finder.on('end', () => assert.step('end'));
  finder.on('error', (e) => assert.step('error: ' + e));

  finder.process('Hello, 3.1. Great!');

  assert.verifySteps(['start', 'Hello', 'Great', 'end']);
});
```

## test.todo()

QUnit 2.2 adds [`QUnit.test.todo()`]({% link api/QUnit/test.todo.md %}) (and later [`QUnit.module.todo()`]({% link api/QUnit/module.md %})), to natively recognise tests that intentionally fail because the implementation is not finished yet.

If you write a test for a featuure before implementating it (e.g. as part of a [TDD](https://en.wikipedia.org/wiki/Test-driven_development) practice), this encourages sharing a specification or design early on by committing it to source control. YOU can then collaborate on that feature, and gradually enable tests and make them pass.

## assert.timeout()

Since QUnit 2.4, you can override the default timeout on a per-test basis with [`assert.timeout()`]({% link api/assert/timeout.md %}).

```js
QUnit.test('wait for an async function', async function (assert) {
  assert.timeout(500); // Timeout after 0.5 seconds

  const result = await asyncAdder(5, 7);
  assert.strictEqual(result, 12);
});
```

## assert.rejects()

QUnit 2.5 adds [`assert.rejects()`]({% link api/assert/rejects.md %}) as asynchronous version of `assert.throws()`. It allows for a simple and readable way to match an expected error from any async function or rejected Promise. No more [workarounds]({% link api/assert/rejects.md %}#example-workarounds)!

```js
async function feedBaby (food) {
  if (food === 'sprouts') {
    throw new RangeError('Do not like');
  }
  return true;
}

QUnit.test('example', async function (assert) {
  assert.true(feedBaby('apple'));

  await assert.rejects(feedBaby('sprouts'), RangeError);

  assert.true(feedBaby('cucumber'), RangeError);
});
```

## Performance Timeline

QUnit 2.7 adds integration with the Performance Timeline to understand where your tests spend time. This feature measures the duration of every test, and adds them to the Firefox Profiler and Chrome DevTools. It is enabled by default when running tests in a browser.

See also [`QUnit.reporters.perf`]({% link api/reporters/perf.md %}).

```
QUnit Run
└── QUnit Module: Example
    ├── QUnit Test: apple
    ├── QUnit Test: banana
    └── QUnit Test: citron
```

<figure>
  <img alt="QUnit profiling in Chrome DevTools Performance tab" src="/resources/perf-chrome.png">
</figure>

## assert.true() and assert.false()

The new strict boolean [`assert.true()`]({% link api/assert/true.md %}) and [`assert.false()`]({% link api/assert/false.md %}) methods arrived in QUnit 2.11. These methods provide a shortcut to [`assert.strictEqual()`]({% link api/assert/strictEqual.md %}) with `true` and `false` as the expected value.

This feature promotes strict equality, because [`assert.ok()`]({% link api/assert/ok.md %}) and `assert.equal()` use type casting.

## Data providers

QUnit 2.16 brings [`QUnit.test.each()`]({% link api/QUnit/test.each.md %}) to generate independent test cases based on a data provider. This removes the need to duplicate code across many similar tests, and removes the need for ad-hoc loops and other (often, untested) custom abstractions.

## assert.propContains()

QUnit 2.18 adds [`assert.propContains()`]({% link api/assert/propContains.md %}) to partially compare an object against expected key-value pairs, whilst ignoring other properties. This complements the [`assert.propEqual()`]({% link api/assert/propEqual.md %}) method.

```js
QUnit.test('example', function (assert) {
  const result = {
    foo: 0,
    vehicle: {
      timeCircuits: 'on',
      fluxCapacitor: 'fluxing',
      engine: 'running'
    },
    quux: 1
  };

  assert.propContains(result, {
    foo: 0,
    vehicle: { fluxCapacitor: 'fluxing' }
  });
});
```

## assert.closeTo()

QUnit 2.21 introduces [`assert.closeTo()`]({% link api/assert/closeTo.md %}) to check that a number is within a certain range or tolerance from an expected number.

```js
QUnit.test('example', function (assert) {
  const x = 0.1 + 0.2; // 0.30000000000000004
  const y = 2013;

  // passing: x is between 0.299 and 0.301
  assert.closeTo(x, 0.3, 0.001);

  // passing: 3.14159 is between 3.140 and 3.142
  assert.closeTo(Math.PI, 3.141, 0.001);

  // passing: y is between 2010 and 2014 inclusive
  assert.closeTo(y, 2012, 2);
});
```

## Conditional skip

QUnit 2.22 introduced [`QUnit.test.if()`]({% link api/QUnit/test.if.md %}) and `QUnit.module.if()` to automatically skip a test when a certain condition is false. For example, to test a feature that is not available in older browsers.

## Features for test runners and plugins

### Preconfiguration

QUnit 2.1 introduced support for a predefined [`QUnit.config`]({% link api/config/index.md %}).

### Event emitter

QUnit 2.2 introduced the [`QUnit.on()`]({% link api/callbacks/QUnit.on.md %}) event emitter, which lets you create custom reporters. These can be loaded in the browser, as well as in [QUnit CLI]({% link cli.md %}) via `--reporter`.

```js
QUnit.on('runEnd', (runEnd) => {
  console.log(`Passed: ${runEnd.passed}`);
  console.log(`Failed: ${runEnd.failed}`);
  console.log(`Skipped: ${runEnd.skipped}`);
  console.log(`Todo: ${runEnd.todo}`);
  console.log(`Total: ${runEnd.total}`);
});
```

### QUnit CLI

QUnit 2.3 introduced the [QUnit CLI]({% link cli.md %}), with the `--require` option arriving in 2.6, and the `--module` option in 2.19.

### Global hooks

QUnit 2.18 introduced [QUnit.hooks]({% link api/QUnit/hooks.md %}) to globally add `beforeEach` and `afterEach` hooks, to all tests and modules in a project.

## See also

* [QUnit 3.0 Upgrade Guide]({% link upgrade-guide-3.x.md %})
