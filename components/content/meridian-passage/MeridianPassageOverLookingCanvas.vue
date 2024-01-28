<script setup lang="ts">
import { ref, type Ref, toRefs, onMounted, onUnmounted } from 'vue'
import MeridianPassageOverLookingThree from './meridianPassageOverLookingThree'

const canvas = ref(null)
const three: Ref<MeridianPassageOverLookingThree | undefined> = ref(undefined)

const props = defineProps({
  latitude: { type: Number, required: true },
  degreePer: { type: Number, required: true },
  totalScrollVertical: { type: Number, required: true },
  totalScrollHorizontal: { type: Number, required: true },
})
const { latitude, degreePer, totalScrollVertical, totalScrollHorizontal } =
  toRefs(props)

watch(latitude, () => {
  three.value!.changeLatitude(latitude.value)
})
watch(degreePer, () => {
  three.value!.changeDegreePer(degreePer.value)
})
watch(totalScrollVertical, () => {
  three.value!.totalScrollVertical = totalScrollVertical.value
})
watch(totalScrollHorizontal, () => {
  three.value!.totalScrollHorizontal = totalScrollHorizontal.value
})

onMounted(() => {
  const element = canvas.value! as HTMLCanvasElement
  // https://github.com/vuejs/core/issues/3024
  three.value = markRaw(new MeridianPassageOverLookingThree(element))
  three.value.animate()
})

onUnmounted(() => {
  three.value!.cancel()
})
</script>

<template>
  <canvas ref="canvas" width="600" height="300" class="w-full max-h-[38vh]" />
</template>
