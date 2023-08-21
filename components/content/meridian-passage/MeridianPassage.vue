<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import day from 'dayjs'

const textureSources = [
  {
    from: 'NASA',
    items: [
      {
        name: '太陽',
        url: 'https://www.nasa.gov/mission_pages/stereo/news/6th-anniversary.html',
      },
      {
        name: '地球',
        url: 'https://www.nasa.gov/multimedia/imagegallery/image_feature_2495.html',
      },
      {
        name: '月',
        url: 'https://svs.gsfc.nasa.gov/cgi-bin/details.cgi?aid=4720',
      },
    ],
  },
]

const latitude = ref(35)
const degree = ref(0)
const degreePer = ref(5)
const isPointerDragOn = ref(false)
const totalScrollVertical = ref(0)
const totalScrollHorizontal = ref(0)
const isStopAnime = ref(false)
const pointerDownCoord = ref({ x: 0, y: 0 })
const requestAnimationId = ref(0)

const azimuth = computed(() => {
  return Math.floor(
    ((((totalScrollHorizontal.value / Math.PI) * -180) % 360) + 360) % 360
  )
})

const elevation = computed(() => {
  return Math.floor(
    ((((totalScrollVertical.value / Math.PI) * 180 -
      90 +
      23.4 +
      latitude.value) %
      360) +
      360) %
      360
  )
})

const dateBasedOnSolarAndEarthPosition = computed(() => {
  return day('20210621', 'YYYYMMDD')
    .add(Math.floor(((degree.value / Math.PI / 2) % 1) * 365), 'd')
    .format('M/D')
})

const degreePerInAnime = computed(() => {
  return isStopAnime.value ? 0 : degreePer.value / 100000
})

onMounted(() => {
  animate()
})

onUnmounted(() => {
  cancelAnimationFrame(requestAnimationId.value)
})

// canvasからdegreeを取り出すのが難しいので無理やりここでも同様に計算
const animate = () => {
  requestAnimationId.value = requestAnimationFrame(animate.bind(this))
  degree.value = degree.value + degreePerInAnime.value
}

const onPointerDown = (e: PointerEvent) => {
  pointerDownCoord.value = { x: e.clientX, y: e.clientY }
}

const onPointerUp = (e: PointerEvent) => {
  if (
    Math.abs(pointerDownCoord.value.x - e.clientX) <= 1 &&
    Math.abs(pointerDownCoord.value.y - e.clientY) <= 1
  ) {
    isStopAnime.value = !isStopAnime.value
  }
}

const pointerDragOn = () => {
  isPointerDragOn.value = true
}

const pointerDragOff = () => {
  isPointerDragOn.value = false
}

const onPointerMove = (e: PointerEvent) => {
  if (!isPointerDragOn.value) return
  totalScrollHorizontal.value += e.movementX / 100
  totalScrollVertical.value += e.movementY / 100
}
</script>

<template>
  <div
    class="flex flex-col sm:flex-row flex-wrap justify-around"
    @pointerdown="onPointerDown"
    @pointerup="onPointerUp"
  >
    TODO: Canvasのサイズ調整とレスポンシブ
    <MeridianPassageCanvas
      :latitude="latitude"
      :degree-per="degreePerInAnime"
      :total-scroll-vertical="totalScrollVertical"
      :total-scroll-horizontal="totalScrollHorizontal"
      :pointer-drag-on="pointerDragOn"
      :pointer-drag-off="pointerDragOff"
      :on-pointer-move="onPointerMove"
      class="mb-1 sm:mb-0"
    />
    <MeridianPassageOverLookingCanvas
      :latitude="latitude"
      :degree-per="degreePerInAnime"
      :total-scroll-vertical="totalScrollVertical"
      :total-scroll-horizontal="totalScrollHorizontal"
    />
  </div>
  <Sources :title="'テクスチャ出典'" :sources="textureSources" />
  <div class="mt-4">
    <div class="my-1">
      <p class="my-0">
        緯度：
        {{ latitude }}
      </p>
      <input
        v-model.number="latitude"
        class="w-full"
        type="range"
        min="-90"
        max="90"
        step="1"
      />
    </div>
    <p class="mt-2 mb-0">
      速度：
      {{ degreePer }}
    </p>
    <input
      v-model.number="degreePer"
      class="w-full"
      type="range"
      min="1"
      max="1000"
      step="1"
    />
    <p class="mt-4 mb-0">
      <span style="margin-right: 1em">
        方位角：
        {{ azimuth }}
      </span>
      <span>
        仰角：
        {{ elevation }}
      </span>
    </p>
    <p class="m-0">
      太陽と地球の位置関係に対応する日付：
      {{ dateBasedOnSolarAndEarthPosition }}
    </p>
  </div>
</template>
