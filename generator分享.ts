// 实现一个数字迭代器
class Count {
  limit: number
  constructor(limit) {
    this.limit = limit
  }
  [Symbol.iterator]() {
    let count = 1, limit = this.limit
    return {
      next() {
        if (count <= limit) {
          return { done: false, value: count++ }
        } else {
          return { done: true, value: undefined }
        }
      },
      return() {
        return { done: true }
      }
    }
  }
}

// 对象实现迭代器
const myIterator = {
  a: 1,
  b: 2,
  c: 3,
  *[Symbol.iterator]() {
    yield this.a
    yield this.b
    yield this.c
  }
}

// 实用generator实现异步
function run(gen) {
  // 执行器
  const g = gen();
  function next(data?) {
    const result = g.next(data)
    if (result.done) return
    result.value.then((data) => { next(data) })
  }
  next()
}

function fakeAjax(data, ms) {
  return new Promise(reslove => {
    setTimeout(() => reslove(data), ms)
  })
}

function* createFlow() {
  const data = yield fakeAjax("hi", 1000)
  console.log(data)
  const data1 = yield fakeAjax("hello", 1000)
  console.log(data)
  const data2 = yield fakeAjax("king", 1000)
  console.log(data)
}

run(createFlow)


// es5实现generator
function* test() {
  let a = 1 + 2;
  yield 2;
  yield 3;
}

function generator(cb) {
  return (function () {
    var obect = {
      next: 0,
      stop: function () { }
    };
    return {
      next: function () {
        let ret = cb(obect);
        if (ret === undefined) return { value: undefined, done: true }
        return {
          value: ret,
          done: false
        }
      }
    }
  })
}

function babelTest() {
  let a;
  return generator(function (_context) {
    while (1) {
      switch ((_context.prve = _context.next)) {
        case 0:
          a = 1 + 2;
          _context.next = 4
          return 2;
        case 4:
          _context.next = 6
          return 3
        case 6:
        case "end":
          return _context.stop();
      }
    }
  })
}
