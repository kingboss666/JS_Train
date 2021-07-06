function convert(list) {
  const result = [];
  const map = list.reduce((res, v) => ((res[v.id] = v), res), {});

  for (const item of list) {
    if (item.parentId === 0) {
      result.push(item);
      continue;
    }

    if (item.parentId in map) {
      const parent = map[item.parentId];
      parent.children = parent.children || [];
      parent.children.push(item);
    }
  }

  return result;
}
