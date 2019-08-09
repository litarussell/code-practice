/**
 * promise限流 map
 */

class Queue {
  constructor (n) {
    this.limit = n
    this.count = 0
    this.queue = []
  }
  enqueue (fn) {
    return new Promise((resolve, reject) => {
      this.queue.push({ fn, resolve, reject })
    })
  }
  dequeue () {
    if (this.count < this.limit && this.queue.length) {
      const { fn, resolve, reject } = this.queue.shift()
      this.run(fn).then(resolve).catch(reject)
    }
  }
  async run(fn) {
    this.count++
    const value = await fn()
    console.log('debug-1')
    this.count--
    this.dequeue()
    return value
  }
  build (fn) {
    // console.log('>>>>>>>', this.count)
    if (this.count < this.limit) return this.run(fn) // 并行promise未超过指定个数
    else return this.enqueue(fn)  // 超过限制的promise入队
  }
}

Promise.map = function(list, fn, { limit }) {
  const queue = new Queue(limit)
  return Promise.all(list.map((...args) => queue.build(() => fn(...args))))
}

const list = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

function get (i) {
  console.log('In ', i)
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(i * 1000) 
      console.log('Out', i, 'Out')
    }, i * 1000)
  })
}

// Promise.all(list.map(item => get(item)))
// Promise.map(list, get, { limit: 2 })