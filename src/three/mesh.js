module.exports = function (THREE, scene, camera) {
  const material_ = new THREE.MeshBasicMaterial({ color: 0x00ff00 }) // 立方体
  const geometry_ = new THREE.BoxGeometry(1, 1, 1)
  const cube = new THREE.Mesh(geometry_, material_)

  // cube.rotation.x += 10
  // cube.rotation.y += 10
  // cube.rotation.z += 10

  // 添加物体到场景中
  scene.add(cube)



  // var animate = function () {
  //     requestAnimationFrame( animate )

  //     cube.rotation.x += 0.01
  //     cube.rotation.y += 0.01

  //     render.render( scene, camera )
  // }

  // animate()
}