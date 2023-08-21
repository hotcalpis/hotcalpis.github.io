import * as THREE from 'three'
import image from '@/assets/image/moon_texture.jpeg'

export default class Moon {
  scene: THREE.Scene
  radius: number
  earthSemiAverageAxis: number
  moonSemiAverageAxis: number
  obj: THREE.Object3D

  constructor(
    scene: THREE.Scene,
    radius: number,
    earthSemiAverageAxis: number,
    moonSemiAverageAxis: number
  ) {
    this.scene = scene
    this.radius = radius
    this.earthSemiAverageAxis = earthSemiAverageAxis
    this.moonSemiAverageAxis = moonSemiAverageAxis
    this.obj = new THREE.Object3D

    this.init()
  }

  init() {
    this.obj = new THREE.Mesh(
      new THREE.SphereGeometry(this.radius, 8, 8),
      new THREE.MeshPhongMaterial({
        map: new THREE.TextureLoader().load(image),
      })
    )

    this.scene.add(this.obj)
  }

  update(degree: number) {
    this.obj.rotation.y = degree * 29.5
    this.obj.position.x =
      this.radius * this.earthSemiAverageAxis * Math.sin(degree) +
      this.radius * this.moonSemiAverageAxis * Math.sin(degree * 29.5)
    this.obj.position.z =
      this.radius * this.earthSemiAverageAxis * Math.cos(degree) +
      this.radius * this.moonSemiAverageAxis * Math.cos(degree * 29.5)
  }
}
