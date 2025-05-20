<template>
  <div
    v-if="show"
    class="modal d-block"
    style="background-color: rgba(0, 0, 0, 0.5)"
    role="dialog"
    aria-modal="true"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <ModalHeader title="Upload File Excel" @close="close" />
        <div class="modal-body">
          <div class="mb-3">
            <label for="formFile" class="form-label">Pilih File Excel</label>
            <FileInput accept=".xlsx" @change="handleFile" />
          </div>
          <div>
            <a v-if="templateLink" :href="templateLink" download class="btn btn-link">
              📥 Download Template Excel
            </a>
          </div>
        </div>
        <div class="modal-footer">
          <Button className="btn btn-secondary" @click="close">Tutup</Button>
          <Button className="btn btn-primary" @click="upload" :disabled="!file">Upload</Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'

import ModalHeader from '@/components/molecules/ModalHeader.vue'
import FileInput from '@/components/atoms/BaseInput.vue'
import Button from '@/components/atoms/BaseButton.vue'

interface Props {
  templateLink?: string
  show: boolean
}
defineProps<Props>()

const emit = defineEmits<{
  (e: 'uploaded'): void
  (e: 'close'): void
}>()

const file = ref<File | null>(null)

const handleFile = (fileSelected: File | null) => {
  file.value = fileSelected
}

const upload = async () => {
  if (!file.value) {
    alert('Silakan pilih file terlebih dahulu.')
    return
  }

  const formData = new FormData()
  formData.append('file', file.value)

  try {
    const res = await axios.post(`${import.meta.env.VITE_APP_API_URL}/uploadData`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    alert('Upload berhasil: ' + res.data.message)
    file.value = null
    emit('uploaded')
    close()
  } catch (err) {
    const message = axios.isAxiosError(err)
      ? err.response?.data?.message || err.message
      : 'Terjadi kesalahan saat mengunggah file.'
    alert(`Upload gagal: ${message}`)
  }
}

const close = () => {
  emit('close')
}
</script>

<style scoped>
/* Opsional: membuat modal berada di atas segalanya */
.modal {
  z-index: 1050;
}
</style>
