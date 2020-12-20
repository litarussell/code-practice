function flat(arr, num = Infinity) {
    if (num < 1) return arr
    let ans = []
    for (let i = 0; i < arr.length; i++) {
        let item = arr[i]
        if (Array.isArray(item) && num > 0) {
            ans.push(...flat(item, num-1))
        } else {
            ans.push(item)
        }
    }
    return ans
}

let ans = flat([1,2,3,[1, [2,3]], , ,])

console.log(ans)