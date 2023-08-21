import * as THREE from 'three'
import image from '@/assets/image/sun_texture.jpeg'

export default class Sun {
  scene: THREE.Scene
  radius: number
  obj: THREE.Object3D

  constructor(scene: THREE.Scene, radius: number) {
    this.scene = scene
    this.radius = radius
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

    const sunLight = new THREE.PointLight('#f0f0f0', 3, 0, 0)
    this.scene.add(sunLight)

    return this.obj
  }

  update(degree: number) {
    this.obj.rotation.y = degree
  }
}
