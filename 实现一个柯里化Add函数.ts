function add() {
  var _args = Array.prototype.slice.call(arguments);

  var _adder = function () {
    _args.push(...arguments);
    return _adder;
  };

  _adder.toString = function () {
    return _args.reduce(function (a, b) {
      return a + b;
    });
  };

  return _adder;
}
