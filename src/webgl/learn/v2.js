// ------------------------------ 初始化代码 ------------------------------
let canvas = document.getElementById('canvas')
const gl = canvas.getContext('webgl')

console.log(gl.canvas.width, gl.canvas.height)

var m3 = {
  projection: function (width, height) {
    // 这个矩阵翻转了 Y 轴
    return [
      2 / width, 0, 0,
      0, -2 / height, 0,
      -1, 1, 1
    ];
  },

  identity: function () {
    return [
      1, 0, 0,
      0, 1, 0,
      0, 0, 1,
    ];
  },

  translation: function (tx, ty) {
    return [
      1, 0, 0,
      0, 1, 0,
      tx, ty, 1,
    ];
  },

  rotation: function (angleInRadians) {
    var c = Math.cos(angleInRadians);
    var s = Math.sin(angleInRadians);
    return [
      c, -s, 0,
      s, c, 0,
      0, 0, 1,
    ]
  },

  scaling: function (sx, sy) {
    return [
      sx, 0, 0,
      0, sy, 0,
      0, 0, 1,
    ];
  },

  multiply: function (a, b) {
    var a00 = a[0 * 3 + 0];
    var a01 = a[0 * 3 + 1];
    var a02 = a[0 * 3 + 2];
    var a10 = a[1 * 3 + 0];
    var a11 = a[1 * 3 + 1];
    var a12 = a[1 * 3 + 2];
    var a20 = a[2 * 3 + 0];
    var a21 = a[2 * 3 + 1];
    var a22 = a[2 * 3 + 2];
    var b00 = b[0 * 3 + 0];
    var b01 = b[0 * 3 + 1];
    var b02 = b[0 * 3 + 2];
    var b10 = b[1 * 3 + 0];
    var b11 = b[1 * 3 + 1];
    var b12 = b[1 * 3 + 2];
    var b20 = b[2 * 3 + 0];
    var b21 = b[2 * 3 + 1];
    var b22 = b[2 * 3 + 2];
    return [
      b00 * a00 + b01 * a10 + b02 * a20,
      b00 * a01 + b01 * a11 + b02 * a21,
      b00 * a02 + b01 * a12 + b02 * a22,
      b10 * a00 + b11 * a10 + b12 * a20,
      b10 * a01 + b11 * a11 + b12 * a21,
      b10 * a02 + b11 * a12 + b12 * a22,
      b20 * a00 + b21 * a10 + b22 * a20,
      b20 * a01 + b21 * a11 + b22 * a21,
      b20 * a02 + b21 * a12 + b22 * a22,
    ];
  },

  translate: function (m, tx, ty) {
    return m3.multiply(m, m3.translation(tx, ty));
  },

  rotate: function (m, angleInRadians) {
    return m3.multiply(m, m3.rotation(angleInRadians));
  },

  scale: function (m, sx, sy) {
    return m3.multiply(m, m3.scaling(sx, sy));
  },
}

if (gl) {
  let vertex_shader_code = `
    // 一个属性变量, 从缓冲中获取数据
    attribute vec2 a_position;
    uniform mat3 u_matrix;

    void main() {
      gl_Position = vec4((u_matrix * vec3(a_position, 1)).xy, 0, 1);
    }
  `
  let fragment_shader_code = `
    precision mediump float;
    void main() {
      gl_FragColor = vec4(1, 0, 0.5, 1); // 紫色
    }
  `

  let vertexShader = createShader(gl, gl.VERTEX_SHADER, vertex_shader_code)
  let fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragment_shader_code)
  let program = createProgram(gl, vertexShader, fragmentShader) // 将一对着色器链接到一个着色程序中

  // 从着色程序中寻找属性位置
  let positionAttributeLocation = gl.getAttribLocation(program, "a_position")

  var matrixLocation = gl.getUniformLocation(program, "u_matrix")

  // 着色程序的属性值是从缓冲中获取的, 首先需要创建缓冲
  let positionBuffer = gl.createBuffer()
  // 将positionBuffer缓冲绑定到ARRAY_BUFFER上, ARRAY_BUFFER就是一个绑定点, webgl可通过绑定点引用其指向的数据源
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)

  let positions = [
    80, 80,
    80, 0,
    40, 80,

    200, 10,
    200, 100,
    100, 100
  ]

  // 通过ARRAY_BUFFER绑定点向缓冲中存放数据positions, gl.bufferData()方法会复制这些数据到GPU的positionBuffer对象上, 因为绑定点指向该缓冲
  // STATIC_DRAW提示webgl不会经常改变这些数据
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)

  function createShader(gl, type, source) {
    let shader = gl.createShader(type)
    gl.shaderSource(shader, source) // 数据源
    gl.compileShader(shader) // 编译生成着色器
    let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS)
    if (success) return shader

    console.log(gl.getShaderInfoLog(shader))
    gl.deleteShader(shader)
  }

  function createProgram(gl, vertexShader, fragmentShader) {
    let program = gl.createProgram()
    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    gl.linkProgram(program)
    let success = gl.getProgramParameter(program, gl.LINK_STATUS)
    if (success) return program

    console.log(gl.getProgramInfoLog(program))
    gl.deleteProgram(program)
  }

  // ------------------------------ 渲染代码 ------------------------------
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
  gl.clearColor(0, 0, 0, 0)
  gl.clear(gl.COLOR_BUFFER_BIT)

  gl.useProgram(program) // 运行的着色程序

  gl.enableVertexAttribArray(positionAttributeLocation) // 启用对应的属性 "a_position"
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer) // 绑定到缓冲

  // 告诉属性怎么从positionBuffer中读取数据
  var size = 2 // 每次迭代运行提取两个单位数据
  var type = gl.FLOAT // 每个单位的数据类型是32位浮点型
  var normalize = false // 不需要归一化数据
  var stride = 0 // 0 = 移动单位数量 * 每个单位占用内存（sizeof(type)）
  // 每次迭代运行运动多少内存到下一个数据开始点
  var offset = 0 // 从缓冲起始位置开始读取

  // 将属性绑定到缓冲中, 也就是positionBuffer中; 也就是按照规则读取缓冲中的数据到对应的属性中
  gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset)

  let primitiveType = gl.TRIANGLES // 图元类型 三角形
  let count = 6 // 顶点着色器运行3次

  let translation = [0, 0] // 平移
  let scale = [1, 1] // 缩放
  let angleInRadians = 0 // 角度

  draw()

  function change(v, flag) {
    switch (flag) {
      case 'x':
        translation[0] = v
        break
      case 'y':
        translation[1] = v
        break
      case 'r':
        angleInRadians = v * Math.PI / 180 // 弧度
        break
      case 's':
        scale[0] = (v + 1) / 10
        scale[1] = (v + 1) / 10
        break
    }
    // console.log(translation, rotation, scale)
    draw()
  }

  function draw() {
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
    gl.clear(gl.COLOR_BUFFER_BIT)

    let matrix = m3.projection(gl.canvas.clientWidth, gl.canvas.clientHeight)
    matrix = m3.translate(matrix, translation[0], translation[1])
    matrix = m3.rotate(matrix, angleInRadians)
    matrix = m3.scale(matrix, scale[0], scale[1])

    gl.uniformMatrix3fv(matrixLocation, false, matrix)

    gl.drawArrays(primitiveType, 0, count)
  }
}
