function* foo(x) {
  let y = x * (yield 'hello')
  let c = yield y
  return c
}

let it = foo(6)
let re = it.next()
console.log(re)
re = it.next(7)
console.log(re)
re = it.next()
console.log(re)