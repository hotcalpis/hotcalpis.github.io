<template>
  <div class="pb-20 border-b-2 border-primary">
    <ContentDoc v-slot="{ doc }">
      <ContentRenderer :value="doc">
        <div class="mt-14 mb-12 pb-3 border-b-2 border-primary">
          <p class="mt-2 text-sm text-gray-400">
            {{ doc.date }}
          </p>
          <h1 class="mt-1 text-3xl sm:text-4xl font-bold">{{ doc.title }}</h1>
        </div>

        <ContentRendererMarkdown :value="doc" class="prose" />
      </ContentRenderer>
    </ContentDoc>
  </div>

  <PostNavigation class="mt-7" />
</template>
