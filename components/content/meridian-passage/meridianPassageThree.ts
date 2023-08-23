import * as THREE from 'three'
import Stars from './stars'
import Sun from './sun'
import Earth from './earth'
import Moon from './moon'

export default class MeridianPassage {
  canvas: HTMLCanvasElement
  degree: number
  degreePer: number
  requestAnimationId: number
  scene: THREE.Scene
  camera: THREE.Camera
  cameraBeforeRotation: THREE.Camera
  renderer: THREE.Renderer | undefined
  stars: Stars | undefined
  earth: Earth | undefined
  moon: Moon | undefined
  sun: Sun | undefined
  latitude: number
  earthAxis: THREE.Vector3
  earthAxisQuaternion: THREE.Quaternion
  aroundEarthAxisQuaternion: THREE.Quaternion
  verticalAxis: THREE.Vector3
  horizontalAxis: THREE.Vector3
  totalScrollVertical: number
  totalScrollHorizontal: number

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    this.degree = 0
    this.degreePer = 0.00005
    this.requestAnimationId = 0
    this.scene = new THREE.Scene
    this.camera = new THREE.Camera
    this.cameraBeforeRotation = new THREE.Camera
    this.renderer = undefined
    this.stars = undefined
    this.earth = undefined
    this.moon = undefined
    this.sun = undefined
    this.latitude = 35
    this.earthAxis = new THREE.Vector3
    this.earthAxisQuaternion = new THREE.Quaternion
    this.aroundEarthAxisQuaternion = new THREE.Quaternion()
    this.verticalAxis = new THREE.Vector3
    this.horizontalAxis = new THREE.Vector3
    this.totalScrollVertical = this.totalScrollHorizontal = 0
  }

  cancel() {
    cancelAnimationFrame(this.requestAnimationId)
  }

  changeDegreePer(degreePer: number) {
    this.degreePer = degreePer
  }

  changeLatitude(latitude: number) {
    this.latitude = latitude

    // 指定緯度での初期位置
    this.cameraBeforeRotation.position.set(
      0,
      2000 * Math.sin((Math.PI * this.latitude) / 180),
      2000 * Math.cos((Math.PI * this.latitude) / 180)
    )

    // 地軸23.4度の傾きをカメラに反映
    this.cameraBeforeRotation.position.applyQuaternion(this.earthAxisQuaternion)

    // 地球上の初期位置時点での鉛直/水平軸
    this.verticalAxis = new THREE.Vector3(1, 0, 0)
    this.horizontalAxis = this.cameraBeforeRotation.position.clone().normalize()
  }

  animate() {
    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(
      90,
      this.canvas.width / this.canvas.height,
      0.1,
      600000
    )
    this.cameraBeforeRotation = this.camera.clone()

    this.stars = new Stars(this.scene, 2000, 3000000)
    this.sun = new Sun(this.scene, 21860)
    this.earth = new Earth(this.scene, 2000, 230)
    this.moon = new Moon(this.scene, 550, 836, 22)

    this.earthAxisQuaternion = new THREE.Quaternion().setFromAxisAngle(
      new THREE.Vector3(1, 0, 0),
      THREE.MathUtils.degToRad(-23.4)
    )

    this.earthAxis = new THREE.Vector3(0, 1, 0).applyQuaternion(
      this.earthAxisQuaternion
    )

    this.changeLatitude(this.latitude)

    this.scene.add(new THREE.AmbientLight('#f0f0f0', 0.15))

    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas })
    this.render()
  }

  render() {
    this.requestAnimationId = requestAnimationFrame(this.render.bind(this))
    this.degree += this.degreePer

    this.sun!.update(this.degree)
    this.earth!.update(this.degree)
    this.moon!.update(this.degree)

    this.aroundEarthAxisQuaternion.setFromAxisAngle(
      this.earthAxis,
      this.degree * 365
    )

    // 地軸周りの回転をカメラ・軸に反映
    this.camera.position.copy(
      this.cameraBeforeRotation.position
        .clone()
        .applyQuaternion(this.aroundEarthAxisQuaternion)
    )
    this.camera.quaternion.copy(
      this.cameraBeforeRotation.quaternion
        .clone()
        .multiply(this.aroundEarthAxisQuaternion)
    )

    // 鉛直・水平それぞれのスクロール分を回転
    this.camera.quaternion
      .multiply(
        new THREE.Quaternion().setFromAxisAngle(
          this.horizontalAxis,
          this.totalScrollHorizontal
        )
      )
      .multiply(
        new THREE.Quaternion().setFromAxisAngle(
          this.verticalAxis,
          this.totalScrollVertical
        )
      )

    // 地球上へ
    this.camera.position.multiplyScalar(1.005).add(this.earth!.obj.position)

    this.renderer!.render(this.scene, this.camera)

    // 鉛直・水平それぞれのスクロール分を回転相殺
    this.camera.quaternion.multiply(
      new THREE.Quaternion()
        .multiply(
          new THREE.Quaternion().setFromAxisAngle(
            this.verticalAxis,
            this.totalScrollVertical * -1
          )
        )
        .multiply(
          new THREE.Quaternion().setFromAxisAngle(
            this.horizontalAxis,
            this.totalScrollHorizontal * -1
          )
        )
    )
  }
}
