<template>
  <div class="modal fade show d-block" tabindex="-1" role="dialog" v-if="show">
    <div class="modal-dialog modal-xl modal-dialog-scrollable" role="document">
      <div class="modal-content">
        <ModalHeader title="Riwayat Log Upload" @close="emit('close')" />
        <div class="modal-body">
          <div v-for="(log, index) in logs" :key="log.ID" class="mb-4 border rounded p-3">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <h6><i class="bi bi-pencil-square me-1"></i> {{ log.file_name }}</h6>
                <p class="mb-1">
                  <i class="bi bi-bar-chart-fill"></i> Total Rows: {{ log.total_rows }} |
                  <span class="text-success">✔ {{ log.total_success }}</span> |
                  <span class="text-danger">✖ {{ log.total_failed }}</span>
                </p>
                <p><i class="bi bi-calendar-event"></i> {{ formatDate(log.CreatedAt) }}</p>
              </div>
              <button class="btn btn-sm btn-outline-secondary" @click="toggle(index)">
                {{ expanded[index] ? '▲' : '▼' }}
              </button>
            </div>

            <div v-if="expanded[index]" class="mt-3">
              <table class="table table-sm table-bordered text-center">
                <thead class="table-light">
                  <tr>
                    <th>Row</th>
                    <th>Message</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(error, i) in log.error_json" :key="i">
                    <td>{{ error.row }}</td>
                    <td>{{ error.message }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <Button className="btn btn-secondary" @click="$emit('close')">Tutup</Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import ModalHeader from '@/components/molecules/ModalHeader.vue'
import Button from '@/components/atoms/BaseButton.vue'

interface UploadError {
  row: number
  message: string
}

interface UploadLog {
  ID: number | string
  file_name: string
  total_rows: number
  total_success: number
  total_failed: number
  CreatedAt: string
  error_json: UploadError[]
}

interface Props {
  show: boolean
  logs: UploadLog[]
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'close'): void
}>()

const expanded = ref<boolean[]>([])

watch(
  () => props.logs,
  () => {
    expanded.value = props.logs.map(() => false)
  },
  { immediate: true },
)

const toggle = (idx: number) => {
  expanded.value[idx] = !expanded.value[idx]
}

const formatDate = (datetime: string): string => {
  const date = new Date(datetime)
  return isNaN(date.getTime())
    ? '-'
    : new Intl.DateTimeFormat('id-ID', {
        dateStyle: 'short',
        timeStyle: 'short',
      }).format(date)
}
</script>
