function promiseAll(promises: Promise<any>[] = []) {
  const result = [];
  function check(reslove) {
    const len = result.length;
    if (len === promises.length) reslove(result);
  }
  return new Promise((resolve) => {
    for (let i = 0; i < promises.length; i++) {
      const promise = promises[i];
      promise.then((res) => {
        result[i] = res;
        check(resolve);
      });
    }
  });
}
