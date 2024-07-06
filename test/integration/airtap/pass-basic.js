require('./qunit/qunit.js');
QUnit.reporters.tap.init(QUnit);

QUnit.test('exampleFoo', function (assert) {
  assert.true(true, 'x');
});
QUnit.test('exampleBar', function (assert) {
  assert.true(true, 'y');
});
QUnit.test('exampleBaz', function (assert) {
  assert.true(true, 'z');
});
