<script setup lang="ts">
import { ref, type Ref, onMounted, onUnmounted } from 'vue'
import { ANIMATION_FPS, SUN_EARTH_DISTANCE, LIGHT_SPEED } from '@/constants'

const canvasWidth = 1140
const canvasHeight = 50
const sunRadius = 5
const earthRadius = 1

const canvas = ref(null)
const c: Ref<CanvasRenderingContext2D | undefined> = ref(undefined)

const elapsedTime = ref(0)
const requestAnimationId = ref(0)

const sun = ref({ x: 0, y: 0, radius: 0 })
const earth = ref({ x: 0, y: 0, radius: 0 })
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
  sun.value = {
    x: canvasHeight / 2 + sunRadius,
    y: canvasHeight / 2,
    radius: sunRadius,
  }
  earth.value = {
    x: canvasWidth - canvasHeight / 2 - earthRadius,
    y: canvasHeight / 2,
    radius: earthRadius,
  }
  distance.value =
    earth.value.x - sun.value.x - sun.value.radius - earth.value.radius
  lightSpeed.value =
    ((distance.value / SUN_EARTH_DISTANCE) * LIGHT_SPEED) / ANIMATION_FPS
}

const animate = () => {
  requestAnimationId.value = requestAnimationFrame(animate)

  elapsedTime.value += 1

  c.value!.save()
  c.value!.clearRect(0, 0, canvasWidth, canvasHeight)

  canvasUtils.fillCircle(
    c.value!,
    sun.value.x,
    sun.value.y,
    sun.value.radius,
    'orange'
  )
  canvasUtils.fillCircle(
    c.value!,
    earth.value.x,
    earth.value.y,
    earth.value.radius,
    'aqua'
  )

  const movingDistance = lightSpeed.value * elapsedTime.value
  const x =
    sun.value.x +
    sun.value.radius +
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
