[...Array(10000).keys()].filter((num) => {
  return (
    num.toString().length > 1 &&
    num === Number(num.toString().split("").reverse().join(""))
  );
});
