const promisift = require("util").promisify;
const path = require("path");
const fs = require("fs");
const readFile = promisift(fs.readFile);

function run(gen) {
  const g = gen();
  function next(data?) {
    const res = g.next(data);
    if (res.deno) return res.value;
    res.value.then((data) => next(data));
  }
  next();
}

run(function* () {
  const res1 = yield readFile(path.resolve(__dirname, "../data/a.json"), {
    encoding: "utf8",
  });
  console.log(res1);
  const res2 = yield readFile(path.resolve(__dirname, "../data/b.json"), {
    encoding: "utf8",
  });
  console.log(res2);
});
