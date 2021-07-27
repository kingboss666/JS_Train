/**
 * 如果⼀对兔⼦每⽉⽣⼀对兔⼦；⼀对新⽣兔，从第⼆个⽉起就开始⽣兔⼦；
 * 假定每对兔⼦都是⼀雌⼀雄，试问⼀对兔⼦，第n个⽉能繁殖成多少对兔⼦？
 */
const result = [];

function fn(n) {
  if (n === 1) {
    return 1;
  } else if (n === 2) {
    return 2;
  } else {
    if (result[n]) {
      return result[n];
    } else {
      result[n] = arguments.callee(n - 1) + arguments.callee(n - 2);
      return result[n];
    }
  }
}
