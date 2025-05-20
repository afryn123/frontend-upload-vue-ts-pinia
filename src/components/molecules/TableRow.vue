<template>
  <tr>
    <td class="text-center sticky-col left-col">{{ index + 1 }}</td>
    <td class="sticky-col label-col">{{ label }}</td>
    <td v-for="(date, idx) in headers" :key="idx" class="text-end">
      {{ formatCurrency(getValue(date)) }}
    </td>
  </tr>
</template>

<script setup lang="ts">
interface Props {
  index: number
  label: string
  headers: string[]
  getValue: (date: string) => number | null
}

defineProps<Props>()

const formatCurrency = (value: number | null): string => {
  if (value === null || value === undefined) return ''
  return new Intl.NumberFormat('id-ID').format(value)
}
</script>
