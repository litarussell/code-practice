const myPromise = require('./p1.js')

function mockAjax({ url, success = true, delay = 1000 }, callback) {
  setTimeout(function () {
    if (success) {
      callback(null, `data: ${url}`)
    } else {
      callback(`请求失败: ${url}`)
    }
  }, delay)
}

// test(Promise)
// test(myPromise)
// test1(Promise)
test1(myPromise)

function test(instance) {
  console.log('start')
  new instance((resolve, reject) => {
    // setTimeout(() => reject('1'), 1000)
    // resolve(1)
    // reject('1')
    console.log('promise1-1')
    mockAjax({
      url: 'url-1',
      success: true
    }, function (err, data) {
        if (err) reject(err)
        else resolve(data)
    })
    console.log('promise1-2')
  })
  .then(v => {
    console.log('v:', v)
    return new instance((resolve, reject) => {
      mockAjax({url: 'url-2'}, function (err, data) {
        if (err) reject(err)
        else resolve(v + '^^' +data)
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
  .catch(err => console.error('catch:', err))
  console.log('end')
}

function test1(instance) {
  console.log('start');
  new instance((resolve,reject)=>{
    setTimeout(function(){
        console.log('step');
        resolve(110);
    },1000)
  })
  .then((value)=>{
    return new instance((resolve,reject)=>{
      setTimeout(function(){
        console.log('step1');
        resolve(value);
      },1000)
    })
    .then((value)=>{
      console.log('step 1-1');
      return value;
    })
    .then((value)=>{
      console.log('step 1-2');
      return value;
    })
  })
  .then((value)=>{
    console.log(value);
    console.log('step 2');
  })
  console.log('end');
}