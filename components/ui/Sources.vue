<script setup lang="ts">
import { PropType } from 'vue'

const props = defineProps({
  title: { type: String, required: true },
  sources: {
    type: Array as PropType<
      { from: string; items: { name: string; url: string }[] }[]
    >,
    required: true,
  },
})
</script>

<template>
  <p class="text-[0.5rem]">
    <span>{{ title }}：</span>
    <SourceWithModal
      v-for="source in sources"
      :key="source.from"
      :source="source"
      class="mx-1"
    />
  </p>
</template>
