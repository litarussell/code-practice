const fs = require('fs')
const koa = require('koa')
const promiseify = require('promise.ify')

let readFile = promiseify(fs.readFile)

exports.testKoa = function () {
  const app = new koa()
  app.use(async (ctx, next) => {
    const start = new Date().getTime()
    await next()
    const ms = new Date().getTime() - start
    console.log(`${ctx.request.method} ${ctx.request.url}: ${ms}ms`)
    ctx.response.set('X-Response-Time', `${ms}ms`)
  })
  app.use(async (ctx, next) => {
    let name = ctx.request.query.name || 'world'
    ctx.response.type = 'text/html'
    ctx.response.body = `<h1>Hello, ${name}!</h1>`
  })
  return app
}

exports.sum = function (...rest) {
  let sum = 0
  for (let n of rest) {
    sum += n
  }
  return sum
}

exports.awaitFunc = async function () {
  let expression = await readFile('./test/src/data.txt')
  let fn = new Function('return ' + expression)
  let r = fn()
  return r
}
