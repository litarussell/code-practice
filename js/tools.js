// 数组去重
const arr = [1, 1, 2, 3, 4, 5, 6, 3, 2]
let s = new Set(arr)

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

// 生成器函数自动执行
function run(gen, ...args) {
    let it = gen.apply(this, args);
    return Promise.resolve()
        .then(function handleNext(value) {
            let next = it.next(value);
            return (function handleResult(next) {
                if (next.done) {
                    return next.value
                } else {
                    return Promise.resolve(next.value)
                        .then(handleNext, function handleErr(err) {
                            return Promise.resolve(it.throw(err)).then(handleResult);
                        });
                }
            })(next)
        })
}

// 函数柯里化
function curry(fn) {
    if (fn.length < 1) fn
    return function curried(...args) {
        if (args.length < fn.length) {
            return (...more) => {
                return curried.apply(null, args.concat(more))
            }
        } else {
            return () => fn.apply(null, args)
        }
    }
}
const curry1 = function (f) {
    var len = f.length
    return function curried(...args) {
        if (args.length < len) {
            return function (...more) {
                return curried.apply(this, args.concat(more))
            }
        } else {
            return f.apply(this, args)
        }
    }
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
Function.prototype._softBind = function (context, ...preargs) {
    let fn = this
    const newfn = function (...args) {
        fn.apply((!this || this === (window || global)) ? context : this, preargs.concat(args))
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

// Object.is
Object._is = function (x, y) {
    if (x === y) {
        // +0 != -0
        // 1 / (+0) = Infinity
        // 1 / (-0) = -Infinity
        return x !== 0 || 1 / x === 1 / y;
    } else {
        // NaN == NaN
        return x !== x && y !== y;
    }
};

// object.setPrototypeOf
Object._setPrototypeOf = function (a, b) {
    a.__proto__ = b
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
        if (p === o) return true
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
            fn.apply(this, args)
        }, delay)
    }
}

// [立即]执行
function debounce1(fn, delay, immediate = false) {
    let timer
    if (immediate) {
        let flag = true
        return (...args) => {
            if (immediate && flag) {
                fn.apply(this, args)
                flag = false
            }
            clearTimeout(timer)
            timer = setTimeout(() => {
                flag = true
            }, delay)
        }
    } else {
        return (...args) => {
            clearTimeout(timer)
            timer = setTimeout(() => {
                fn.apply(this, args)
            }, delay)
        }
    }

}

// 节流
function throttle(fn, delay) {
    let flag = true
    return (...args) => {
        if (!flag) return
        flag = false
        setTimeout(() => {
            fn.apply(this, args)
            flag = true
        }, delay)
    }
}
// [立即]执行
function throttle1(fn, delay, immediate = false) {
    let flag = true
    if (immediate) {
        return (...args) => {
            if (!flag) return
            fn.apply(this, args)
            flag = false
            setTimeout(() => {
                flag = true
            }, delay)
        }
    } else {
        return (...args) => {
            if (!flag) return
            flag = false
            timer = setTimeout(() => {
                fn.apply(this, args)
                flag = true
            }, delay)
        }
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

function getType(obj) {
    switch (Object.prototype.toString.call(obj)) {
        case '[object Object]':
            return 'object'
        case '[object Array]':
            return 'array'
        case '[object Date]':
            return 'date'
    }
}

function deepClone(obj, map = new WeakMap()) {
    if (map.has(obj)) {
        return map.get(obj)
    }
    let o = null, flag
    // child = new RegExp(parent.source, getRegExp(parent));
    // if (parent.lastIndex) child.lastIndex = parent.lastIndex;
    // 对正则对象做特殊处理
    switch (flag = getType(obj)) {
        case 'array':
        case 'object':
            o = flag === 'array' ? [] : {}
            map.set(obj, o)
            for (let k in obj) {
                if (obj.hasOwnProperty(k))
                    o[k] = deepClone(obj[k], map)
            }
            break
        case 'date':
            o = new Date(obj.getTime())
            map.set(obj, o)
            break
        default:
            o = obj
    }
    return o
}

let obj = {
    'a': 1,
    'b': [1, [2]],
    'c': function () { console.log('--') },
    'd': /hello/g,
    'e': new Date(),
    'f': { name: 'test' },
    'g': {}
}
obj.g.h = obj.f
let o = deepClone(obj)
console.log(o)
