class MyPromise {
  #promise;
  constructor(cb) {
    this.#promise = new Promise(cb);
  }
  synchThen(cb) {
    cb();
    return this;
  }
  then(cb) {
    this.#promise.then(cb);
    return this;
  }
}

let myPromise = new MyPromise((resolve, reject) => {
  console.log(1);
  resolve();
}).synchThen(() => {
  console.log(2);
}).then(() => {
  console.log(3);
});
console.log(4);

class ReversePromise {
  #promise;
  #timeout;
  #stack;
  constructor(cb) {
    this.#promise = new Promise(cb);
    this.#stack = [];
  }
  calltime() {
    this.#timeout = setTimeout(() => {
      this.#stack.reverse().forEach(el => this.#promise.then(el))
    });
  }
  then(cb) {
    if(this.#timeout !== undefined) {
      clearTimeout(this.#timeout);
    }
    this.#stack.push(cb);
    this.calltime();
    return this;
  }
}
var i = 0;
let promise = new ReversePromise((resolve, reject) => {
  console.log(1);
  resolve();
})
.then(() => console.log(2))
.then(() => console.log(3))
.then(() => console.log(4));

class ReversePromise2 {
  #stack;
  #promise;
  constructor(cb) {
    this.#promise = new Promise(cb);
    this.#stack = [];
    this.#promise.then(() => {
      this.#stack.reverse().forEach(cb => cb());
    })
  }
  then(cb) {
    this.#stack.push(cb);
    return this;
  }
}
let promise2 = new ReversePromise2((resolve, reject) => {
  console.log(1);
  resolve();
})
.then(() => console.log(2))
.then(() => console.log(3))
.then(() => console.log(4));