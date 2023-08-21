import * as THREE from 'three'
import image from '@/assets/image/earth_texture_high_quality.jpeg'

export default class Earth {
  scene: THREE.Scene
  radius: number
  semiAverageAxis: number
  obj: THREE.Object3D
  axis: THREE.Line

  constructor(scene: THREE.Scene, radius: number, semiAverageAxis: number) {
    this.scene = scene
    this.radius = radius
    this.semiAverageAxis = semiAverageAxis
    this.obj = new THREE.Object3D
    this.axis = new THREE.Line

    this.init()
  }

  init() {
    this.obj = new THREE.Mesh(
      new THREE.SphereGeometry(this.radius, 64, 64),
      new THREE.MeshPhongMaterial({
        map: new THREE.TextureLoader().load(image),
      })
    )
    this.obj.rotation.x = (Math.PI * -23.4) / 180
    this.scene.add(this.obj)

    this.axis = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, this.radius * 2, 0),
        new THREE.Vector3(0, this.radius * -2, 0),
      ]),
      new THREE.LineBasicMaterial({
        color: 'yellow',
      })
    )
    this.axis.rotation.x = (Math.PI * -23.4) / 180
    this.scene.add(this.axis)
  }

  update(degree: number) {
    this.obj.rotation.y = degree * 365
    this.obj.position.x = this.radius * this.semiAverageAxis * Math.sin(degree)
    this.obj.position.z = this.radius * this.semiAverageAxis * Math.cos(degree)

    this.axis.position.copy(this.obj.position)
  }
}
