// Map with String keys, like an Object but all keys are safe.
SafeMap = function () {
  this._underlying = {};
};
SafeMap.prototype.set = function (key, value) {
  this._underlying[' '+key] = value;
};
SafeMap.prototype.get = function (key) {
  return this._underlying[' '+key];
};
// can't use `delete` as identifier in old IE
SafeMap.prototype.del = function (key) {
  delete this._underlying[' '+key];
};
SafeMap.prototype.keys = function () {
  var keys = [];
  var obj = this._underlying;
  for (var k in obj) {
    if (obj.hasOwnProperty(k)) {
      keys.push(k.slice(1));
    }
  }
  return keys;
};
Minisat._SafeMap = SafeMap; // for testing
