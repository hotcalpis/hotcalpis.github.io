<script setup lang="ts">
import { ref, computed } from 'vue'

const angularVelocity = ref(0.0078125)
const isStopAnime = ref(false)
const isFocusEarth = ref(false)
const isLineActive = ref(true)

const rotationTimesPerOneSeconds = computed(
  () => Math.round(((angularVelocity.value * 60 * 365.24) / 360) * 100) / 100
)
const angularVelocityInAnime = computed(() =>
  isStopAnime.value ? 0 : angularVelocity.value
)

const switchAnime = () => {
  isStopAnime.value = !isStopAnime.value
}

const switchFocus = () => {
  isFocusEarth.value = !isFocusEarth.value
}

const switchLine = () => {
  isLineActive.value = !isLineActive.value
}
</script>

<template>
  <div
    class="flex flex-col sm:flex-row flex-wrap justify-around"
    @click="switchAnime"
  >
    <SunEarthMoonCanvas
      :angular-velocity="angularVelocityInAnime"
      :is-focus-earth="isFocusEarth"
      :is-line-active="isLineActive"
      class="my-1 corsor-pointer"
    />
    <MoonPhasesCanvas
      :angular-velocity="angularVelocityInAnime"
      class="my-1 corsor-pointer"
    />
  </div>
  <CanvasButton @click="switchFocus"> 視点切替 </CanvasButton>
  <CanvasButton @click="switchLine"> 補助線切替 </CanvasButton>
  <CanvasButton @click="switchAnime"> 停止（図をクリック） </CanvasButton>
  <p class="mt-4 mb-0">
    1秒あたりの地球の自転回数（≒地球上での経過日数）：
    {{ rotationTimesPerOneSeconds }}
  </p>
  <input
    v-model.number="angularVelocity"
    type="range"
    min="0.00390625"
    max="0.5"
    step="0.00390625"
    class="mt-0 w-full"
  />
</template>
