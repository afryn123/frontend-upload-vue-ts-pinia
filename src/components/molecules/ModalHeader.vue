<template>
  <div class="modal-header">
    <h5 class="modal-title">{{ title }}</h5>
    <button type="button" class="btn-close" @click="emit('close')" aria-label="Close"></button>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title?: string
}

defineProps<Props>()

// Define emitted events type supaya TS aware
const emit = defineEmits<{
  (e: 'close'): void
}>()
</script>
