require('./qunit/qunit.js');
QUnit.reporters.tap.init(QUnit);

QUnit.test('exampleFoo', function (assert) {
  assert.true(true, 'x');
  setTimeout(assert.async(), 200);
});
QUnit.test('exampleBar', function (assert) {
  assert.true(true, 'y');
  setTimeout(assert.async(), 200);
});
QUnit.test('exampleBaz', function (assert) {
  assert.true(true, 'z');
  setTimeout(assert.async(), 200);
});
