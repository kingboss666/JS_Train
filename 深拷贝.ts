const isObject = (obj) =>
  obj !== null && (typeof obj === "object" || typeof obj === "function");
const isFunction = (obj) => typeof obj === "function";

function deepClone(obj, hash = new WeakMap()) {
  if (hash.get(obj)) {
    return hash.get(obj);
  }
  if (!isObject(obj)) {
    return obj;
  }
  if (isFunction(obj)) {
    // function返回原引用
    return obj;
  }

  let cloneObj;

  const Constructor = obj.constructor;

  switch (Constructor) {
    case Boolean:
    case Date:
      return new Date(+obj);
    case Number:
    case String:
    case RegExp:
      return new Constructor(obj);
    default:
      cloneObj = new Constructor();
      hash.set(obj, cloneObj);
  }

  [
    ...Object.getOwnPropertyNames(obj),
    ...Object.getOwnPropertySymbols(obj),
  ].forEach((k) => {
    cloneObj[k] = deepClone(obj[k], hash);
  });

  return cloneObj;
}
