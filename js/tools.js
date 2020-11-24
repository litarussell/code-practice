// 数组去重
const arr = [1, 1, 2, 3, 4, 5, 6, 3, 2]
let s = new Set(arr)
    (function () {
        console.log(arguments)
    })(1, 2, 3, 4)

// 数组扁平化
const flat1 = function (arr) {
    if (!Array.isArray(arr)) throw Error("类型错误!")
    let ans = []
    for (let i = 0; i < arr.length; i++) {
        Array.isArray(arr[i]) ? ans.push(...flat1(arr[i])) : ans.push(arr[i])
    }
    return ans
}

const flat2 = function (arr) {
    return arr.reduce((pre, cur) => {
        return pre.concat(Array.isArray(cur) ? flat2(cur) : cur)
    }, [])
}

// bind
Function.prototype._bind = function (context, ...preargs) {
    let fn = this
    const newfn = function (...args) {
        fn.apply(this instanceof newfn ? this : context, preargs.concat(args))
    }
    newfn.prototype = Object.create(this.prototype)
    return newfn
}
// call
Function.prototype._call = function (context, ...args) {
    if (!context) context = window
    let fn = Symbol('fn')
    context[fn] = this
    let ans = context[fn](...args)
    delete context[fn]
    return ans
}
// apply
Function.prototype._apply = function (context, args) {
    if (!context) context = window
    let fn = Symbol('fn')
    context[fn] = this
    let ans = context[fn](...args)
    delete context[fn]
    return ans
}

// Object.create
Object._create = function (obj) {
    function f() { }
    f.prototype = obj
    return new f()
}
// instanceof
function _instanceof(child, parent) {
    let o = parent.prototype
    let p = child.__proto__
    while (p) {
        if (p == o) return true
        p = p.__proto__
    }
    return false
}
// new
function _new(fn, ...args) {
    let obj = Object.create(fn.prototype)
    let ans = fn.apply(obj, args)
    return typeof ans === 'object' ? ans : obj
}

// 防抖
function debounce(fn, delay) {
    let timer
    return (...args) => {
        clearTimeout(timer)
        timer = setTimeout(() => {
            fn.apply(this, argss)
        }, delay)
    }
}
// 节流
function throttle(fn, delay) {
    let flag = true
    return (...args) => {
        if (!flag) return
        flag = false
        timer = setTimeout(() => {
            fn.apply(this, args)
            flag = true
        }, delay)
    }
}

// 设置cookie
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toGMTString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}
// 获取cookie
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i].trim();
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return "";
}