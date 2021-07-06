// [2, 10, 3, 4, 5, 11, 10, 11, 20] => [[2, 3, 4, 5], [10, 11], [20]]

function formArray(arr) {
  const map = new Map();

  for (let i = 0; i < arr.length; i++) {
    const index = Math.floor(arr[i] / 10);
    map.set(
      index,
      map.has(index) ? map.get(index).add(arr[i]) : new Set([arr[i]])
    );
  }

  const ans = [];

  for (let item of map) {
    ans.push(Array.from(item[1]));
  }

  return ans;
}
