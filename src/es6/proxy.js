/**
 * 简单来说就是在访问设置对象之前, 设置了一层拦截器, 可以做一些额外的操作
 */

let target = {}
let handler = {}

let proxy = new Proxy(target, handler)

proxy.a = 'b'

console.log(target.a)
