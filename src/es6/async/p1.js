const [ PENDING, FULFILLED, REJECTED ] = [ 'PENDING', 'FULFILLED', 'REJECTED' ]
class myPromise {
  constructor (fn) {
    this.state = PENDING
    this.callbacks = []
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
    this.value = v
    this.state = FULFILLED
    if (this.callbacks.length > 0) {
      setTimeout(() => {
        this.callbacks.forEach(fn => fn.onResolve(v))
      })
    }
  }
  _reject(err) { // 将状态置为REJECTED
    if (this.state != PENDING) return
    this.value = err
    this.state = REJECTED
    this.callbacks.length > 0 && this.callbacks.forEach(fn => fn.onReject())
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
        resolve(onReject(this.value))
        return
      }
      this.callbacks.push({
        onResolve() { handle(onResolve) },
        onReject: () => resolve(onReject(this.value)),
      })
    })
  }
  catch(handleReject) {
    return this.then(null, handleReject)
  }
  resolve(v) {
    return new myPromise((resolve, reject) => {
      if (v && v.then && typeof v.then === "function") {
        v.then(value => resolve(value), reason => reject(reason))
      } else {
        resolve(v)
      }
    })
  }
  reject(reason) {
    return new myPromise((resolve, reject) => reject(reason))
  }
  all(promises) {
    const values = new Array(promises.length)
    let counts = 0
    return new myPromise((resolve, reject) => {
      promises.forEach((p, i) => {
        myPromise.resolve(p).then(value => {
          values[i] = value
          counts++
          if (counts == promises.length) resolve(values)
        }, reason => reject(reason))
      })
    })
  }
  race(promises) {
    return new myPromise((resolve, reject) => {
      promises.forEach((p, i) => {
        myPromise.resolve(p).then(
          value => resolve(value),
          reason => reject(reason)
        )
      })
    })
  }
}

module.exports = myPromise