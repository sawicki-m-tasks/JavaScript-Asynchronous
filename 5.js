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
    this.#promise = this.#promise.then(cb);
    return this;
  }
}

let promise = new MyPromise((resolve) => {
  setTimeout(() => {
    console.log(1, "async");
    resolve();
  }, 0);
})
  .synchThen(() => {
    console.log(2, "sync");
  })
  .then(() => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(3, "async");
        resolve();
      }, 1000);
    });
  })
  .then(() => {
    console.log(4, "async");
  })
  .synchThen(() => {
    console.log(5, "sync");
  });
console.log(6, "script done");


let myPromise1 = new MyPromise((resolve, reject) => {
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
let promise2 = new ReversePromise((resolve, reject) => {
  console.log(1);
  resolve();
})
.then(() => console.log(2))
.then(() => console.log(3))
.then(() => console.log(4));

class ReversePromise2 {
  #stack;
  constructor(cb) {
    const promise = new Promise(cb);
    this.#stack = [];
    promise.then(() => {
      this.#stack.reverse().forEach(cb => cb());
    })
  }
  then(cb) {
    this.#stack.push(cb);
    return this;
  }
}
let promise3 = new ReversePromise2((resolve, reject) => {
  console.log(1);
  resolve();
})
.then(() => console.log(2))
.then(() => console.log(3))
.then(() => console.log(4));


class ReversePromise3 {
  constructor(callback) {
    this.callbacks = [];

    this.promise = new Promise((resolve) => {
      callback(resolve);
    });

    this.promise.then(async () => {
      for (const cb of this.callbacks) {
        let tmp = cb();
        if (tmp instanceof Promise) {
          await tmp;
        } else {
          let mypromise = new Promise((resolve) => {
            resolve(cb);
          });
          await mypromise;
        }
      }
    });
  }

  then(next) {
    this.callbacks.unshift(next);
    return this;
  }
}

const promise4 = new ReversePromise3((resolve) => {
  setTimeout(() => {
    console.log(1);
    resolve();
  }, 1000);
})
  .then(() => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(2);
        resolve();
      }, 1000);
    });
  })
  .then(() => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(3);
        resolve();
      }, 1000);
    });
  })
  .then(() => console.log(4));
