// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  components: [{
    path: '@/components',
    pathPrefix: false,
  }],
  modules: [
    '@nuxt/content',
    '@nuxtjs/tailwindcss'
  ],
  nitro: {
    prerender: {
      crawlLinks: true,
    }
  },
  content: {
    markdown: {
      remarkPlugins: [
        'remark-breaks',
      ]
    },
    highlight: {
      preload: [
        'ruby',
        'js',
        'ts',
        'json'
      ]
    }
  },
})
