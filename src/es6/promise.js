class Promise {
    constructor (fn) {
        this.state = "PENDING"
        this.success_data = null
        this.fail_reason = null
        this.onResolvedCallbacks = []
        this.onRejectedCallbacks = []
        let resolve = data => {
            this.state = "FULFILLED"
            this.success_data = data
            this.onResolvedCallbacks.forEach(f => f())
        }
        let reject = reason => {
            this.state = "REJECTED"
            this.fail_reason = reason
            this.onRejectedCallbacks.forEach(f => f())
        }
        try {
            fn(resolve, reject)
        } catch (error) {
            reject(error)
        }
    }
    then (onFullFilled, onRjected) {
        let p
        if (this.state === "PENDING") {
            p = new Promise((resolve, reject) => {
                this.onResolvedCallbacks.push(() => {
                    let d = onFullFilled(this.success_data)
                })
            })
        }
        return p
    }
    catch () {}
}