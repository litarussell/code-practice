// 二维平面矩阵运算
(function (m3) {
   let hasDefine = typeof define === 'function',
    hasExports = typeof module !== 'undefined' && module.exports,
    root = (typeof self == 'object' && self.self === self && self) ||
    (typeof global == 'object' && global.global === global && global)
  if (hasDefine) {
    define(m3);
  } else if (hasExports) {
    module.exports = m3(root)
  } else {
    m3(root)
  }
})(function (root) {
  function multiply (w, x) {

  }
  // 平移
  function translation (tx, ty) {
    return [
      1, 0, tx,
      0, 1, ty,
      0, 0, 1
    ]
  }
  // 旋转
  function ratation (angleInRadians) {
    let c = Math.cos(angleInRadians)
    let s = Math.sin(angleInRadians)
    return [
      c, -s, 0,
      s, c, 0,
      0, 0, 1
    ]
  }
  // 缩放
  function scale (sx, sy) {
    return [
      sx, 0, 0,
      0, sy, 0,
      0, 0, 1
    ]
  }
})
