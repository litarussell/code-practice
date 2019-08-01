// 生成一个随机整数，范围是 [min, max]
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// 生成一个随机的十六进制的值，在 0 ～ f 之间 
function getHex() {
  let n = 0;
  for (let i = 4; i > 0; i--) {
    n = (getRandomInt(0, 1) << (i - 1)) + n;
  }
  return n.toString(16);
}

// 生成一个32位的十六进制值，用作一次性 Key
function getOTP() {
  const arr = [];
  for (let i = 0; i < 32; i++) {
    arr.push(getHex());
  }
  return arr.join('');
}
function getXOR(message, key) {
  const arr = [];
  for (let i = 0; i < 32; i++) {
    const  m = parseInt(message.substr(i, 1), 16);
    const k = parseInt(key.substr(i, 1), 16);
    arr.push((m ^ k).toString(16));
  }
  return arr.join('');
}