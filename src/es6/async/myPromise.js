const [ PENDING, FULFILLED, REJECTED ] = [ 'PENDING', 'FULFILLED', 'REJECTED' ]

class myPromise {
  callbacks = []
  state = PENDING
  value = null
  err = null
  constructor (fn) {
    fn(this._resolve.bind(this), this._reject.bind(this))
  }
  _resolve (v = null) {
    // 如果then方法传入的onFullfilled方法返回的是一个promise,
    // 那在处理回调的时候
    if (v && v.then && typeof v.then === "function") {
      let then = v.then
      then.call(v, this._resolve.bind(this))
      return
    }
    this.state = FULFILLED
    this.value = v
    this.callbacks.forEach(callback => this._handle(callback))
  }
  _reject (err) {
    this.state = REJECTED
    this.err = err
    this.callbacks.forEach(callback => this._handle(callback))
  }
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
  then (onFullfilled = null, onRejected = null) {
    return new myPromise((resolve, reject) => this._handle({onFullfilled, onRejected, resolve, reject}))
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

new myPromise((resolve, reject) => {
  mockAjax({ url: 'url-1', success: false }, function (err, data) {
    if (err) reject(err)
    else resolve(data)
  })
})
.then(v => {
  return new myPromise(resolve => {
    mockAjax({ url: 'url-2' }, function (err, data) {
      // if (err) {}
      resolve(`${v} ${data}`)
    })
  })
}, err => {
  console.log(err)
  return 1+err
})
.then(v => console.log(v), err => console.log(err))