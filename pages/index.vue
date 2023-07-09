<script setup>
import { ref } from 'vue'

const keyword = ref('')
const { data: posts } = await useAsyncData(
  'posts',
  () =>
    queryContent()
      .where({
        $or: [
          { title: { $regex: `/${keyword.value}/ig` } },
          { description: { $regex: `/${keyword.value}/ig` } },
          // TODO: body
        ],
      })
      .sort({ date: -1 })
      .only(['_path', 'title', 'date'])
      .find(),
  { default: () => [], watch: [keyword] }
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

  <p v-for="post in posts" :key="post.title" class="mt-8 hover:text-primary">
    <NuxtLink :to="post._path">
      <span class="align-middle text-2xl font-bold">{{ post.title }}</span>
      <span class="align-middle font-medium text-gray-400">
        - {{ post.date }}</span
      >
    </NuxtLink>
  </p>
</template>
