<script setup lang="ts">
import { ref, type Ref, onMounted, onUnmounted } from 'vue'
import { ANIMATION_FPS, EARTH_MOON_DISTANCE, LIGHT_SPEED } from '@/constants'

const canvasWidth = 1140
const canvasHeight = 50
const earthRadius = 17
const moonRadius = 5

const canvas = ref(null)
const c: Ref<CanvasRenderingContext2D | undefined> = ref(undefined)

const elapsedTime = ref(0)
const requestAnimationId = ref(0)

const earth = ref({ x: 0, y: 0, radius: 0 })
const moon = ref({ x: 0, y: 0, radius: 0 })
const distance = ref(0)
const lightSpeed = ref(0)

onMounted(() => {
  const element = canvas.value! as HTMLCanvasElement
  c.value = element.getContext('2d')!

  init()

  animate()
})

onUnmounted(() => {
  cancelAnimationFrame(requestAnimationId.value)
})

const init = () => {
  earth.value = {
    x: canvasHeight / 2 + earthRadius,
    y: canvasHeight / 2,
    radius: earthRadius,
  }
  moon.value = {
    x: canvasWidth - canvasHeight / 2 - moonRadius,
    y: canvasHeight / 2,
    radius: moonRadius,
  }
  distance.value =
    moon.value.x - earth.value.x - earth.value.radius - moon.value.radius
  lightSpeed.value =
    ((distance.value / EARTH_MOON_DISTANCE) * LIGHT_SPEED) / ANIMATION_FPS
}

