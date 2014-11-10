
var solveAndListTrues = function (problem) {
  console.log(problem);
  var solution = Minisat.solve(problem);
  if (solution) {
    return solution.trueVars.join(' ');
  } else {
    return "UNSAT";
  }
};

var not = function (v) {
  if (v.charAt(0) === '-') {
    return v.slice(1);
  } else {
    return '-' + v;
  }
};

var and2 = function (out, a, b) {
  return [[not(a), not(b), out],
          [a, not(out)],
          [b, not(out)]];
};

var concat = function (arrayOfArrays) {
  var ret = [];
  return ret.concat.apply(ret, arrayOfArrays);
};

Tinytest.add('minisat - basic', function (test) {
  test.equal(solveAndListTrues([['a'], ['b'], ['c']]), 'a b c');
  test.equal(solveAndListTrues([['a'], ['-b'], ['c']]), 'a c');
  test.equal(solveAndListTrues([['a'], ['-a']]), "UNSAT");
  test.equal(solveAndListTrues(concat([
    and2('a&b', 'a', 'b'),
    [['a&b']]])), 'a a&b b');
  test.equal(solveAndListTrues(concat([
    and2('a&b', 'a', 'b'),
    [['-a&b'],
     ['b']]])), 'b');
});
