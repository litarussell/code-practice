// let p = new Promise((resolve, reject) => {
//     console.log(1)
//     resolve('a')
//     console.log(2)
// })

// p.then(v => {
//     console.log(v)
//     p.then(v => console.log('p1'))
//     p.then(v => console.log('p2'))
//     process.nextTick(() => console.log('nextTick1'))
//     process.nextTick(() => console.log('nextTick2'))
//     setImmediate(() => console.log('Immediate2'))
// })

// setImmediate(() => console.log('Immediate1'))
// setTimeout(() => console.log('timeout'), 1)

// console.log('script')

// setImmediate(() => {
//     setTimeout(() => {
//       console.log('setTimeout');
//     }, 0);
//     setImmediate(() => {
//       console.log('setImmediate');
//     });
// });

// setImmediate(function (){
//     setImmediate(function A() {
//       console.log(1);
//       setImmediate(function B(){console.log(2);});
//     });
  
//     setTimeout(function timeout() {
//       console.log('TIMEOUT FIRED');
//     }, 0);
// });

Function.prototype._bind = function (context, ...preargs) {
  let fn = this
  const newfn = function(...args) {
      fn.apply(this instanceof newfn ? this : context, preargs.concat(args))
  }
  // function o() {}
  // o.prototype = this.prototype
  // newfn.prototype = new o()
  newfn.prototype = Object.create(this.prototype)

  return newfn
}
Function.prototype.bind2 = function (context) {

  if (typeof this !== "function") {
    throw new Error("Function.prototype.bind - what is trying to be bound is not callable");
  }

  var self = this;
  var args = Array.prototype.slice.call(arguments, 1);

  var fNOP = function () {};

  var fBound = function () {
      var bindArgs = Array.prototype.slice.call(arguments);
      return self.apply(this instanceof fNOP ? this : context, args.concat(bindArgs));
  }

  fNOP.prototype = this.prototype;
  fBound.prototype = new fNOP();
  return fBound;
}

function test() {
  this.a = 1
}
test.prototype.show = function() {
  console.log(this.a)
}
let obj2 = { a: 2 }
let fn = test._bind(obj2)

let t = new fn()
t.show()
console.log(t)