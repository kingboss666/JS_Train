enum PromiseState {
  PENDING = "pending",
  RESOLVED = "resolved",
  REJECTED = "rejected",
}

class MyPromise {
  value: any;
  currentState: PromiseState;
  onReslovedArr: (() => void)[];
  onRejectedArr: (() => void)[];

  constructor(fn) {
    this.value = undefined;
    this.currentState = PromiseState.PENDING;
    // 用户储存 then 中的回调，只有 pending 状态是才会缓存
    this.onReslovedArr = [];
    this.onRejectedArr = [];
    // 执行 fn
    fn(this.resolved.bind(this), this.rejected.bind(this));
  }

  // 创建 resolved 和 rejected 函数
  private resolved(value) {
    setTimeout(() => {
      if (this.currentState === PromiseState.PENDING) {
        this.currentState = PromiseState.RESOLVED;
        this.value = value;
        this.onReslovedArr.forEach((cb) => cb());
      }
    }, 0);
  }

  private rejected(error) {
    setTimeout(() =>{
      if (this.currentState === PromiseState.PENDING) {
        this.currentState = PromiseState.REJECTED;
        this.value = error;
        this.onRejectedArr.forEach((cb) => cb());
      }
    }, 0);
  }

  then(onResloved, onRejected) {
    const _this = this;
    let promise2;
    // 保证传入的是函数
    onResloved =
      typeof onResloved === "function"
        ? onResloved
        : function (value) {
            return value;
          };
  
    onRejected =
      typeof onRejected === "function"
        ? onRejected
        : function (error) {
            return error;
          };
    // 有结果的情况下以及重复调用 .then 触发
    if (_this.currentState === PromiseState.RESOLVED) {
      return (promise2 = new MyPromise(function (resolved, rejected) {
        let x = onResloved(_this.value);
        if (x instanceof MyPromise) {
          x.then(resolved, rejected);
        } else {
          resolved(x);
        }
      }));
    }
  
    if (_this.currentState === PromiseState.REJECTED) {
      return (promise2 = new MyPromise(function (resolved, rejected) {
        let x = onRejected(_this.value);
        if (x instanceof MyPromise) {
          x.then(resolved, rejected);
        } else {
          resolved(x);
        }
      }));
    }
  
    // 状态是 pending 的话给把函数推入对应数组
    if (_this.currentState === PromiseState.PENDING) {
      return (promise2 = new MyPromise(function (resolved, rejected) {
        _this.onReslovedArr.push(function () {
          let x = onResloved(_this.value);
          if (x instanceof MyPromise) {
            x.then(resolved, rejected);
          } else {
            resolved(x);
          }
        });
  
        _this.onRejectedArr.push(function () {
          let x = onRejected(_this.value);
          if (x instanceof MyPromise) {
            x.then(resolved, rejected);
          } else {
            resolved(x);
          }
        });
      }));
    }
  };
}