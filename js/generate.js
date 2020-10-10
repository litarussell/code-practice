function run(gen) {
  let args = [].slice.call(arguments, 1);
  let it = gen.apply(this, args);
  return Promise.resolve()
    .then(function handleNext(value) {
      let next = it.next(value);
      return (function handleResult(next) {
        if (next.done) {
          return next.value
        } else {
          return Promise.resolve(next.value)
            .then(handleNext, function handleErr(err) {
              return Promise.resolve(it.throw(err)).then(handleResult);
            });
        }
      })(next)
    })
}
function* foo(x) {
  console.log(x)
  let y = x + (yield 'hello')
  console.log(y)
  return y
}
run(foo, 'a')

// let it = foo(6)
// let re = it.next()
// console.log(re)
// re = it.next(7)
// console.log(re)
// re = it.next()
// console.log(re)

