<template>
  <div>
    <GenericTable
      :is-loading="isLoading"
      :items="users"
      :columns="columns"
      :current-page="currentPage"
      :per-page="perPage"
      :show-pagination="true"
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
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useToast } from '@/composables/useToast'
import { useResponse } from '@/composables/useResponse'
import { usePagination } from '@/composables/usePagination'
import type { User } from '@/types/user'
import { getUsers } from '@/services/userService'

const { showToast } = useToast()
const { handleError } = useResponse()

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
} = usePagination(loadUsers, handleError, {
  autoLoad: true,
})

const handleView = (user: User) => showToast(`Viewing user: ${user.name}`, 'info')
const handleEdit = (user: User) => showToast(`Editing user: ${user.name}`, 'info')
const handleDelete = (user: User) => showToast(`Deleted user: ${user.name}`, 'success')
</script>
