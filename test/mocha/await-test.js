const assert = require('assert')

const { awaitFunc: test } = require('../src/app')

describe('#await.test.js', () => {
  describe('#awaitFunc()', () => {

    it('#async with done', (done) => {
      (async function () {
        try {
          let r = await test()
          assert.strictEqual(r, 15)
          done()
        } catch (err) {
          done(err)
        }
      })()
    })

    it('#async function', async () => {
      let r = await test()
      assert.strictEqual(r, 15)
    })

    it('#sync function', () => {
      assert(true)
    })

  })
})
