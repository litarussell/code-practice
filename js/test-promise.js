const myPromise = require('./promise.js')
const p1 = require('./promise-polyfill-1.js')
const p2 = require('./_promise.js')
const p3 = require('es6-promise').Promise

function mockAjax({
    url,
    success = true,
    delay = 1000
}, callback) {
    setTimeout(function () {
        if (success) {
            callback(null, `data: ${url}`)
        } else {
            callback(`请求失败: ${url}`)
        }
    }, delay)
}

// test(Promise)
// test(p2)
// test1(Promise)
// test1(p2)
// test2(Promise)
// test2(p2)
// test3(Promise)
// test3(p2)
// test4(Promise)
// test4(p2)
test4(p3)

// test5()
// test6()
// test7()

function test(instance) {
    console.log('start')
    new instance((resolve, reject) => {
            // setTimeout(() => reject('1'), 1000)
            resolve(1)
            // reject('1')
            // console.log('promise1-1')
            // mockAjax({
            //   url: 'url-1',
            //   success: true
            // }, function (err, data) {
            //     if (err) reject(err)
            //     else resolve(data)
            // })
            // console.log('promise1-2')
        })
        .then(v => {
            console.log('v:', v)
            return new instance((resolve, reject) => {
                mockAjax({
                    url: 'url-2'
                }, function (err, data) {
                    if (err) reject(err)
                    else resolve(v + '^^' + data)
                })
            })
        }, err => {
            console.error('err:', err)
            return err
        })
        .then(v => {
            console.log('v1:', v)
            return v + 1
        }, err => {
            console.error('err1:', err)
            return err
        })
        // .catch(err => console.error('catch:', err))
    console.log('end')
}

function test1(instance) {
    console.log('start');
    new instance((resolve, reject) => {
            setTimeout(function () {
                console.log('step');
                resolve(110);
            }, 1000)
        })
        .then((value) => {
            return new instance((resolve, reject) => {
                    setTimeout(function () {
                        console.log('step1');
                        resolve(value);
                    }, 1000)
                })
                .then((value) => {
                    console.log('step 1-1');
                    return value;
                })
                .then((value) => {
                    console.log('step 1-2');
                    return value;
                })
        })
        .then((value) => {
            console.log(value);
            console.log('step 2');
        })
    console.log('end');
}

function test2(instance) {
    new instance(function (resolve, reject) {
            reject('1')
        })
        .then(v => console.log('v1:', v), err => {
            console.log('err1:', err)
            // return err
        })
        .then(v => console.log('v2:', v), err => console.log('err2', err))
        // .catch(err => console.log('catch', err))
}

function test3(instance) {
    new instance(function (resolve, reject) {
            reject('1')
            // resolve('1')
        })
        .then(2, 3)
        .then(v => console.log('v2:', v), err => console.log('err2', err))
        .catch(err => console.log('catch', err))
}

function test4(instance) {
    console.log('start')
    setTimeout(() => console.log('st'))
    new instance(function (resolve, reject) {
            resolve('1')
        })
        .then(v => {
            console.log('v2:', v)
            return 2
            // return new instance((resolve, reject) => {
            //   setTimeout(() => resolve(2), 2000)
            // })
        })
        .then(v => console.log('v3:', v), err => console.log('err3', err))
    console.log('end')
}

function test5() {
    function promise1() {
        let p = new Promise((resolve) => {
            console.log('promise1');
            resolve('1')
        })
        return p;
    }

    function promise2() {
        return new Promise((resolve, reject) => {
            reject('error')
            // resolve(1)
        })
    }
    promise1()
        .then(res => console.log('p1-1:', res))
        .then(() => console.log('p1-2'))
        .catch(err => console.log('p1-err', err))
        .then(() => console.log('finally1'))

    promise2()
        .then(res => console.log('p2-1:', res))
        .then(() => console.log('p2-2'))
        .catch(err => console.log('p2-err', err))
        .then(() => console.log('finally2'))
}

function test6() {
    const p1 = new Promise((resolve) => {
        setTimeout(() => {
            resolve('resolve3');
            console.log('timer1')
        }, 0)
        resolve('resovle1');
        resolve('resolve2');
    }).then(res => {
        console.log(res)
        setTimeout(() => {
            console.log('1', p1)
        }, 1000)
    }).finally(res => {
        console.log('finally', res)
        console.log('3', p1)
    })
    console.log('2', p1)
}

function test7() {
    const p1 = new Promise((resolve, reject) => {
        reject('error');
    }).then(() => {}, err => {
        console.log('then:', err)
        throw Error('error1')
    }).catch(err => {
        console.log('catch:', err)
    })
}