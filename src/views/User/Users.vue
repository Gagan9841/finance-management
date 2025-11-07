<template>
  <div>
    <GenericTable
      :is-loading="isLoading"
      :items="users"
      :columns="columns"
      :current-page="currentPage"
      :per-page="perPage"
      :show-pagination="true"
      @create-new="handleCreateNew"
      @edit="handleEdit"
      @delete="handleDelete"
      @view-details="handleView"
    >
      <template #pagination>
        <PaginationWrapper
          v-model:current-page="currentPage"
          v-model:items-per-page="perPage"
          :items="users"
          :total-items="totalItems"
        />
      </template>
    </GenericTable>
    <DynamicForm :fields="fields" :api-slug="apiSlug" :form-title="formTitle" @refresh="refresh" />
  </div>
</template>

<script setup lang="ts">
import { ref, inject } from 'vue'
import { useToast } from '@/composables/useToast'
import { useResponse } from '@/composables/useResponse'
import { usePagination } from '@/composables/usePagination'
import type { User } from '@/types/user'
import { getUsers } from '@/services/userService'
import type { Fields } from '@/types/form'

const { showToast } = useToast()
const { handleError } = useResponse()

const emitter: any = inject('emitter')

const fields = ref<Fields[]>([
  { name: 'name', label: 'Name', type: 'text', required: true },
  { name: 'email', label: 'Email', type: 'text', required: true },
  { name: 'password', label: 'Password', type: 'password', required: true },
  { name: 'confirmPassword', label: 'Confirm Password', type: 'password', required: true },
])

const apiSlug = ref('auth/register')
const formTitle = ref('User')

const columns = ref([
  { key: 'name', heading: 'Name' },
  { key: 'email', heading: 'Email' },
])

const loadUsers = async (params: Record<string, any>) => {
  const response = await getUsers(params)
  return response
}

const {
  items: users,
  isLoading,
  currentPage,
  perPage,
  totalItems,
  refresh,
} = usePagination(loadUsers, handleError, {
  autoLoad: true,
})

const handleView = (item: Record<string, unknown>) => {
  const user = item as unknown as User
  showToast(`Viewing user: ${user.name}`, 'info')
}
const handleEdit = (item: Record<string, unknown>) => {
  const user = item as unknown as User
  emitter.emit('edit', user)
}
const handleDelete = (item: Record<string, unknown>) => {
  const user = item as unknown as User
  showToast(`Deleted user: ${user.name}`, 'success')
}
const handleCreateNew = () => {
  emitter.emit('create')
}
</script>
