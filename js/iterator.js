/**
 * es6遍历器
 * 通过实现Symbol.interator接口, 可实现自定义数据的可遍历
 * 自定的数据结构需要实现next方法, 并且至少返回 { done: true | false } 来标示遍历是否完成
 * 
 */

function test(value) {
  this.index = 0
  this.value = value
}

test.prototype[Symbol.iterator] = function () {
  return {
    next: function() {
      if (this.index < this.value) {
        let v = this.value - this.index
        this.index++
        return {
          done: false,
          value: v
        }
      } else {
        return {
          done: true
        }
      }
    }.bind(this)
  }
}

// test.prototype[Symbol.iterator] = function () {
//   return this
// }

// test.prototype.next = function () {
//   if (this.index < this.value) {
//     let value = this.value - this.index
//     this.index++
//     return {
//       done: false,
//       value
//     }
//   } else {
//     return {
//       done: true
//     }
//   }
// }

let t = new test(10)

let arr = {
  1: 'a',
  2: 'b',
  length: 2
}

// console.log(Array.from(t))

for (let i of t) {
  console.log(i)
}


// 
// function Sets(arr) {
//   this.size = arr.length || 0
//   this[Symbol('values')] = arr
// }
