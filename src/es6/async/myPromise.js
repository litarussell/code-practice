const [ PENDING, FULFILLED, REJECTED ] = [ 'PENDING', 'FULFILLED', 'REJECTED' ]

class myPromise {
  constructor (fn) {
    this.callbacks = []
    this.state = PENDING
    this.value = null
    this.err = null
    try {
      fn(this._resolve.bind(this), this._reject.bind(this))
    } catch (error) {
      this._reject(error)
    }
  }
  then (onFullfilled = null, onRejected = null) {
    return new myPromise((resolve, reject) => this._handle({
      onFullfilled, onRejected, resolve, reject
    }))
  }
  catch (onError) {
    return this.then(null, onError)
  }
  finally (onDone) {}

  _handle (callback) {
    if (this.state === FULFILLED) {
      const { onFullfilled, resolve } = callback
      if (typeof onFullfilled === "function") {
        resolve(onFullfilled(this.value))
      } else {
        resolve(this.value)
      }
      return
    }
    if (this.state === REJECTED) {
      const { onRejected, reject } = callback
      if (typeof onRejected === "function") {
        reject(onRejected(this.err))
      } else {
        reject(this.err)
      }
      return
    }
    this.callbacks.push(callback)
  }
  _resolve (v = null) {
    // 如果then方法传入的onFullfilled方法返回的是一个promise,
    // 那在处理回调的时候
    if (v && v.then && typeof v.then === "function") {
      let then = v.then
      then.call(v, this._resolve.bind(this), this._reject.bind(this))
      return
    }
    setTimeout(() => {
      this.state = FULFILLED
      this.value = v
      this.callbacks.forEach(callback => this._handle(callback))
    })
  }
  _reject (err) {
    this.state = REJECTED
    this.err = err
    this.callbacks.forEach(callback => this._handle(callback))
  }
}

function mockAjax({ url, success = true, delay = 1000 }, callback) {
  setTimeout(function () {
    if (success) {
      let data = `data: ${url}`
      callback(null, data)
    } else {
      callback('error', null)
    }
  }, delay)
}

// new myPromise((resolve, reject) => {
//   mockAjax({ url: 'url-1', success: true }, function (err, data) {
//     if (err) reject(err)
//     else resolve(data)
//   })
// })
// .then(v => {
//   return new myPromise(resolve => {
//     mockAjax({ url: 'url-2' }, function (err, data) {
//       // if (err) {}
//       resolve(`${v} ${data}`)
//     })
//   })
// }, err => {
//   console.log(err)
//   return 1+err
// })
// .then(v => console.log(v), err => console.log(err))

// console.log('start')
// new myPromise((resolve, reject) => {
//   console.log('1')
//   resolve('1')
//   // reject('error')
// })
// .then(v => {
//   console.log('2')
//   return new myPromise(resolve => resolve(v + '2'))
// })
// .then(v => console.log('3-->', v), err => console.log(err))
// .catch(err => console.log('err--->', err))
// .catch(err => console.log('err2--->', err))

// console.log('end')

console.log('start')
new Promise((resolve, reject) => {
  console.log('1')
  resolve('1')
  // reject('error')
})
.then(v => {
  console.log('2')
  return v + '2'
  // return new Promise(resolve => resolve(v + '2'))
})
.then(v => console.log('33-->', v), err => console.log('3-err-->', err))
.catch(err => console.log('err--->', err))
.catch(err => console.log('err2--->', err))

console.log('end')