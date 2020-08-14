// 简单支持平移、缩放、旋转
// ------------------------------ 初始化代码 ------------------------------
let canvas = document.getElementById('canvas')
const gl = canvas.getContext('webgl')

console.log(gl.canvas.width, gl.canvas.height)

if (gl) {
  let vertex_shader_code = `
    // 一个属性变量, 从缓冲中获取数据
    // attribute vec4 a_position;
    attribute vec2 a_position;
    
    uniform vec2 u_resolution;
    uniform vec2 u_translation;
    uniform vec2 u_rotation;
    uniform vec2 u_scale;

    // varying vec4 v_color;

    void main() {
      // 缩放
      vec2 scaledPosition = a_position * u_scale;
      // 旋转 该算法为常用数学坐标系
      // vec2 rotatedPosition = vec2(
      //   scaledPosition.x * u_rotation.x - scaledPosition.y * u_rotation.y,
      //   scaledPosition.x * u_rotation.y + scaledPosition.y * u_rotation.x
      // );

      // 适用于常用计算机屏幕的坐标息
      vec2 rotatedPosition = vec2(
        scaledPosition.x * u_rotation.x + scaledPosition.y * u_rotation.y,
        scaledPosition.y * u_rotation.x - scaledPosition.x * u_rotation.y
      );

      // 平移
      vec2 position = rotatedPosition + u_translation;
      
      vec2 zeroToOne = position / u_resolution;
      vec2 zeroToTwo = zeroToOne * 2.0;
      vec2 clipSpace = zeroToTwo - 1.0;
      // 翻折 转换成常用坐标轴 gl_Position为裁剪空间的坐标值
      gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);

      // 颜色空间
      // v_color = gl_Position * 0.5 + 0.5;
    }
  `
  let fragment_shader_code = `
    // 片段着色器没有默认精度 需要设置一个
    precision mediump float;
    // varying vec4 v_color;
    void main() {
      // gl_FragColor是一个片段着色器主要设置的变量
      gl_FragColor = vec4(1, 0, 0.5, 1); // 紫色
    }
  `

  let vertexShader = createShader(gl, gl.VERTEX_SHADER, vertex_shader_code)
  let fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragment_shader_code)
  let program = createProgram(gl, vertexShader, fragmentShader) // 将一对着色器链接到一个着色程序中

  // 从着色程序中寻找属性位置
  let positionAttributeLocation = gl.getAttribLocation(program, "a_position")
  let resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution") // 分辨率

  let translationUniformLocation = gl.getUniformLocation(program, "u_translation")  // 平移
  let rotationUniformLocation = gl.getUniformLocation(program, "u_rotation") // 旋转
  let scaleUniformLocation = gl.getUniformLocation(program, "u_scale") // 旋转

  // 着色程序的属性值是从缓冲中获取的, 首先需要创建缓冲
  let positionBuffer = gl.createBuffer()
  // 将positionBuffer缓冲绑定到ARRAY_BUFFER上, ARRAY_BUFFER就是一个绑定点, webgl可通过绑定点引用其指向的数据源
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)

  let positions = [
    // -0.5, 0,
    // 0, 1,
    // 0.5, -0.5
    0, 0,
    80, 0,
    0, 30,
    0, 30,
    80, 0,
    80, 30,
    // 150, 75,
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

  // 设置全局变量
  gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height)

  gl.enableVertexAttribArray(positionAttributeLocation) // 启用对应的属性 "a_position"
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)        // 绑定到缓冲

  // 告诉属性怎么从positionBuffer中读取数据
  var size = 2          // 每次迭代运行提取两个单位数据
  var type = gl.FLOAT   // 每个单位的数据类型是32位浮点型
  var normalize = false // 不需要归一化数据
  var stride = 0        // 0 = 移动单位数量 * 每个单位占用内存（sizeof(type)）
                        // 每次迭代运行运动多少内存到下一个数据开始点
  var offset = 0        // 从缓冲起始位置开始读取

  // 将属性绑定到缓冲中, 也就是positionBuffer中; 也就是按照规则读取缓冲中的数据到对应的属性中
  gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset)

  let primitiveType = gl.TRIANGLES // 图元类型 三角形
  let count = 6                    // 顶点着色器运行3次

  let translation = [0, 0]
  let rotation = [Math.cos(0), Math.sin(0)]
  let scale = [1, 1]
  
  draw()

  function change (v, flag) {
    switch(flag) {
      case 'x':
        translation[0] = v
        break
      case 'y':
        translation[1] = v
        break
      case 'r':
        let angleInRadians = v * Math.PI / 180 // 弧度
        rotation[0] = Math.cos(angleInRadians)
        rotation[1] = Math.sin(angleInRadians)
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
    
    gl.uniform2fv(translationUniformLocation, translation) // 设置平移
    gl.uniform2fv(rotationUniformLocation, rotation) // 设置旋转
    gl.uniform2fv(scaleUniformLocation, scale) // 设置缩放

    gl.drawArrays(primitiveType, 0, count)
  }
}
