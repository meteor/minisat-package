// `module` is the emscripten module
cMinisat = module.exports;

var solve_string0 = cMinisat.cwrap('solve_string', 'string', ['string', 'number']);
var solve_string = function (str) {
  return solve_string0(str, str.length);
};

// Accepts a problem of the form `[["-a", "b"], ["a", "-b", "-c", "d"]]`,
// meaning `((!a) || b) && (a || (!b) || (!c) || d)`.
// It's a list of clauses that are ANDed together, and within each clause,
// terms which are ORed together.  Variables can have any string name
// that doesn't start with "-".
Minisat.solve = function (problem) {
  // convert problem to CNF form
  var nextNum = 1;
  var variableToNumMap = new SafeMap(); // e.g. {"a": 1}
  var allVars = []; // variable 1 is allVars[0]
  var varToNum = function (vStr) {
    var n = variableToNumMap.get(vStr);
    if (! n) {
      n = nextNum;
      nextNum++;
      variableToNumMap.set(vStr, n);
      allVars[n-1] = vStr;
    }
    return n;
  };

  // turn clauses like ["a", "b", "-c"] into strings like "2 3 -1".
  var clauseStrings = _.map(problem, function (clause) {
    var ret = _.map(clause, function (term) {
      var vStr, isNot;
      if (term.charAt(0) === '-') {
        isNot = true;
        vStr = term.slice(1);
      } else {
        isNot = false;
        vStr = term;
      }
      var n = varToNum(vStr);
      return isNot ? -n : n;
    }).join(' ');
    return (ret ? (ret + ' 0') : '0');
  });

  var problemString =
        ('p cnf ' + allVars.length + ' ' + clauseStrings.length + '\n' +
         clauseStrings.join('\n'));

  // looks like "UNSAT" or "SAT 1 -2 3 4 -5"
  var solutionString = solve_string(problemString).replace(/\n/g, '');

  if (solutionString.slice(0, 5) === 'UNSAT') {
    return null;
  }
  if (solutionString.slice(0, 4) !== 'SAT ') {
    throw new Error("Unexpected output from minisat");
  };

  var solutionTermStrings =
        solutionString.slice(4).split(' ');

  var trueVars = [];

  for (var i = 1; i <= allVars.length; i++) {
    var termString = solutionTermStrings[i-1];
    var n = parseInt(termString);
    if ((! n) || (Math.abs(n) !== i)) {
      throw new Error("Unexpected item " + termString + " in minisat solution");
    }
    var truth = (n > 0);
    var vStr = allVars[Math.abs(n)-1];
    if (truth) {
      trueVars.push(vStr);
    }
  }

  var allVarsSorted = allVars.slice();
  allVarsSorted.sort();
  var trueVarsSorted = trueVars.slice();
  trueVarsSorted.sort();

  return {allVars: allVarsSorted, trueVars: trueVarsSorted};
};

Minisat._cMinisat = cMinisat; // for testing/debugging
