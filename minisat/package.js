Package.describe({
  summary: "SAT solver (minisat.se)",
  version: '1.0.0'
});

Package.on_use(function (api) {
  api.export('Minisat');
  api.use('underscore');
  api.add_files(['setup.js', 'minisat.js', 'api.js']);
});

Package.on_test(function (api) {
  api.use('tinytest');
  api.use('minisat');
  api.add_files('minisat_tests.js');
});
