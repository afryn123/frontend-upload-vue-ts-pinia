import { defineStore } from 'pinia'
import axios from 'axios'

interface ReconciliationItem {
  id: number
  label_rekonsiliasi_fiskal: string
  nilai: number
  periode: string
}

export interface DataItem {
  ID: number
  CreatedAt: string
  UpdatedAt: string
  DeletedAt: string | null
  label_rekonsiliasi_fiskal: string
  periode: string
  nilai: number
}
interface ReconciliationResponse {
  status: boolean
  data?: {
    items: ReconciliationItem[]
    last_periode: string
    has_next: boolean
  }
  error?: string
}

export interface UploadLogError {
  row: number
  message: string
}

export interface UploadLog {
  ID: number
  file_name: string
  total_rows: number
  total_success: number
  total_failed: number
  CreatedAt: string
  error_json: UploadLogError[]
}

export const useReportStore = defineStore('dataStore', {
  state: () => ({
    data: [] as DataItem[],
    loading: false,
    error: '' as string | null,
  }),
  actions: {
    async fetchData() {
      this.loading = true
      this.error = null
      try {
        const res = await axios.get(`${import.meta.env.VITE_APP_API_URL}/getDataAll`)
        if (res.data.status) {
          this.data = res.data.data
        } else {
          this.error = 'Gagal mengambil data'
        }
      } catch (err: unknown) {
        this.error = err instanceof Error ? err.message : 'Terjadi kesalahan jaringan'
        console.error('Error fetching reconciliation data:', err)
      } finally {
        this.loading = false
      }
    },
  },
})

export const useUploadLogStore = defineStore('uploadLog', {
  state: () => ({
    logs: [] as UploadLog[],
    loading: false,
    error: null as string | null,
  }),
  actions: {
    async fetchLogs() {
      this.loading = true
      this.error = null
      try {
        const res = await axios.get(`${import.meta.env.VITE_APP_API_URL}/logUpload`)
        this.logs = res.data.data
      } catch (err: unknown) {
        this.error = err instanceof Error ? err.message : 'Terjadi kesalahan jaringan'
        console.error('Error fetching reconciliation data:', err)
      } finally {
        this.loading = false
      }
    },
    setLogs(logs: UploadLog[]) {
      this.logs = logs
    },
  },
})

export const useDataStore = defineStore('reconciliation', {
  state: () => ({
    items: [] as ReconciliationItem[],
    periods: [] as string[],
    lastPeriode: null as string | null,
    hasNext: false,
    isLoading: false,
    error: null as string | null,
  }),

  actions: {
    async fetchReconciliationData(): Promise<void> {
      this.isLoading = true
      this.error = null

      try {
        const { data }: { data: ReconciliationResponse } = await axios.get(
          `${import.meta.env.VITE_APP_API_URL}/getData`,
        )

        if (data.status && data.data) {
          this.items = data.data.items
          this.lastPeriode = data.data.last_periode
          this.hasNext = data.data.has_next
          this.updatePeriods()
        } else {
          this.error = data.error || 'Gagal mengambil data'
        }
      } catch (err: unknown) {
        this.error = err instanceof Error ? err.message : 'Terjadi kesalahan jaringan'
        console.error('Error fetching reconciliation data:', err)
      } finally {
        this.isLoading = false
      }
    },

    async fetchNextPage(): Promise<void> {
      if (!this.hasNext || this.isLoading || !this.lastPeriode) return

      this.isLoading = true
      this.error = null

      try {
        const { data }: { data: ReconciliationResponse } = await axios.get(
          `${import.meta.env.VITE_APP_API_URL}/getData`,
          {
            params: { last_periode: this.lastPeriode },
          },
        )

        if (data.status && data.data) {
          this.items = [...this.items, ...data.data.items]
          this.lastPeriode = data.data.last_periode
          this.hasNext = data.data.has_next
          this.updatePeriods()
        } else {
          this.error = data.error || 'Gagal mengambil halaman berikutnya'
        }
      } catch (err: unknown) {
        this.error = err instanceof Error ? err.message : 'Terjadi kesalahan jaringan'
        console.error('Error fetching next page:', err)
      } finally {
        this.isLoading = false
      }
    },

    updatePeriods(): void {
      const uniquePeriods = Array.from(new Set(this.items.map((item) => item.periode)))
      this.periods = uniquePeriods.sort()
    },
  },
})
