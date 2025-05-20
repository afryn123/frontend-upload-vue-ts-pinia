<template>
  <div class="table-responsive" ref="tableContainer" @scroll="onScroll">
    <table class="table table-bordered">
      <TableHeader :headers="headers" />
      <tbody>
        <TableRow :index="0" label="Laba Sebelum Pajak" :headers="headers" :getValue="getValue" />
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import TableHeader from '@/components/molecules/TableHeader.vue'
import TableRow from '@/components/molecules/TableRow.vue'

interface Props {
  headers: string[]
  getValue: (date: string) => number | null
  onLoadMore?: () => void
  loading: boolean
}

const props = defineProps<Props>()

const tableContainer = ref<HTMLElement | null>(null)

const onScroll = () => {
  const container = tableContainer.value
  if (!container) return

  const scrollRight = container.scrollWidth - container.clientWidth - container.scrollLeft

  if (scrollRight < 100 && !props.loading) {
    props.onLoadMore?.()
  }
}
</script>
