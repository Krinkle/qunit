require('./qunit/qunit.js');
QUnit.reporters.tap.init(QUnit);

QUnit.test('example', function (assert) {
  // eslint-disable-next-line no-undef
  boom();
  assert.true(true);
});