const animate = () => {
  requestAnimationId.value = requestAnimationFrame(animate)

  elapsedTime.value += 1

  c.value!.save()
  c.value!.clearRect(0, 0, canvasWidth, canvasHeight)

  canvasUtils.fillCircle(
    c.value!,
    earth.value.x,
    earth.value.y,
    earth.value.radius,
    '#4287f5'
  )

  c.value!.beginPath()
  c.value!.arc(earth.value.x, earth.value.y, 65 * 0.071, 0, Math.PI * 0.35)
  c.value!.strokeStyle = '#34eb61'
  c.value!.lineCap = 'round'
  c.value!.lineWidth = 45 * 0.071
  c.value!.stroke()
  c.value!.beginPath()
  c.value!.arc(
    earth.value.x,
    earth.value.y,
    110 * 0.071,
    Math.PI * 0.9,
    Math.PI * 1.2
  )
  c.value!.strokeStyle = '#34eb61'
  c.value!.lineCap = 'round'
  c.value!.lineWidth = 75 * 0.071
  c.value!.stroke()
  c.value!.beginPath()
  c.value!.arc(
    earth.value.x,
    earth.value.y,
    140 * 0.071,
    Math.PI * 1.45,
    Math.PI * 1.85
  )
  c.value!.strokeStyle = '#34eb61'
  c.value!.lineCap = 'round'
  c.value!.lineWidth = 65 * 0.071
  c.value!.stroke()
  c.value!.beginPath()
  c.value!.arc(
    earth.value.x,
    earth.value.y,
    145 * 0.071,
    Math.PI * 0.675,
    Math.PI * 0.725
  )
  c.value!.strokeStyle = '#34eb61'
  c.value!.lineCap = 'round'
  c.value!.lineWidth = 35 * 0.071
  c.value!.stroke()
  c.value!.beginPath()
  c.value!.arc(
    earth.value.x,
    earth.value.y,
    150 * 0.071,
    Math.PI * 1.075,
    Math.PI * 1.1
  )
  c.value!.strokeStyle = '#34eb61'
  c.value!.lineCap = 'round'
  c.value!.lineWidth = 80 * 0.071
  c.value!.stroke()
  c.value!.beginPath()
  c.value!.arc(
    earth.value.x,
    earth.value.y,
    200 * 0.071,
    Math.PI * 0.75,
    Math.PI * 1.05
  )
  c.value!.strokeStyle = '#34eb61'
  c.value!.lineCap = 'round'
  c.value!.lineWidth = 60 * 0.071
  c.value!.stroke()
  c.value!.beginPath()
  c.value!.arc(
    earth.value.x,
    earth.value.y,
    200 * 0.071,
    Math.PI * 1.2,
    Math.PI * 1.35
  )
  c.value!.strokeStyle = '#34eb61'
  c.value!.lineCap = 'round'
  c.value!.lineWidth = 40 * 0.071
  c.value!.stroke()
  c.value!.beginPath()
  c.value!.arc(
    earth.value.x,
    earth.value.y,
    200 * 0.071,
    Math.PI * 1.9,
    Math.PI * 2.3
  )
  c.value!.strokeStyle = '#34eb61'
  c.value!.lineCap = 'round'
  c.value!.lineWidth = 80 * 0.071
  c.value!.stroke()

  c.value!.beginPath()
  c.value!.arc(
    earth.value.x,
    earth.value.y,
    80 * 0.071,
    Math.PI * 0.25,
    Math.PI * 0.375
  )
  c.value!.strokeStyle = 'white'
  c.value!.lineCap = 'round'
  c.value!.lineWidth = 35 * 0.071
  c.value!.stroke()
  c.value!.beginPath()
  c.value!.arc(
    earth.value.x,
    earth.value.y,
    105 * 0.071,
    Math.PI * 0.3,
    Math.PI * 0.4
  )
  c.value!.strokeStyle = 'white'
  c.value!.lineCap = 'round'
  c.value!.lineWidth = 35 * 0.071
  c.value!.stroke()
  c.value!.beginPath()
  c.value!.arc(
    earth.value.x,
    earth.value.y,
    130 * 0.071,
    Math.PI * 0.75,
    Math.PI * 0.95
  )
  c.value!.strokeStyle = 'white'
  c.value!.lineCap = 'round'
  c.value!.lineWidth = 40 * 0.071
  c.value!.stroke()
  c.value!.beginPath()
  c.value!.arc(
    earth.value.x,
    earth.value.y,
    150 * 0.071,
    Math.PI * 1.1,
    Math.PI * 1.2
  )
  c.value!.strokeStyle = 'white'
  c.value!.lineCap = 'round'
  c.value!.lineWidth = 45 * 0.071
  c.value!.stroke()
  c.value!.beginPath()
  c.value!.arc(
    earth.value.x,
    earth.value.y,
    165 * 0.071,
    Math.PI * 0.25,
    Math.PI * 0.375
  )
  c.value!.strokeStyle = 'white'
  c.value!.lineCap = 'round'
  c.value!.lineWidth = 35 * 0.071
  c.value!.stroke()
  c.value!.beginPath()
  c.value!.arc(
    earth.value.x,
    earth.value.y,
    200 * 0.071,
    Math.PI * 1.45,
    Math.PI * 1.525
  )
  c.value!.strokeStyle = 'white'
  c.value!.lineCap = 'round'
  c.value!.lineWidth = 35 * 0.071
  c.value!.stroke()
  c.value!.beginPath()
  c.value!.arc(
    earth.value.x,
    earth.value.y,
    205 * 0.071,
    Math.PI * 0.775,
    Math.PI * 0.85
  )
  c.value!.strokeStyle = 'white'
  c.value!.lineCap = 'round'
  c.value!.lineWidth = 35 * 0.071
  c.value!.stroke()

  canvasUtils.fillCircle(
    c.value!,
    moon.value.x,
    moon.value.y,
    moon.value.radius,
    'silver'
  )

  const movingDistance = lightSpeed.value * elapsedTime.value
  const x =
    earth.value.x +
    earth.value.radius +
    (Math.floor(movingDistance / distance.value) % 2 === 0
      ? movingDistance % distance.value
      : distance.value - (movingDistance % distance.value))
  canvasUtils.fillCircle(c.value!, x, canvasHeight / 2, 2, 'yellow')

  c.value!.restore()
}
</script>

<template>
  <canvas
    ref="canvas"
    :width="canvasWidth"
    :height="canvasHeight"
    class="w-full overflow-auto bg-outer-space"
  />
</template>
