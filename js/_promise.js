const [ PENDING, FULFILLED, REJECTED ] = [ 'PENDING', 'FULFILLED', 'REJECTED' ]

const isPromise = promise => promise instanceof _Promise
const isFunction = obj => typeof obj === 'function'

class _Promise {
    constructor(fn) {
        this.result = null
        this.state = PENDING
        this.callbacks = []

        const _reject = reason => {
            if (this.state !== PENDING) return
            this.state = REJECTED
            this.result = reason
            setTimeout(() => {
                while(this.callbacks.length > 0) {
                    const { onRejected, resolve, reject } = this.callbacks.shift()
                    try {
                        isFunction(onRejected) ? resolve(onRejected(reason)) : reject(reason)
                    } catch (error) {
                        reject(error)
                    }
                }
            }, 0)
        }
        const _resolve = value => {
            if (this.state !== PENDING) return
            if (this === value) {
                return _reject(new TypeError('Can not fufill promise with itself'))
            }
            if (isPromise(value)) {
                return value.then(_resolve, _reject)
            }
            this.state = FULFILLED
            this.result = value
            setTimeout(() => {
                while(this.callbacks.length > 0) {
                    const { onFulfilled, resolve, reject } = this.callbacks.shift()
                    try {
                        isFunction(onFulfilled) ? resolve(onFulfilled(value)) : resolve(value)
                    } catch (error) {
                        reject(error)
                    }
                }
            }, 0)
        }
        
        try {
            fn(_resolve, _reject)
        } catch (error) {
            _reject(error)
        }
    }
    then(onFulfilled, onRejected) {
        return new _Promise((resolve, reject) => {
            let callback = { onFulfilled, onRejected, resolve, reject }

            if (this.state === PENDING) {
                this.callbacks.push(callback)
            } else {
                setTimeout(() => {
                    try {
                        if (this.state === FULFILLED) {
                            isFunction(onFulfilled) ? resolve(onFulfilled(this.result)) : resolve(this.result)
                        } else if (this.state === REJECTED) {
                            isFunction(onRejected) ? resolve(onRejected(this.result)) : reject(this.result)
                        }
                    } catch (error) {
                        reject(error)
                    }
                }, 0)
            }
        })
    }
    catch(onRejected) {
        return this.then(null, onRejected)
    }
    finally(callback) {
        let P = this.constructor
        return this.then(
            value => P.resolve(callback()).then(() => value),
            reason => P.resolve(callback()).then(() => { throw reason })
        )
    }
}
_Promise.resolve = value => new _Promise((resolve) => resolve(value))
_Promise.reject = reason => new _Promise((_, reject) => reject(reason))
_Promise.all = (promises = []) => {
    return new _Promise((resolve, reject) => {
        let values = new Array(promises.length)
        let count = 0
        promises.forEach((p, i) => {
            _Promise.resolve(p)
            .then(result => {
                values[i] = result
                count++
                if (count === promises.length) resolve(values)
            }, reason => reject(reason))
        })
    })
}
_Promise.race = (promises = []) => {
    return new _Promise((resolve, reject) => {
        promises.forEach((p, i) => {
            _Promise.resolve(p)
            .then(result => resolve(result), reason => reject(reason))
        })
    })
}

module.exports = _Promise