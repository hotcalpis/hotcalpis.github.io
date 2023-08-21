import * as THREE from 'three'

export default class Stars {
  scene: THREE.Scene
  number: number
  radius: number

  constructor(scene: THREE.Scene, number: number, radius: number) {
    this.scene = scene
    this.number = number
    this.radius = radius

    this.init()
  }

  init() {
    const vertices = []
    for (let i = 0; i < this.number; i++) {
      vertices.push(
        this.radius * (Math.random() - 0.5),
        this.radius * (Math.random() - 0.5),
        this.radius * (Math.random() - 0.5)
      )
    }
    const stars = new THREE.Points(
      new THREE.BufferGeometry().setAttribute(
        'position',
        new THREE.Float32BufferAttribute(vertices, 3)
      ),
      new THREE.PointsMaterial({
        size: 3000,
        color: '#f0f0f0',
      })
    )
    this.scene.add(stars)
  }
}
