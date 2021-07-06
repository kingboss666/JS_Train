function create() {
  const obj = new Object();
  const con = [].shift.call(arguments);
  obj.__proto__ = con.prototype;
  const result = con.apply(obj, arguments);
  return typeof result === "object" ? result : obj;
}
