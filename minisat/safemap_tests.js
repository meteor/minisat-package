var SafeMap = Minisat._SafeMap;

Tinytest.add('minisat - safemap', function (test) {
  var m = new SafeMap();
  test.equal(m.keys(), []);
  m.set('a', 1);
  test.equal(m.keys(), ['a']);
  test.equal(m.get('a'), 1);
  test.equal(m.get('b'), undefined);
  m.del('a');
  test.equal(m.keys(), []);
  test.equal(m.get('a'), undefined);

  test.equal(m.get('hasOwnProperty'), undefined);
  test.equal(m.get('__proto__'), undefined);
  m.set('hasOwnProperty', 1);
  m.set('__proto__', 2);
  test.equal(m.keys(), ['hasOwnProperty', '__proto__']);
  test.equal(m.get('hasOwnProperty'), 1);
  test.equal(m.get('__proto__'), 2);
  m.del('hasOwnProperty');
  m.del('__proto__');
  test.equal(m.keys(), []);
  test.equal(m.get('hasOwnProperty'), undefined);
  test.equal(m.get('__proto__'), undefined);
});
