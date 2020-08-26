const [ PENDING, FULFILLED, REJECTED ] = [ 'PENDING', 'FULFILLED', 'REJECTED' ]
class myPromise {
  constructor (fn) {
    this.state = PENDING
    this.callback = []
    this.value = null
    try {
      fn(this._resolve.bind(this), this._reject.bind(this))
    } catch (error) {
      this._reject(error)
    }
  }
  _resolve(v) {  // 将状态置为FULFILLED
    if (this.state != PENDING) return
    if (v && v.then && typeof v.then === "function") { // 如果resolve的是一个promise 则需要等待promise执行完 得到promise的值
      v.then.call(v, this._resolve.bind(this), this._reject.bind(this))
      return
    }
    // setTimeout(() => {
      this.value = v
      this.state = FULFILLED
      this.callback.length > 0 && this.callback.forEach(fn => fn.onResolve(v))
    // })
  }
  _reject(err) { // 将状态置为REJECTED
    if (this.state != PENDING) return
    this.value = err
    this.state = REJECTED
    this.callback.length > 0 && this.callback.forEach(fn => fn.onReject(err))
  }
  _handle(callback) {
    if (this.state == FULFILLED) {
      const { success, resolve } = callback
      if (typeof success == 'function') {
        resolve(success(this.value))
      } else {
        resolve(this.value)
      }
      return
    }
    if (this.state == REJECTED) {
      const { error, reject } = callback
      if (typeof error == 'function') {
        reject(error(this.value))
      } else {
        reject(this.value)
      }
      return
    }
    this.callback.push(callback)
  }

  // 公共方法
  then(onResolve, onReject) {
    return new myPromise((resolve, reject) => {
      const handle = (callback) => {
        let result = this.value
        if (typeof callback == 'function') {
          result = callback(this.value)
        }
        if (result && result.then & typeof result.then == 'function') {
          result.then(v => resolve(v), err => reject(err))
        } else {
          resolve(result)
        }
      }

      if (this.state == FULFILLED) {
        handle(onResolve)
        return
      }
      if (this.state == REJECTED) {
        onReject(this.value)
        return
      }
      this.callback.push({
        onResolve() { handle(onResolve) },
        onReject() { onReject(this.value) },
      })
    })
  }
  catch(handleReject) {
    return this.then(null, handleReject)
  }
  resolve() {}
  reject() {}
  all() {}
  race() {}
}

// console.log('start')

new myPromise(function (resolve, reject) {
  setTimeout(() => resolve(1), 1000)
  // resolve(1)
  // setTimeout(() => reject(2), 1000)
  // reject(2)
})
.then(v => {
  console.log('v:', v)
  return new myPromise((resolve, reject) => resolve('1' + v))
}, err => {
  console.error('err:', err)
  return err
})
.then(v => console.log('v1:', v), err => {
  console.error('err1:', err)
  return err
})
// .catch(err => console.error('catch', err))

// console.log('end')

// new myPromise((resolve, reject) => resolve(1))
// .then(2)
// .then(3)
// .then(v => console.log(v))