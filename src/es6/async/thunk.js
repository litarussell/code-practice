// const thunkify = require('thunkify')
var assert = require('assert')

function thunkify(fn){
  assert('function' == typeof fn, 'function required');

  return function(){
    var args = new Array(arguments.length);
    var ctx = this;

    for(var i = 0; i < args.length; ++i) {
      args[i] = arguments[i];
    }

    return function(done){
      var called;

      args.push(function(){
        if (called) return;
        called = true;
        done.apply(null, arguments);
      });

      try {
        fn.apply(ctx, args);
      } catch (err) {
        done(err);
      }
    }
  }
}

function thunkify_1 (fn) {
  return function () {
    let args = Array.prototype.slice.call(arguments)
    return function (callback) {
      args.push(callback)
      return fn.apply(this, args)
    }
  }
}


function test(a, callback) {
    callback(a)
}

let fn = thunkify(test)

// fn([1,2,3,4,5])(console.log)

run(function* () {
  let r1 = yield fn(1)
  let r2 = yield fn(2)
  console.log('--->', r1, r2)
})

function run(fun) {
  var gen = fun();

  function next(data) {          // next函数作为thunk函数的callback函数运行的
    var result = gen.next(data); // 这儿的data其实就是thunk函数的参数 两次执行的就是1  2, 犹豫next函数的性质, 这次generator函数执行的结果就是{ done: false, value: data }
    if (result.done) return;
    
    result.value(next); // 所以thunk自动执行generator函数 yield后边的执行结果必须是一个函数
  }

  next();
}
