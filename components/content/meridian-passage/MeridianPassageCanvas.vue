<script setup lang="ts">
import { ref, Ref, toRefs, PropType, onMounted, onUnmounted } from 'vue'
import MeridianPassageThree from './meridianPassageThree'

const canvas = ref(null)
const three: Ref<MeridianPassageThree | undefined> = ref(undefined)

const props = defineProps({
  latitude: { type: Number, required: true },
  degreePer: { type: Number, required: true },
  totalScrollVertical: { type: Number, required: true },
  totalScrollHorizontal: { type: Number, required: true },
  pointerDragOn: {
    type: Function as PropType<(e: PointerEvent) => void>,
    required: true,
  },
  pointerDragOff: {
    type: Function as PropType<(e: PointerEvent) => void>,
    required: true,
  },
  onPointerMove: {
    type: Function as PropType<(e: PointerEvent) => void>,
    required: true,
  },
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
  three.value = markRaw(new MeridianPassageThree(element))
  three.value.animate()
})

onUnmounted(() => {
  three.value!.cancel()
})
</script>

<template>
  <canvas
    ref="canvas"
    width="600"
    height="300"
    class="w-full max-h-[38vh] touch-none"
    @pointerdown="pointerDragOn"
    @pointerup="pointerDragOff"
    @pointerout="pointerDragOff"
    @pointermove="onPointerMove"
  />
</template>
