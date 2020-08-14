// ------------------------------ 初始化代码 ------------------------------
let canvas = document.getElementById('canvas')
const gl = canvas.getContext('webgl')

if (gl) {
  let vertex_shader_code = `
    // 一个属性变量, 从缓冲中获取数据
    attribute vec2 a_position;
    uniform mat3 u_matrix;

    void main() {
      gl_Position = vec4(( vec3(a_position, 1) * u_matrix ).xy, 0, 1);
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
    0, 0,
    100, 0,
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
  let count = 3 // 顶点着色器运行3次

  let translation = [200, 200] // 平移
  let scale = [0, 0] // 缩放
  let angleInRadians = 30 // 角度

  draw()

  function change(v, flag) {
    switch (flag) {
      case 'x':
        translation[0] = +v
        break
      case 'y':
        translation[1] = +v
        break
      case 'r':
        angleInRadians = v * Math.PI / 180 // 弧度
        break
      case 's':
        scale[0] = (v + 1) / 10
        scale[1] = (v + 1) / 10
        break
    }
    // console.log(translation, angleInRadians, scale)
    draw()
  }

  function draw() {
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
    gl.clear(gl.COLOR_BUFFER_BIT)

    let w = gl.canvas.clientWidth, h = gl.canvas.clientHeight
    matrix = nj.array([
      [1/w, 0,   0],
      [0,   1/h, 0],
      [0,   0,   1]
    ]) // 缩放1 / 分辨率
    matrix = nj.dot(nj.array([
      [2, 0, 0],
      [0, 2, 0],
      [0, 0, 1]
    ]), matrix) // 缩放2倍
    matrix = nj.dot(nj.array([
      [1, 0, -1],
      [0, 1, -1],
      [0, 0, 1]
    ]), matrix) // 平移(-1， -1)
    matrix = nj.dot(nj.array([
      [1, 0,  0],
      [0, -1, 0],
      [0, 0,  1]
    ]), matrix) // 翻转Y轴

    matrix = nj.dot(matrix, nj.array([
      [1, 0, translation[0]],
      [0, 1, translation[1]],
      [0, 0, 1]
    ]))

    let c = Math.cos(angleInRadians * Math.PI / 180)
    let s = Math.sin(angleInRadians * Math.PI / 180)
    /**
     * y轴指向上方, 其转换矩阵为[[c -s], [s, c]]
     * y轴指向下方, 如果旋转方向和坐标轴不一致, 那么其转换矩阵应该为[[c s], [-s, c]]
     */
    matrix = nj.dot(matrix, nj.array([
      [c, -s, 0],
      [s, c, 0],
      [0, 0, 1]
    ]))

    // console.log(matrix.toString())
    // let a = nj.dot(nj.array([200, 200, 1]), matrix.T)
    // console.log(a.valueOf())

    gl.uniformMatrix3fv(matrixLocation, false, matrix.flatten().valueOf())

    gl.drawArrays(primitiveType, 0, count)
  }
}
