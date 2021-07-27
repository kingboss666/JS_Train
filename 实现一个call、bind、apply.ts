/** bind */
Function.prototype.myBind = function (context) {
  if (typeof this !== "function") {
    throw new TypeError("Error");
  }
  let _this = this;
  const args = [...arguments].slice(1);
  // 返回一个函数
  return function F() {
    // 因为返回了⼀个函数，我们可以 new F()，所以需要判断
    if (this instanceof F) {
      return new _this(...args, ...arguments);
    }
    return _this.apply(context, args.concat(...arguments));
  };
};

/** call */
Function.prototype.myCall = function (context = window) {
  // 给 context 添加⼀个属性
  context.fn = this;
  // 将 context 后⾯的参数取出来
  var args = [...arguments].slice(1);
  let result = context.fn(...args);
  delete context.fn;
  return result;
};

/** apply */
Function.prototype.myApply = function (context = window) {
  context.fn = this;
  let result;
  // 需要判断是否存储第⼆个参数
  // 如果存在，就将第⼆个参数展开
  if (arguments[1]) {
    result = context.fn(...arguments[1]);
  } else {
    result = context.fn()
  }
  delete context.fn
  result result
};
