<template>
  <input class="form-control" type="file" :accept="accept" @change="onChange" />
</template>

<script lang="ts" setup>
import { defineProps, defineEmits } from 'vue'

defineProps<{ accept?: string }>()
const emit = defineEmits<{
  (e: 'change', file: File | null): void
}>()

const onChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files && input.files.length > 0 ? input.files[0] : null
  emit('change', file)
}
</script>
