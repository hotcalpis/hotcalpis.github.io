<script setup lang="ts">
import { ref, type PropType } from 'vue'

const isShowModal = ref(false)

const props = defineProps({
  source: {
    type: Object as PropType<{
      from: string
      items: { name: string; url: string }[]
    }>,
    required: true,
  },
})
</script>

<template>
  <span>
    <span class="text-primary cursor-pointer" @click="isShowModal = true">
      {{ source.from }}
    </span>
    <Modal :is-show="isShowModal" class="inline" @close="isShowModal = false">
      <template #header>
        <h3 class="my-0 text-xl">出典：{{ source.from }}</h3>
      </template>
      <template #body>
        <div v-for="item in source.items" :key="item.name" class="my-3">
          <h4 class="mt-0 text-sm">{{ item.name }}</h4>
          <a
            target="_blank"
            rel="noopener noreferrer"
            :href="item.url"
            class="text-xs"
            >{{ item.url }}</a
          >
        </div>
      </template>
    </Modal>
  </span>
</template>
