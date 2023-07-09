<script setup>
import { computed } from 'vue'

const route = useRoute()
const path = route.path

const { data: surrounds } = await useAsyncData(`${path}_surround`, () => {
  return queryContent()
    .sort({ date: 1 })
    .only(['_path', 'title'])
    .findSurround(path)
})
const prev = computed(() => surrounds.value?.[0])
const next = computed(() => surrounds.value?.[1])
</script>

<template>
  <div v-if="prev || next" class="flex justify-between">
    <div class="w-2/5">
      <NuxtLink v-if="prev" :to="prev._path" class="flex flex-col">
        <div class="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            viewBox="0 0 24 24"
            fill="none"
            class="w-2 stroke-gray-400"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M15 4l-8 8 8 8" />
          </svg>
          <span class="mx-1 text-xs text-gray-500">Previous</span>
        </div>
        <div class="mt-1 line-clamp-2 text-primary">
          {{ prev.title }}
        </div>
      </NuxtLink>
    </div>
    <div class="w-2/5">
      <NuxtLink v-if="next" :to="next._path" class="flex flex-col">
        <div class="flex justify-end items-center">
          <span class="mx-1 text-xs text-gray-500">Next</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            viewBox="0 0 24 24"
            fill="none"
            class="w-2 stroke-gray-400"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M8 4l8 8-8 8" />
          </svg>
        </div>
        <div class="flex justify-end">
          <span class="mt-1 line-clamp-2 text-primary">{{ next.title }}</span>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>
