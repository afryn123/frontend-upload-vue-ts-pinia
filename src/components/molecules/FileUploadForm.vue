<template>
  <div>
    <BaseInput type="file" accept=".xlsx" @change="onChange" />
    <a :href="templateLink" download class="btn btn-link">📥 Download Template Excel</a>
  </div>
</template>

<script lang="ts" setup>
import BaseInput from '@/components/atoms/BaseInput.vue'
const emit = defineEmits(['file-selected'])

const onChange = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) emit('file-selected', file)
}

const templateLink = new URL('@/assets/template.xlsx', import.meta.url).href
</script>
