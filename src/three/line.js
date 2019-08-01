
module.exports = function(THREE, scene, camera) {
  camera.position.set(-10, 100, 0)
  camera.up.set(0, 0, 1)
  // camera.lookAt(0, 0, 0)
  camera.lookAt(new THREE.Vector3(0, 0, 0))

  // 材质
  const material = new THREE.LineBasicMaterial({ color: 0x000fff }) // 线
  // geometry
  const geometry = new THREE.Geometry()
  geometry.vertices.push(new THREE.Vector3(-10, 0, 0))
  geometry.vertices.push(new THREE.Vector3(10, 0, 0))
  // geometry.colors.push(new THREE.Color(0x888888), new THREE.Color(0x999999))

  let line = new THREE.Line(geometry, material, THREE.LineSegments)
  line.position.set(0, 0, 1)
  scene.add(line)

  line = new THREE.Line(geometry, material, THREE.LineSegments)
  line.position.set(0, 0, 0)
  scene.add(line)

  line = new THREE.Line(geometry, material, THREE.LineSegments)
  line.position.set(0, 0, -1)
  scene.add(line)

  // for (let i = 0; i < 2; i++) {
  //   let line = new THREE.Line(geometry, material, THREE.LineSegments)
  //   line.position.set(0, 80, ( i * 80 ) - 500)
  //   scene.add(line)

  // //   line = new THREE.Line(geometry, material, THREE.LineSegments)
  // //   line.position.x = ( i * 50 ) - 500
  // //   line.rotation.y = 90 * Math.PI / 180   //  旋转90度
  // //   scene.add( line )
  // }
}