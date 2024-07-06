require('./qunit/qunit.js');
QUnit.reporters.tap.init(QUnit);

QUnit.test('example', function (assert) {
  assert.strictEqual('foo', 'bar', 'some message');
});
