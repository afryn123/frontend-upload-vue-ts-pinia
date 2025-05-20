<template>
  <button :class="className" @click="emit('click')" type="button">
    <slot />
  </button>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits } from 'vue'

defineProps<{ className?: string }>()
const emit = defineEmits<{
  (e: 'click'): void
}>()
</script>
