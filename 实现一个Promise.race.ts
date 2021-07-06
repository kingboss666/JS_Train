const promiseRace = (promises) => {
  return new Promise((reslove, reject) => {
    promises.forEach((promise) => {
      promise.then(reslove, reject);
    });
  });
};
