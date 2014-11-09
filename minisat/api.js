Minisat = {};

// `module` is the emscripten module
cMinisat = module.exports;

var solve_string0 = cMinisat.cwrap('solve_string', 'string', ['string', 'number']);
var solve_string = function (str) {
  return solve_string0(str, str.length);
};

// Accepts a problem of the form `[[["a"], "b"], ["a", ["b", "c"], "d"]]`,
// meaning `((!a) || b) && (a || (!b) || (!c) || d)`.
// Top level is clauses.  Within each clause, any variable that is nested
// in an array is considered negated.  Variables may be any string.
Minisat.solve = function (problem) {
  // convert problem to CNF form


  return solve_string('p cnf 3 2\n1 -3 0\n2 3 -1 0', 'SAT 1 2 -3');
};

Minisat._cMinisat = cMinisat;
