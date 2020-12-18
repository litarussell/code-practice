// sort map forEach reduce reserve 

Array.prototype._reduce = function(fn, pre) {
    let i = 0
    if (pre) {
        i = 1
    }
    for (; i < this.length; i++) {
        let item = this[i]
        pre = fn(pre, item)
    }
    return pre
}

Promise.allSettle = function(promises) {
    let len = promises.length
    let ans = new Array(len)
    let count = 0
    function handle(i, v, resolve) {
        count++
        ans[i] = v
        if (count === len) resolve(ans)
    }
    return new Promise((resolve, reject) => {
        for (let i = 0; i < len; i++) {
            let p = promises[i]
            Promise.resolve(p)
            .then(
                value => handle(i, value, resolve),
                reason => handle(i, reason, resolve)
            )
        }
    })
}

