function fn(list, value) {
  // 回溯的标记
  let _p = Symbol("parent");

  // 找到子节点
  let result;

  function _fn(arr, p) {
    for (let i = 0; i < arr.length; i++) {
      arr[i][_p] = p;
      if (arr[i].id === value) {
        result = arr[i];
        return;
      }
      !result && arr[i].children && _fn(arr[i].children, arr[i]);
    }
    if (result) return;
  }

  _fn(list, null);

  let tmp = [];
  if (!result) return null;

  while (result) {
    tmp.unshift(result.id);
    result = result[_p];
  }

  return tmp;
}
