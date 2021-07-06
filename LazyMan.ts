class LazyManClass {
  name: string;
  private taskList: Function[];

  constructor(name: string) {
    this.taskList = [];
    this.name = name;
    console.log(`Hi I am ${this.name}`);
    setTimeout(() => {
      this.next();
    }, 0);
  }

  eat(name) {
    const that = this;
    const fn = (function (n) {
      return function () {
        console.log(`I am eating ${n}`);
        that.next();
      };
    })(name);
    this.taskList.push(fn);
    return this;
  }

  sleepFirst(time) {
    const that = this;
    const fn = (function (t) {
      return function () {
        setTimeout(() => {
          console.log(`等待了${t}秒`);
          that.next();
        }, t * 1000);
      };
    })(time);
    this.taskList.unshift(fn);
    return this;
  }

  sleep(time) {
    const that = this;
    const fn = (function (t) {
      return function () {
        setTimeout(() => {
          console.log(`等待了${t}秒`);
          that.next();
        }, t * 1000);
      };
    })(time);
    this.taskList.push(fn);
    return this;
  }

  private next() {
    const fn = this.taskList.shift();
    fn && fn();
  }
}

function LazyMan(name) {
  return new LazyManClass(name);
}

LazyMan("Tony")
  .eat("lunch")
  .eat("dinner")
  .sleepFirst(5)
  .sleep(10)
  .eat("junk food");
