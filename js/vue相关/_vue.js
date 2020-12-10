const { set } = require("vue/types/umd")

class _Vue {
    constructor(options) {
        this.options = options
        this.initData(options)
        let el = this.options.id
        this.$mount(el)
    }
    initData(options) {
        if (!options.data) return
        this.data = options.data
        new Observe(options.data)
    }
    
    $mount(el) {
        const updateView = _ => {
            let $el = document.querySelector(el)
            let innerHtml = $el.innerHtml
            let key = innerHtml.match(/{\w+}/)[1]
            $el.innerHtml = this.options.data[key]
        }
        // 创建一个render依赖
        new Watcher(updateView, true)
    }
}

const defineReactive = function(data, key) {
    const dep = new Dep()
    const property = Object.getOwnPropertyDescriptor(data)
    let val = data[key]
    if(property && property.configurable === false) return
    Object.defineProperty(data, key, {
        configurable: true,
        enumerable: true,
        get() {
            // 依赖收集
            if (Dep.target) {
                dep.depend()
            }
            return val
        },
        set(nval) {
            if (nval === val) return
            val = nval
            // 派发更新
            dep.notify()
        }
    })
}

// Observe类, 用于将数据变成响应式对象
class Observe {
    constructor(data) {
        this.walk(data)
    }
    // 对每个属性设置getter setter方法
    walk(data) {
        const keys = Object.keys(data)
        for (let i = 0; i < keys.length; i++) {
            defineReactive(data, keys[i])
        }
    }
}

// Watcher类, 一个watcher实例就是一个依赖
// 实例化一个watcher实例时, 将Dep.target设置为当前的watcher
class Watcher {
    constructor(expOrFn, isRenderWatcher) {
        this.getter = expOrFn;
        this.get();
    }
    // get方法用于状态更新
    get() {
        Dep.target = this
        this.getter()
        Dep.target = null
    }
    update() {
        this.get()
    }
}

// Dep类, 用于依赖的管理
let uid = 0
class Dep {
    constructor() {
        this.id = uid++
        this.subs = []
    }
    // 依赖收集
    depend() {
        if (Dep.target) {
            this.subs.push(Dep.target)
        }
    }
    // 派发更新
    notify() {
        const subs = this.subs.slice()
        for (let i = 0, l = subs.length; i < l; i++) {
            // 遍历dep中的依赖, 对每个依赖执行更新操作
            subs[i].update()
        }
    }
}

Dep.target = null   // target为当前正在执行的watcher
