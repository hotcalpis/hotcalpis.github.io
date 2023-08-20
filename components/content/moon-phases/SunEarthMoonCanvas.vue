<script setup lang="ts">
import { ref, Ref, onMounted, onUnmounted } from 'vue'

const canvas = ref(null)
const canvasWidth = ref(0)
const c: Ref<CanvasRenderingContext2D | undefined> = ref(undefined)

const angle = ref(0)
const requestAnimationId = ref(0)

const sun = ref({ x: 0, y: 0, radius: 0 })
const earth = ref({
  radius: 0,
  semiAverageAxis: 0,
  land: [{ x: 0, y: 0, radius: 0 }],
})
const moon = ref({
  radius: 0,
  semiAverageAxis: 0,
  crater: [{ x: 0, y: 0, radius: 0 }],
})

const props = defineProps({
  angularVelocity: { type: Number, required: true },
  isFocusEarth: { type: Boolean, required: true },
  isLineActive: { type: Boolean, required: true },
})

onMounted(() => {
  const element = canvas.value! as HTMLCanvasElement
  c.value! = element.getContext('2d')!

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

  sun.value = {
    x: canvasWidth.value / 2,
    y: canvasWidth.value / 2,
    radius: (canvasWidth.value * 80) / 550,
  }
  earth.value = {
    radius: (canvasWidth.value * 20) / 550,
    semiAverageAxis: (canvasWidth.value * 200) / 550,
    land: [],
  }
  moon.value = {
    radius: (canvasWidth.value * 8) / 550,
    semiAverageAxis: (canvasWidth.value * 60) / 550,
    crater: [],
  }

  for (let i = 1; i <= 5; i++) {
    earth.value.land.push({
      x: (Math.random() - 0.5) * 1.5 * earth.value.radius,
      y: (Math.random() - 0.5) * 1.5 * earth.value.radius,
      radius: ((0.3 + i * 0.1) * earth.value.radius) / 2,
    })
    moon.value.crater.push({
      x: (Math.random() - 0.5) * 1.5 * moon.value.radius,
      y: (Math.random() - 0.5) * 1.5 * moon.value.radius,
      radius: ((0.3 + i * 0.1) * moon.value.radius) / 2,
    })
  }
}

const animate = () => {
  requestAnimationId.value = requestAnimationFrame(animate)

  angle.value += props.angularVelocity

  if (props.isFocusEarth) {
    animateEarthFocus()
  } else {
    animateSunFocus()
  }
}

const animateSunFocus = () => {
  c.value!!.save()
  c.value!!.clearRect(0, 0, canvasWidth.value, canvasWidth.value)

  // -----太陽
  canvasUtils.fillCircle(
    c.value!!,
    canvasWidth.value / 2,
    canvasWidth.value / 2,
    sun.value.radius * 4,
    '#0B1740'
  )
  canvasUtils.fillCircle(
    c.value!!,
    canvasWidth.value / 2,
    canvasWidth.value / 2,
    sun.value.radius * 3,
    '#091b47'
  )
  canvasUtils.fillCircle(
    c.value!!,
    canvasWidth.value / 2,
    canvasWidth.value / 2,
    sun.value.radius * 2,
    '#081e4e'
  )
  canvasUtils.fillCircle(
    c.value!!,
    canvasWidth.value / 2,
    canvasWidth.value / 2,
    sun.value.radius,
    'orange'
  )

  // -----地球
  // 地球の公転
  c.value!.translate(sun.value.x, sun.value.y)
  c.value!.rotate((angle.value * Math.PI) / -180)

  // 地球の自転
  c.value!.translate(earth.value.semiAverageAxis, 0)
  c.value!.rotate((angle.value * (365.24 - 1) * Math.PI) / -180)

  canvasUtils.fillCircle(c.value!, 0, 0, earth.value.radius, '#409ad6')

  c.value!.save()
  c.value!.beginPath()
  c.value!.arc(0, 0, earth.value.radius, 0, Math.PI * 2)
  c.value!.clip()
  earth.value.land.forEach((land) => {
    canvasUtils.fillCircle(c.value!, land.x, land.y, land.radius, 'lightgreen')
  })
  c.value!.restore()

  canvasUtils.fillCircle(c.value!, 0, 0, earth.value.radius / 8, 'red')

  // 地球の自転を打ち消し
  c.value!.rotate((angle.value * (365.24 - 1) * Math.PI) / 180)

  canvasUtils.fillSemiCircle(
    c.value!,
    0,
    0,
    earth.value.radius,
    'rgba(0, 0, 0, 0.4)',
    Math.PI * 1.5
  )

  // -----月
  // 月の公転
  c.value!.rotate((angle.value * (365.24 / 27.3 - 1) * Math.PI) / -180)

  c.value!.translate(moon.value.semiAverageAxis, 0)

  canvasUtils.fillCircle(c.value!, 0, 0, moon.value.radius, 'silver')

  c.value!.save()
  c.value!.beginPath()
  c.value!.arc(0, 0, moon.value.radius, 0, Math.PI * 2)
  c.value!.clip()
  moon.value.crater.forEach((crater) => {
    canvasUtils.fillCircle(c.value!, crater.x, crater.y, crater.radius, 'gray')
  })
  c.value!.restore()

  if (props.isLineActive) {
    c.value!.beginPath()
    c.value!.arc(0, 0, moon.value.radius, Math.PI * 0.5, Math.PI * 0.5)
    c.value!.lineTo(moon.value.semiAverageAxis * -1, 0)
    c.value!.arc(0, 0, moon.value.radius, Math.PI * 1.5, Math.PI * 1.5)
    c.value!.lineWidth = 2
    c.value!.strokeStyle = 'yellow'
    c.value!.stroke()
  }

  // 月の公転を打ち消し
  c.value!.rotate((angle.value * (365.24 / 27.3 - 1) * Math.PI) / 180)

  canvasUtils.fillSemiCircle(
    c.value!,
    0,
    0,
    moon.value.radius,
    'rgba(0, 0, 0, 0.4)',
    Math.PI * 1.5
  )

  c.value!.restore()
}

const animateEarthFocus = () => {
  c.value!.save()
  c.value!.clearRect(0, 0, canvasWidth.value, canvasWidth.value)

  // -----地球
  // 地球の自転
  c.value!.translate(canvasWidth.value / 2, canvasWidth.value / 2)
  c.value!.rotate((angle.value * (365.24 - 1) * Math.PI) / -180)

  canvasUtils.fillCircle(c.value!, 0, 0, earth.value.radius * 3, '#409ad6')

  c.value!.save()
  c.value!.beginPath()
  c.value!.arc(0, 0, earth.value.radius * 3, 0, Math.PI * 2)
  c.value!.clip()
  earth.value.land.forEach((land) => {
    canvasUtils.fillCircle(
      c.value!,
      land.x * 3,
      land.y * 3,
      land.radius * 3,
      'lightgreen'
    )
  })
  c.value!.restore()

  // c.value!.fillRoundedArc(0, 0, earth.value.radius * 3 + 1, 'red', 6, 0, Math.PI * 0.1, 'butt')
  canvasUtils.fillCircle(c.value!, 0, 0, earth.value.radius / 8, 'red')

  // 地球の自転を打ち消し
  c.value!.rotate((angle.value * (365.24 - 1) * Math.PI) / 180)

  canvasUtils.fillSemiCircle(
    c.value!,
    0,
    0,
    earth.value.radius * 3,
    'rgba(0, 0, 0, 0.4)',
    Math.PI * 1.5
  )

  // -----月
  // 月の公転
  c.value!.rotate((angle.value * (365.24 / 27.3 - 1) * Math.PI) / -180)

  c.value!.translate(moon.value.semiAverageAxis * 4, 0)

  canvasUtils.fillCircle(c.value!, 0, 0, moon.value.radius * 3, 'silver')

  c.value!.save()
  c.value!.beginPath()
  c.value!.arc(0, 0, moon.value.radius * 3, 0, Math.PI * 2)
  c.value!.clip()
  moon.value.crater.forEach((crater) => {
    canvasUtils.fillCircle(
      c.value!,
      crater.x * 3,
      crater.y * 3,
      crater.radius * 3,
      'gray'
    )
  })
  c.value!.restore()

  if (props.isLineActive) {
    c.value!.beginPath()
    c.value!.arc(0, 0, moon.value.radius * 3, Math.PI * 0.5, Math.PI * 0.5)
    c.value!.lineTo(moon.value.semiAverageAxis * -4, 0)
    c.value!.arc(0, 0, moon.value.radius * 3, Math.PI * 1.5, Math.PI * 1.5)
    c.value!.lineWidth = 2
    c.value!.strokeStyle = 'yellow'
    c.value!.stroke()
  }

  // 月の公転を打ち消し
  c.value!.rotate((angle.value * (365.24 / 27.3 - 1) * Math.PI) / 180)

  canvasUtils.fillSemiCircle(
    c.value!,
    0,
    0,
    moon.value.radius * 3,
    'rgba(0, 0, 0, 0.4)',
    Math.PI * 1.5
  )

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
