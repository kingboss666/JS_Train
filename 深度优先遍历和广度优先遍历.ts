// 利用深度优先遍历实现dom查询
function DFS(dom: Element, search: string): Element[] {
  let result = [];

  for (let child of dom.children) {
    result = result.concat(DFS(child, search));
  }

  if (search === "*" || search.toUpperCase() === dom.tagName) {
    result.push(dom);
  }

  return result;
}

// 利用广度优先遍历实现dom查询
function BFS(dom: Element, search: string): Element[] {
  const result = [];
  const queue = [dom];
  let current: Element;

  while ((current = queue.shift())) {
    if (search === "*" || current.tagName === search.toUpperCase()) {
      result.push(current);
    }

    for (let child of current.children) {
      queue.push(child);
    }
  }

  return result;
}

// 工具函数
const _toString = Object.prototype.toString;
const map = {
  array: "Array",
  object: "Object",
  function: "Function",
  string: "String",
  null: "Null",
  undefined: "Undefined",
  boolean: "Boolean",
  number: "Number",
};
const getType = (item) => {
  return _toString.call(item).slice(8, -1);
};
const isTypeOf = (item, type) => {
  return map[type] && map[type] === getType(item);
};

// 利用深度优先遍历实现深拷贝
const DFSdeepClone = (obj, visitedArr = []) => {
  let _obj = {};

  if (isTypeOf(obj, "array") || isTypeOf(obj, "object")) {
    const index = visitedArr.indexOf(obj);
    _obj = isTypeOf(obj, "array") ? [] : {};
    if (~index) {
      _obj = visitedArr[index];
    } else {
      visitedArr.push(obj);
      for (let item in obj) {
        _obj[item] = DFSdeepClone(obj[item], visitedArr);
      }
    }
  } else if (isTypeOf(obj, "function")) {
    _obj = eval("(" + obj.toString() + ")");
  } else {
    _obj = obj;
  }

  return _obj;
};

// 利用广度优先遍历实现深拷贝
const BFSdeepClone = (obj) => {
  let origin = [obj],
    copyObj = {},
    copy = [copyObj];
  let visitedQueue = [],
    visitedCopyQueue = [];

  while (origin.length > 0) {
    let items = origin.shift(),
      _obj = copy.shift();
    visitedQueue.push(items);
    if (isTypeOf(items, "array") || isTypeOf(items, "object")) {
      for (let item in items) {
        let val = items[item];
        if (isTypeOf(val, "object")) {
          let index = visitedQueue.indexOf(val);
          if (!~index) {
            _obj[item] = {};
            // 下次while循环使用给空对象提供数据
            origin.push(val);
            // 推入引用对象
            copy.push(_obj[item]);
          } else {
            _obj[item] = visitedCopyQueue[index];
            visitedCopyQueue.push(_obj);
          }
        } else if (isTypeOf(val, "array")) {
          // 数组类型在这里创建了一个空数组
          _obj[item] = [];
          origin.push(val);
          copy.push(_obj[item]);
        } else if (isTypeOf(val, "function")) {
          _obj[item] = eval("(" + obj.toString() + ")");
        } else {
          _obj[item] = obj;
        }
      }
      // 将已经处理过的对象数据推入数组 给环状数据使用
      visitedCopyQueue.push(_obj);
    } else if (isTypeOf(items, "function")) {
      copyObj = eval("(" + items.toString() + ")");
    } else {
      copyObj = obj;
    }
  }

  return copyObj;
};
