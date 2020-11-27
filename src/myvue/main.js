var vm = new MyVue({
  id: '#app',
  data: {
    test: 12
  }
})
// myVue.js
(function(global) {
    class MyVue {
        constructor(options) {
            this.options = options;
            // 数据的初始化
            this.initData(options);
            let el = this.options.id;
            // 实例的挂载
            this.$mount(el);
        }
        initData(options) {
            if(!options.data) return;
            this.data = options.data;
            // 将数据重置getter，setter方法
            new Observer(options.data);
        }
        $mount(el) {
            // 直接改写innerHTML
            const updateView = _ => {
            let innerHtml = document.querySelector(el).innerHTML;
            let key = innerHtml.match(/{(\w+)}/)[1];
            document.querySelector(el).innerHTML = this.options.data[key]
            }
            // 创建一个渲染的依赖。
            new Watcher(updateView, true)
        }
    }
}(window))

const defineReactive = (obj, key) => {
    const dep = new Dep();
    const property = Object.getOwnPropertyDescriptor(obj);
    let val = obj[key]
    if(property && property.configurable === false) return;
    Object.defineProperty(obj, key, {
      configurable: true,
      enumerable: true,
      get() {
        // 做依赖的收集
        if(Dep.target) {
          dep.depend()
        }
        return val
      },
      set(nval) {
        if(nval === val) return
        // 派发更新
        val = nval
        dep.notify();
      }
    })
}

// Observer类的定义
class Observer {
    constructor(data) {
      // 实例化时执行walk方法对每个数据属性重写getter，setter方法
      this.walk(data)
    }
  
    walk(obj) {
      const keys = Object.keys(obj);
      for(let i = 0;i< keys.length; i++) {
        // Object.defineProperty的处理逻辑
        defineReactive(obj, keys[i])
      }
    }
}

// 监听的依赖
class Watcher {
    constructor(expOrFn, isRenderWatcher) {
      this.getter = expOrFn;
      // Watcher.prototype.get的调用会进行状态的更新。
      this.get();
    }
  
    get() {
      // 当前执行的watcher
      Dep.target = this
      this.getter()
      Dep.target = null;
    }
    update() {
      this.get()
    }
}
  

let uid = 0;
class Dep {
  constructor() {
    this.id = uid++;
    this.subs = []
  }
  // 依赖收集
  depend() {
    if(Dep.target) {
      // Dep.target是当前的watcher,将当前的依赖推到subs中
      this.subs.push(Dep.target)
    }
  }
  // 派发更新
  notify() {
    const subs = this.subs.slice();
    for (var i = 0, l = subs.length; i < l; i++) { 
      // 遍历dep中的依赖，对每个依赖执行更新操作
      subs[i].update();
    }
  }
}

Dep.target = null;
  