const THREE = require('three')

const line = require('./line')

const {
  Scene,
  PerspectiveCamera,
  WebGLRenderer
} = THREE

// 场景
const scene = new Scene()
// 相机 (视角 宽高比 )
const camera = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000)
// 渲染器
const render = new WebGLRenderer()
render.setSize(window.innerWidth, window.innerHeight)

document.querySelector('#app').appendChild(render.domElement)


// 线段
line(THREE, scene, camera, render)

// 渲染
render.render( scene, camera )