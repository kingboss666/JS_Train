const find = (S: string, T: string): number => {
  if (S.length < T.length) return -1;
  for (let i = 0; i < S.length - T.length; i++) {
    if (S.substr(i, T.length) === T) return i;
  }
  return -1;
};
