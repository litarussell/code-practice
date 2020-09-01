const myPromise = require('./p1.js')

function test(instance) {
  new instance((resolve, reject) => {
    setTimeout(() => reject('1'), 1000)
    // resolve(1)
    // reject('1')
  })
  .then(v => {
    console.log('v:', v)
    return v + 1
  }, err => {
    console.error('err:', err)
    return err
  })
  .then(v => {
    console.log('v1:', v)
    return v + 1
  }, err => {
    console.error('err1:', err)
    return err
  })
  .catch(err => console.error('catch:', err))
}

// test(Promise)
// console.log('--')
test(myPromise)
