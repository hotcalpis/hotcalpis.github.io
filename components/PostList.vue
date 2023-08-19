<script setup lang="ts">
interface Props {
  posts: {
    _path: string
    title: string
    date?: string
  }[]
  small: boolean
}

const props = withDefaults(defineProps<Props>(), {
  posts: () => [],
  small: false,
})
</script>

<template>
  <p v-for="post in posts" :key="post.title" :class="{ 'mt-7': !small }">
    <NuxtLink :to="post._path" class="ease-out duration-200 hover:text-primary">
      <span
        class="align-middle font-bold"
        :class="[small ? 'text-sm' : 'text-xl']"
        >{{ post.title }}</span
      >
      <span
        v-if="post.date"
        class="align-middle font-medium text-gray-400"
        :class="{ 'text-sm': small }"
      >
        - {{ post.date }}</span
      >
    </NuxtLink>
  </p>
</template>
