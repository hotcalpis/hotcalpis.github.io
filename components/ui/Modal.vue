<script setup lang="ts">
const props = defineProps({
  isShow: { type: Boolean, required: true },
})
</script>

<template>
  <transition name="modal">
    <!-- TODO: dialogタグにしたい -->
    <div
      v-if="isShow"
      class="fixed table z-50 top-0 left-0 w-screen h-[100lvh] bg-black/50"
    >
      <div class="table-cell align-middle" @click.self="$emit('close')">
        <div
          class="mx-auto py-3 px-6 w-[90%] sm:w-2/3 lg:w-1/2 max-w-[90vw] max-h-[90vh] overflow-scroll bg-white shadow-sm rounded"
        >
          <div class="flex justify-between items-end">
            <slot name="header" />
            <span
              class="flex justify-end text-3xl text-slate-400 cursor-pointer hover:opacity-50"
              @click.self="$emit('close')"
            >
              ×
            </span>
          </div>

          <div class="my-6 break-words">
            <slot name="body" />
          </div>

          <div>
            <slot name="footer" />
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s;
}

.modal-enter,
.modal-leave-to {
  opacity: 0;
}
</style>
