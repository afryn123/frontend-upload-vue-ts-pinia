<template>
  <thead class="table-success">
    <tr>
      <th class="text-center align-middle sticky-col left-col">No</th>
      <th class="text-center align-middle sticky-col label-col">Label Rekonsiliasi</th>
      <th v-for="(date, idx) in headers" :key="idx" class="text-center align-middle">
        {{ formatDate(date) }}
      </th>
    </tr>
  </thead>
</template>

<script setup lang="ts">
interface Props {
  headers: string[]
}

defineProps<Props>()

const formatDate = (dateString: string): string => {
  if (!dateString) return ''
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return '' // validasi tanggal

  return new Intl.DateTimeFormat('id-ID', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
    .format(date)
    .replace(/\//g, '-')
}
</script>
