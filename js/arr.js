function flatArr(arr) {
    let ans = []
    for (let i = 0; i < arr.length; i++) {
        let item = arr[i]
        if (Array.isArray(item)) {
            ans.push(...flatArr(item))
        } else {
            ans.push(item)
        }
    }
    return ans
}

function LazyManClass(fn = null) {
    this.callback = []
    
}
LazyManClass.prototype.sleep = function(s) {
    return new LazyManClass((resolve) => {
        setTimeout(() => console.log(`Wake up after ${s}`), s)
    })
}
LazyManClass.prototype.eat = function(type) {
    console.log(`Eat ${type}~`)
    return new LazyManClass((resolve) => {
        
    })
}
function LazyMan(name) {
    console.log(`Hi! This is ${name}!`)
    return new LazyManClass()
}