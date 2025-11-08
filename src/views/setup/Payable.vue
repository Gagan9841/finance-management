<template>
  <div>
    <GenericTable
      :is-loading="isLoading"
      :items="payables"
      :columns="columns"
      :current-page="currentPage"
      :per-page="perPage"
      :show-pagination="true"
      :page-load="loadPage"
      @create-new="handleCreateNew"
      @edit="handleEdit"
      @delete="handleDelete"
      @view-details="handleView"
    >
      <template #pagination>
        <PaginationWrapper
          v-model:current-page="currentPage"
          v-model:items-per-page="perPage"
          :items="payables"
          :total-items="totalItems"
        />
      </template>
    </GenericTable>
    <DynamicForm :fields="fields" :api-slug="apiSlug" :form-title="formTitle" @refresh="refresh" />
  </div>
</template>

<script setup lang="ts">
import { usePagination } from '@/composables/usePagination'
import { useResponse } from '@/composables/useResponse'
import { getPayables } from '@/services/payableService'
import type { Fields } from '@/types/form'
import { inject, ref } from 'vue'

const { handleError } = useResponse()

const emitter: any = inject('emitter')

const fields = ref<Fields[]>([
  { name: 'name', label: 'Name', type: 'text' },
  { name: 'description', label: 'Description', type: 'text' },
  {
    name: 'status',
    label: 'Status',
    type: 'select',
    placeholder: 'Select Status',
    options: [
      { label: 'Active', value: 1 },
      { label: 'Inactive', value: 0 },
    ],
  },
  {
    name: 'priority',
    label: 'Priority',
    type: 'select',
    placeholder: 'Select Priority',
    options: [
      { label: 'Low', value: 1 },
      { label: 'Medium', value: 2 },
      { label: 'High', value: 3 },
    ],
  },
  {
    name: 'type',
    label: 'Type',
    type: 'select',
    placeholder: 'Select Type',
    options: [
      { label: 'Company', value: 1 },
      { label: 'Individual', value: 2 },
      { label: 'Other', value: 3 },
    ],
  },
  {
    name: 'account_id',
    label: 'Account ID',
    type: 'text',
    placeholder: 'Enter Account ID',
  },
  { name: 'notes', label: 'Notes', type: 'text', placeholder: 'Enter Notes' },
])

const apiSlug = ref('payables')
const formTitle = ref('Payable')

const columns = ref([
  { key: 'name', heading: 'Name' },
  { key: 'account_id', heading: 'Account ID' },
  { key: 'notes', heading: 'Notes' },
  { key: 'description', heading: 'Description' },
  {
    key: 'status',
    heading: 'Status',
    statusMap: {
      0: { label: 'Inactive', class: 'bg-red-100 text-red-800' },
      1: { label: 'Active', class: 'bg-green-300 text-green-800' },
    },
  },
  {
    key: 'priority',
    heading: 'Priority',
    statusMap: {
      1: { label: 'Low', class: 'bg-blue-100 text-blue-800' },
      2: { label: 'Medium', class: 'bg-yellow-100 text-yellow-800' },
      3: { label: 'High', class: 'bg-red-100 text-red-800' },
    },
  },
  {
    key: 'type',
    heading: 'Type',
    statusMap: {
      1: { label: 'Company', class: 'bg-blue-100 text-blue-800' },
      2: { label: 'Individual', class: 'bg-yellow-100 text-yellow-800' },
      3: { label: 'Other', class: 'bg-red-100 text-red-800' },
    },
  },
])

const loadPayables = async (params: Record<string, unknown>) => {
  const response = await getPayables(params)
  return response
}

const {
  items: payables,
  isLoading,
  currentPage,
  perPage,
  totalItems,
  refresh,
  loadPage,
} = usePagination(loadPayables, handleError, {
  autoLoad: true,
})

const handleCreateNew = () => {
  emitter.emit('create')
}

const handleEdit = (item: Record<string, unknown>) => {
  emitter.emit('edit', item)
}

const handleDelete = (item: Record<string, unknown>) => {
  emitter.emit('delete', item)
}

const handleView = (item: Record<string, unknown>) => {
  emitter.emit('view', item)
}
</script>
