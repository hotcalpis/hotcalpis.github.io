<script setup lang="ts">
import { ref, type Ref, onMounted, onUnmounted } from 'vue'

const silver = 'rgb(192, 192, 192)'
const dark = 'rgb(115, 115, 115)'

const canvas = ref(null)
const canvasWidth = ref(0)
const c: Ref<CanvasRenderingContext2D | undefined> = ref(undefined)

const angle = ref(0)
const requestAnimationId = ref(0)

const moon = ref({ x: 0, y: 0, radius: 0 })

const props = defineProps({
  angularVelocity: { type: Number, required: true },
})

onMounted(() => {
  const element = canvas.value! as HTMLCanvasElement
  c.value = element.getContext('2d')!

  init(element)

  animate()
})

onUnmounted(() => {
  cancelAnimationFrame(requestAnimationId.value)
})

const init = (element: HTMLCanvasElement) => {
  const parentNode = element.parentNode as HTMLElement
  element.width = canvasWidth.value = parentNode.clientWidth
  element.height = element.width

  moon.value.x = element.width / 2
  moon.value.y = element.height / 2
  moon.value.radius = element.width / 2.4
}

const animate = () => {
  requestAnimationId.value = requestAnimationFrame(animate)

  angle.value += props.angularVelocity
  c.value!.save()
  c.value!.clearRect(0, 0, canvasWidth.value, canvasWidth.value)

  c.value!.font = `${Math.round(canvasWidth.value / 20)}px sans-serif`
  c.value!.fillStyle = 'white'
  const moonAge = Math.round(
    ((((angle.value * 365.24) / (1 / (1 / 27.3 - 1 / 365.24)) + 180) % 360) /
      360) *
      (1 / (1 / 27.3 - 1 / 365.24))
  )
  c.value!.fillText(
    `月齢：${moonAge}`,
    Math.round(canvasWidth.value / 50),
    Math.round(canvasWidth.value / 17)
  )

  c.value!.translate(moon.value.x, moon.value.y)

  let leftHalfBaseColor: string = silver
  let rightHalfBaseColor: string = dark
  let rightToLeftColor: string = silver
  let scale: number = 0

  const quarter =
    Math.floor(
      (((((angle.value * 365.24) / (1 / (1 / 27.3 - 1 / 365.24))) * Math.PI) /
        180) %
        (Math.PI * 2)) /
        (Math.PI / 2)
    ) % 4
  switch (quarter) {
    case 0:
      canvasUtils.fillCircle(c.value!, 0, 0, moon.value.radius, silver)
      leftHalfBaseColor = silver
      rightHalfBaseColor = dark
      rightToLeftColor = silver
      scale = Math.cos(
        (((angle.value * 365.24) / (1 / (1 / 27.3 - 1 / 365.24))) * Math.PI) /
          180
      )
      break
    case 1:
      canvasUtils.fillCircle(c.value!, 0, 0, moon.value.radius, silver)
      leftHalfBaseColor = silver
      rightHalfBaseColor = dark
      rightToLeftColor = dark
      scale = Math.cos(
        (((angle.value * 365.24) / (1 / (1 / 27.3 - 1 / 365.24))) * Math.PI) /
          180
      )
      break
    case 2:
      leftHalfBaseColor = dark
      rightHalfBaseColor = silver
      rightToLeftColor = dark
      scale =
        Math.cos(
          (((angle.value * 365.24) / (1 / (1 / 27.3 - 1 / 365.24))) * Math.PI) /
            180
        ) * -1
      break
    case 3:
      leftHalfBaseColor = dark
      rightHalfBaseColor = silver
      rightToLeftColor = silver
      scale =
        Math.cos(
          (((angle.value * 365.24) / (1 / (1 / 27.3 - 1 / 365.24))) * Math.PI) /
            180
        ) * -1
      break
  }

  canvasUtils.fillSemiCircle(
    c.value!,
    0,
    0,
    moon.value.radius,
    leftHalfBaseColor,
    Math.PI * 0.5
  )
  canvasUtils.fillSemiCircle(
    c.value!,
    0,
    0,
    moon.value.radius,
    rightHalfBaseColor,
    Math.PI * 1.5
  )
  c.value!.save()
  c.value!.scale(scale, 1)
  canvasUtils.fillSemiCircle(
    c.value!,
    0,
    0,
    moon.value.radius,
    rightToLeftColor,
    Math.PI * 1.5
  )
  c.value!.restore()

  c.value!.restore()
}
</script>

<template>
  <canvas
    ref="canvas"
    :width="canvasWidth"
    :height="canvasWidth"
    class="w-full sm:w-[49%] bg-outer-space"
  />
</template>
