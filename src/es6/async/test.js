new Promise(function (resolve, reject) {
  setTimeout(() => reject('1'), 1000)
})
.then(v => {
  console.log('v:', v)
  return v
}, err => {
  console.error('err:', err)
  return err
})
.then(v => console.log('v1:', v), err => {
  console.error('err1:', err)
  return err
})
.catch(err => console.error(err))