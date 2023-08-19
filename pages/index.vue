<script setup>
import { ref, computed } from 'vue'

const { data: posts } = await useAsyncData(
  'posts',
  () =>
    queryContent('posts')
      .sort({ date: -1 })
      .only(['_path', 'title', 'date', 'description'])
      .find(),
  { default: () => [] }
)

const { data: guidelines } = await useAsyncData(
  'guidelines',
  () =>
    queryContent('guidelines')
      .sort({ sortNo: 1 })
      .only(['_path', 'title', 'description'])
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
    class="p-2 w-full h-10 rounded outline-none border-2 border-gray ease-out duration-100 focus:border-primary"
    @input="search"
  />

  <PostList :posts="filteredPosts" />
  <hr class="my-8" />
  <PostList v-if="!keyword" :posts="guidelines" small />
</template>
