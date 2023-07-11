<script setup>
import { ref, computed } from 'vue'

const { data: posts } = await useAsyncData(
  'posts',
  () =>
    queryContent()
      .sort({ date: -1 })
      .only(['_path', 'title', 'date', 'description'])
      .find(),
  { default: () => [] }
)

const keyword = ref('')
const filteredPosts = computed(() =>
  posts.value.filter(
    (post) =>
      // TODO: 本文検索
      post.title.includes(keyword.value) ||
      post.description.includes(keyword.value)
  )
)
</script>

<template>
  <input
    v-model="keyword"
    type="search"
    :placeholder="`Search from ${posts.length} posts...`"
    class="p-2 w-full h-10 rounded outline-none border-2 border-gray focus:border-primary"
    @input="search"
  />

  <p
    v-for="post in filteredPosts"
    :key="post.title"
    class="mt-8 hover:text-primary"
  >
    <NuxtLink :to="post._path">
      <span class="align-middle text-2xl font-bold">{{ post.title }}</span>
      <span class="align-middle font-medium text-gray-400">
        - {{ post.date }}</span
      >
    </NuxtLink>
  </p>
</template>
