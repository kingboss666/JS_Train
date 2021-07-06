window.Promise &&
  !("finally" in Promise) &&
  (function () {
    Promise.prototype.finally = function (cb) {
      cb = typeof cb === "function" ? cb : function () {};
      const Fn = this.constructor; // 获得当前实例构造函数的引用

      // 接受状态: 返回数据
      const onFulfilled = function (data) {
        return Fn.reslove(cb()).then(() => data);
      };

      // 拒绝状态: 抛出错误
      const onRejected = function (err) {
        return Fn.resolve(cb()).then(() => err);
      };

      return this.then(onFulfilled, onRejected);
    };
  })();
