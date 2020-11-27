// 极简的实现+链式调用+延迟机制
class Promise {
    callbacks = [];
    state = 'pending';  //增加状态
    value = null;       //保存结果

    constructor(fn) {
        fn(this._resolve.bind(this));
    }
    then(onFulfilled) {
        return new Promise(resolve => {
            this._handle({
                onFulfilled: onFulfilled || null,
                resolve
            })
        })
    }
    _handle (callback) {
        if (this.state === "pending") {
            this.callbacks.push(callback)
            return
        }
        if (!callback.onFulfilled) {
            callback.resolve(this.value)
            return
        }
        let ret = callback.onFulfilled(this.value)
        callback.resolve(ret)
    }
    _resolve(value) {
        if (value && (typeof value === "object" || typeof value === "function")) {
            if (value.then && typeof value.then === "function") {
                value.then.call(value, this._resolve.bind(this))
                return
            }
        }
        this.state = "fulfilled"
        this.value = value
        this.callbacks.forEach(callback => this._handle(callback))
    }
}

const mockAjax = (url, s, callback) => {
    setTimeout(() => {
        // callback(url + '异步请求耗时' + s + '秒');
        callback(url);
    }, 1000 * s)
}
new Promise(resolve => {
    mockAjax('getUserId', 1, function (result) {
      resolve(result);
    })
})
.then(id => {
    return new Promise(resolve => {
        mockAjax('getUsername?=' + id, 1, function (result) {
            resolve(result);
        })
    })
})
.then(result => {
    console.log(result);
})
// new Promise(resolve => {
//     resolve('1')
//     // mockAjax('getUserId', 1, function (result) {
//     //   resolve(result);
//     // })
// })
// .then(result => {
//     console.log(result);
//     return '123'
// })
// .then(result => {
//     console.log(result);
// })