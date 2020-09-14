let obj = new Proxy({}, { // 代理一个空对象的访问
  get(target, propKey, receiver) {
    console.log('get', target, propKey, receiver)
    return target[propKey]
  },
  set(target, propKey, value, receiver) {
    console.log('set', target, propKey, value, receiver)
    target[propKey] = value
  }
})

obj.a = 1
obj.a
obj.b = 2