<template>
  <div class="container-fluid">
    <!-- Header -->
    <div class="row mt-4 mb-3">
      <div class="col">
        <h2>Laba Sebelum Pajak Penghasilan</h2>
      </div>
      <div class="col-auto">
        <Button className="btn btn-outline-success" @click="openUploadModal"> Upload </Button>
      </div>
      <div class="col-auto">
        <Button className="btn btn-outline-success" @click="openLogModal"> Log Upload </Button>
      </div>
      <div class="col-auto">
        <Button className="btn btn-success" @click="exportToExcel"> Export Hasil </Button>
      </div>
    </div>

    <UploadModal
      :templateLink="templateLink"
      :show="showUploadModal"
      @uploaded="onUploadSuccess"
      @close="showUploadModal = false"
    />

    <LogModal :show="showLogModal" :logs="logStore.logs" @close="showLogModal = false" />

    <DataTable
      :headers="tableHeaders"
      :getValue="getValueForDate"
      :onLoadMore="fetchNextPage"
      :loading="isLoading"
    />

    <Spinner :show="isLoading" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useDataStore, useUploadLogStore, useReportStore } from '@/stores/dataStore'

import Button from '@/components/atoms/BaseButton.vue'
import UploadModal from '@/components/organisms/UploadModal.vue'
import LogModal from '@/components/organisms/LogModal.vue'
import DataTable from '@/components/organisms/DataTable.vue'
import Spinner from '@/components/atoms/BaseSpinner.vue'
import * as XLSX from 'xlsx'

const showUploadModal = ref<boolean>(false)
const showLogModal = ref<boolean>(false)

const store = useDataStore()
const logStore = useUploadLogStore()
const reportStore = useReportStore()

const templateLink = new URL('@/assets/template.xlsx', import.meta.url).href

const tableHeaders = computed(() => store.periods)
const isLoading = computed(() => store.isLoading)

const openLogModal = async (): Promise<void> => {
  await logStore.fetchLogs()
  showLogModal.value = true
}
const openUploadModal = async (): Promise<void> => {
  showUploadModal.value = true
}

const onUploadSuccess = (): void => {
  store.fetchReconciliationData()
}

// Get value per column
const getValueForDate = (date: string): number | null => {
  const item = store.items.find((item) => item.periode === date)
  return item?.nilai ?? null
}

const fetchNextPage = async (): Promise<void> => {
  await store.fetchNextPage()
}

const exportToExcel = async (): Promise<void> => {
  await reportStore.fetchData()
  const periods = Array.from(new Set(reportStore.data.map((d) => d.periode))).sort()

  const labels = Array.from(new Set(reportStore.data.map((d) => d.label_rekonsiliasi_fiskal)))

  const pivotMap: Record<string, Record<string, number>> = {}

  labels.forEach((label) => {
    pivotMap[label] = {}
  })

  reportStore.data.forEach((item) => {
    pivotMap[item.label_rekonsiliasi_fiskal][item.periode] = item.nilai
  })

  const worksheetData = [
    ['Label Rekonsiliasi Fiskal', ...periods],
    ...labels.map((label) => [label, ...periods.map((p) => pivotMap[label][p] ?? '')]),
  ]

  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Laba Sebelum Pajak')

  XLSX.writeFile(workbook, 'data-laba-sebelum-pajak.xlsx')
}

onMounted(() => {
  store.fetchReconciliationData()
})
</script>
