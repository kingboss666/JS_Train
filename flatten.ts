const arr = [1, 2, 3, [4, 5], [6, [7, [8]]]];
// 迭代实现
function flatten(arr) {
  const arrs = [...arr],
    newArr = [];
  while (arrs.length) {
    const item = arrs.shift();
    if (Array.isArray(item)) {
      arrs.unshift(...item);
    } else {
      newArr.push(item);
    }
  }
  return newArr;
}

// 递归实现
function flatten2(arr) {
  const arrs = [];

  arr.map((item) => {
    if (Array.isArray(item)) {
      arrs.push(...flatten2(item));
    } else {
      arrs.push(item);
    }
  });

  return arrs;
}

console.log(flatten(arr));
console.log(flatten2(arr));
