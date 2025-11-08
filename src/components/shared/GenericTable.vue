<template>
  <div class="flex justify-between items-center">
    <div v-if="enableSearch || $slots['filters'] || $slots['actions']" class="p-3 border-b bg-card">
      <div class="flex items-center gap-4 justify-between">
        <div class="flex items-center space-x-4">
          <div v-if="enableSearch" class="relative">
            <Input
              v-model="searchQuery"
              :placeholder="searchPlaceholder"
              class="pl-10 w-64 pr-4"
              :disabled="isLoading"
              @input="handleSearch"
            />
            <Iconify
              icon="lucide:search"
              class="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4"
            />
          </div>
          <slot
            name="filters"
            :apply-filters="applyFilters"
            :clear-filters="clearFilters"
            :is-loading="isLoading"
          >
            <Button
              v-if="!$slots['filters']"
              variant="outline"
              class="cursor-pointer"
              size="sm"
              @click="toggleFilters"
            >
              <Iconify icon="lucide:filter" class="w-4 h-4 mr-1" />
              <Badge v-if="Object.keys(localFilters).length > 0" variant="secondary" class="ml-2">
                {{ Object.keys(localFilters).length }}
              </Badge>
            </Button>
          </slot>
        </div>
        <slot name="actions" :is-loading="isLoading">
          <Button
            variant="outline"
            class="cursor-pointer"
            size="sm"
            :disabled="isLoading"
            @click="$emit('export')"
          >
            <Iconify icon="lucide:download" class="w-4 h-4 mr-1" />
          </Button>
        </slot>
      </div>
    </div>

    <div v-if="showFiltersDropdown" class="p-4 border-b bg-muted/50">
      <div class="grid gap-4 md:grid-cols-3">
        <FormField v-for="filter in availableFilters" :key="filter.key" :name="filter.key">
          <FormItem>
            <FormLabel>{{ filter.label }}</FormLabel>
            <FormControl>
              <Select v-model="localFilters[filter.key]">
                <SelectTrigger>
                  <SelectValue :placeholder="`Select ${filter.label.toLowerCase()}`" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    v-for="option in filter.options"
                    :key="option.value"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
          </FormItem>
        </FormField>
      </div>
      <div class="flex justify-end space-x-2 mt-4">
        <Button variant="outline" size="sm" @click="clearFilters"> Clear All </Button>
        <Button size="sm" :disabled="isLoading" @click="applyFilters"> Apply Filters </Button>
      </div>
    </div>
    <div class="flex justify-end space-x-2 mt-4">
      <slot name="actions" />
      <Button v-if="isCreateNewEnabled" size="sm" @click="$emit('create-new')">
        <Iconify icon="lucide:plus" class="w-4 h-4 mr-1" />
        Create New
      </Button>
    </div>
  </div>

  <div class="space-y-4">
    <div v-if="$slots.header" class="px-6 py-4 border-b bg-card rounded-t-lg">
      <slot name="header" />
    </div>

    <div class="rounded-lg border bg-card shadow-sm overflow-hidden">
      <div class="gen-table h-[calc(100vh-320px)] relative overflow-auto">
        <ShadcnTable class="w-full">
          <TableHeader class="sticky top-0 z-10 bg-muted/40 border-b backdrop-blur-sm">
            <TableRow class="hover:bg-transparent">
              <TableHead
                class="sticky top-0 z-10 text-left p-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide bg-muted/40 backdrop-blur-sm"
              >
                SN
              </TableHead>
              <template v-for="column in columns" :key="column.key">
                <TableHead
                  class="sticky top-0 z-10 text-left p-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide bg-muted/40 backdrop-blur-sm"
                  :class="column.headerClass"
                >
                  <slot :name="`thead-${column.key}`">
                    {{ column.heading }}
                  </slot>
                </TableHead>
              </template>
              <TableHead
                v-if="showActionsColumn"
                class="sticky top-0 z-10 text-right p-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide bg-muted/40 backdrop-blur-sm"
              >
                <slot name="thead-actions"></slot>
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            <TableRow v-if="isLoading" class="animate-pulse">
              <TableCell :colspan="totalColumns" class="text-center py-12">
                <div class="flex items-center justify-center gap-2">
                  <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                  <slot name="loading">Loading data...</slot>
                </div>
              </TableCell>
            </TableRow>

            <TableRow v-else-if="!items.length">
              <TableCell :colspan="totalColumns" class="text-center py-16">
                <div class="flex flex-col items-center justify-center gap-3 text-muted-foreground">
                  <Iconify icon="lucide:file-text" class="w-10 h-10 opacity-40" />
                  <div>
                    <p class="text-sm font-medium">No data available</p>
                    <slot name="empty">
                      <p class="text-xs text-muted-foreground/60">
                        Try adjusting your filters or creating new records
                      </p>
                    </slot>
                  </div>
                </div>
              </TableCell>
            </TableRow>

            <TableRow
              v-for="(item, index) in items"
              :key="getItemKey(item)"
              class="border-b hover:bg-secondary/5 transition-colors duration-150 group"
            >
              <TableCell class="p-3 text-sm font-medium text-muted-foreground w-12">
                {{ showPagination ? (currentPage - 1) * perPage + index + 1 : index + 1 }}
              </TableCell>

              <template v-for="column in columns" :key="column.key">
                <TableCell class="p-3 text-sm" :class="column.cellClass">
                  <slot
                    :name="`cell-${column.key}`"
                    :item="item"
                    :value="getItemValue(item, column.key)"
                  >
                    <template v-if="column.statusMap || column.key === 'status'">
                      <span
                        :class="[
                          'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium',
                          getStatusClass(getItemValue(item, column.key), column),
                        ]"
                      >
                        {{ getStatusLabel(getItemValue(item, column.key), column) }}
                      </span>
                    </template>
                    <template v-else>
                      <div
                        class="truncate max-w-xs"
                        :title="String(getItemValue(item, column.key))"
                      >
                        {{ getItemValue(item, column.key) }}
                      </div>
                    </template>
                  </slot>
                </TableCell>
              </template>

              <TableCell v-if="showActionsColumn" class="p-3">
                <div
                  class="flex justify-end items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150"
                >
                  <template
                    v-if="actionConfig.extraActionsPosition === 'before' && $slots['extra-actions']"
                  >
                    <slot name="extra-actions" :item="item" />
                  </template>

                  <template v-if="actionConfig.view.show">
                    <Button
                      variant="ghost"
                      size="icon"
                      class="h-8 w-8 hover:bg-primary/10 hover:text-primary cursor-pointer transition-colors duration-150"
                      :title="actionConfig.view.title"
                      @click="handleViewDetails(item)"
                    >
                      <Iconify icon="lucide:eye" class="w-4 h-4" />
                    </Button>
                  </template>

                  <template v-if="actionConfig.edit.show">
                    <Button
                      variant="ghost"
                      size="icon"
                      class="h-8 w-8 hover:bg-amber-100/20 hover:text-amber-600 cursor-pointer transition-colors duration-150"
                      :title="actionConfig.edit.title"
                      @click="handleEdit(item)"
                    >
                      <Iconify icon="lucide:edit" class="w-4 h-4" />
                    </Button>
                  </template>

                  <template v-if="actionConfig.delete.show">
                    <Button
                      variant="ghost"
                      size="icon"
                      class="h-8 w-8 hover:bg-destructive/10 hover:text-destructive cursor-pointer transition-colors duration-150"
                      :title="actionConfig.delete.title"
                      @click="handleDelete(item)"
                    >
                      <Iconify icon="lucide:trash" class="w-4 h-4" />
                    </Button>
                  </template>

                  <template
                    v-if="actionConfig.extraActionsPosition === 'after' && $slots['extra-actions']"
                  >
                    <slot name="extra-actions" :item="item" />
                  </template>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </ShadcnTable>
      </div>

      <div v-if="showPagination && $slots.pagination" class="p-4 border-t">
        <slot name="pagination" />
      </div>
    </div>
  </div>

  <Confirmation
    :is-open="showConfirmationDialog"
    @update:is-open="showConfirmationDialog = $event"
    @confirm="confirmDelete"
    @cancel="cancelDelete"
  />
</template>

<script setup lang="ts">
import { computed, ref, provide, reactive, watch, getCurrentInstance } from 'vue'

import {
  Table as ShadcnTable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import debounce from '@/utils/debounce'
import { FormField } from '../ui/form'

interface StatusMapItem {
  label: string
  class: string
}

interface Column {
  key: string
  heading: string
  headerClass?: string
  cellClass?: string
  statusMap?: Record<string | number, StatusMapItem>
}

interface ActionItem {
  show: boolean
  icon?: string
  title?: string
}

interface ActionConfig {
  view: ActionItem
  edit: ActionItem
  delete: ActionItem
  extraActionsPosition: 'before' | 'after'
}

interface FilterOption {
  value: string
  label: string
}

interface Filter {
  key: string
  label: string
  options: FilterOption[]
}

const searchQuery = ref('')
const localFilters = ref<Record<string, string>>({})

interface Props {
  columns: Column[]
  items: Record<string, unknown>[]
  isLoading?: boolean
  hasActions?: boolean
  canEdit?: boolean
  canDelete?: boolean
  showPagination?: boolean
  keyField?: string
  currentPage?: number
  perPage?: number
  extraActionsPosition?: 'before' | 'after'
  actions?: Partial<ActionConfig>
  enableSearch?: boolean
  searchPlaceholder?: string
  availableFilters?: Filter[]
  pageLoad?: (
    page?: number,
    itemsPerPage?: number,
    customParams?: Record<string, unknown>,
  ) => Promise<unknown[] | undefined>
}

export interface TableActions<T> {
  confirmDelete: (item: T) => void
  showConfirmation: (item: T) => void
}

const instance = getCurrentInstance()

const isCreateNewEnabled = computed(() => {
  return instance?.vnode?.props?.onCreateNew
})

// Default action configuration
const DEFAULT_ACTION_CONFIG = {
  view: {
    show: true,
    icon: 'lucide:eye',
    title: 'View Details',
  },
  edit: {
    show: true,
    icon: 'lucide:edit',
    title: 'Edit',
  },
  delete: {
    show: true,
    icon: 'lucide:trash',
    title: 'Delete',
  },
  extraActionsPosition: 'before' as const,
}

// Default status map for integer values (0 = inactive, 1 = active)
const DEFAULT_STATUS_MAP: Record<string | number, StatusMapItem> = {
  0: {
    label: 'Inactive',
    class: 'bg-red-100 text-red-800',
  },
  1: {
    label: 'Active',
    class: 'bg-green-100 text-green-800',
  },
  // Also support string values for backward compatibility
  inactive: {
    label: 'Inactive',
    class: 'bg-red-100 text-red-800',
  },
  active: {
    label: 'Active',
    class: 'bg-green-100 text-green-800',
  },
  pending: {
    label: 'Pending',
    class: 'bg-yellow-100 text-yellow-800',
  },
}

const props = withDefaults(defineProps<Props>(), {
  hasActions: true,
  canEdit: true,
  canDelete: true,
  showPagination: true,
  keyField: 'id',
  currentPage: 1,
  perPage: 10,
  extraActionsPosition: 'before',
  enableSearch: true,
  actions: () => ({}),
  searchPlaceholder: 'Search...',
  availableFilters: () => [],
  pageLoad: undefined,
})

interface Emits<T> {
  (e: 'edit', item: T): void
  (e: 'delete', item: T): void
  (e: 'view-details', item: T): void
  (e: 'export'): void
  (e: 'create-new'): void
}

const emit = defineEmits<Emits<any>>()

/**
 * Reactive configuration object for table actions.
 * Combines default action configurations with any custom configurations
 * provided via props. Supports view, edit, delete actions, and extra actions position.
 *
 * @property {ActionItem} view - Configuration for the "view" action.
 * @property {ActionItem} edit - Configuration for the "edit" action.
 * @property {ActionItem} delete - Configuration for the "delete" action.
 * @property {'before' | 'after'} extraActionsPosition - Determines the position of extra actions.
 *
 * @example
 * Uses the following priority:
 *   1. `props.extraActionsPosition`
 *   2. `props.actions?.extraActionsPosition`
 *   3. `defaultActionConfig.extraActionsPosition`
 */
const actionConfig = reactive<ActionConfig>({
  view: { ...DEFAULT_ACTION_CONFIG.view },
  edit: { ...DEFAULT_ACTION_CONFIG.edit },
  delete: { ...DEFAULT_ACTION_CONFIG.delete },
  extraActionsPosition: DEFAULT_ACTION_CONFIG.extraActionsPosition,
})

/**
 * Watches for changes in the `actions` prop and updates the `actionConfig` object accordingly.
 *
 * - If `newActions.view` is provided, it merges its properties into `actionConfig.view`.
 * - If `newActions.edit` is provided, it merges its properties into `actionConfig.edit`.
 * - If `newActions.delete` is provided, it merges its properties into `actionConfig.delete`.
 * - If `newActions.extraActionsPosition` is provided, it updates `actionConfig.extraActionsPosition`.
 *
 * The watcher is configured to:
 * - Trigger immediately upon component initialization (`immediate: true`).
 * - Perform a deep watch on the `actions` prop to detect nested changes (`deep: true`).
 *
 * This ensures that the `actionConfig` object remains in sync with the `actions` prop.
 */
watch(
  () => props.actions,
  (newActions) => {
    if (newActions?.view) {
      Object.assign(actionConfig.view, newActions.view)
    }
    if (newActions?.edit) {
      Object.assign(actionConfig.edit, newActions.edit)
    }
    if (newActions?.delete) {
      Object.assign(actionConfig.delete, newActions.delete)
    }
    if (newActions?.extraActionsPosition) {
      actionConfig.extraActionsPosition = newActions.extraActionsPosition
    }
  },
  { immediate: true, deep: true },
)

/**
 * Watches the `hasActions` prop for changes and updates the visibility of action buttons
 * (view, edit, delete) in the `actionConfig` object accordingly.
 *
 * - If `hasActions` is `false`, all action buttons are hidden by setting their `show` property to `false`.
 * - The watcher is configured to run immediately upon component initialization.
 *
 * @param {Function} () => props.hasActions - A function that returns the current value of the `hasActions` prop.
 * @param {Function} (value) => void - A callback function that executes when the `hasActions` prop changes.
 * @param {boolean} value - The new value of the `hasActions` prop.
 * @param {Object} options - Additional options for the watcher.
 * @param {boolean} options.immediate - Ensures the watcher runs immediately after the component is mounted.
 */
watch(
  () => props.hasActions,
  (value) => {
    if (value === false) {
      actionConfig.view.show = false
      actionConfig.edit.show = false
      actionConfig.delete.show = false
    }
  },
  { immediate: true },
)

watch(
  () => props.canEdit,
  (value) => {
    actionConfig.edit.show = value
  },
  { immediate: true },
)

watch(
  () => props.canDelete,
  (value) => {
    actionConfig.delete.show = value
  },
  { immediate: true },
)

// Show actions column if at least one action is visible
const showActionsColumn = computed(() => {
  return (
    actionConfig.view.show || actionConfig.edit.show || actionConfig.delete.show || !!props.actions
  )
})

const totalColumns = computed(() => {
  return props.columns.length + (showActionsColumn.value ? 1 : 0) + 1 // +1 for the SN column
})

const showConfirmationDialog = ref(false)
const itemToDelete = ref<Record<string, unknown> | null>(null)

/**
 * Function to retrieve the key for a given item.
 * If the item contains the property specified by `props.keyField`,
 * it returns the value of that property. Otherwise, it returns the
 * JSON stringified version of the item.
 *
 * @param {any} item - The item for which the key needs to be retrieved.
 * @returns {string} - The key for the given item.
 */
const getItemKey = (item: Record<string, unknown>): string | number => {
  const keyValue = item[props.keyField as string]
  if (typeof keyValue === 'string' || typeof keyValue === 'number') {
    return keyValue
  }
  return JSON.stringify(item)
}

/**
 * Retrieves the value of a nested property from an object using a dot-separated key string.
 *
 * @param {any} item - The object from which to retrieve the value.
 * @param {string} key - The dot-separated key string representing the path to the property.
 */
const getItemValue = (item: any, key: string) => {
  return key.split('.').reduce((obj: any, key: string) => obj?.[key], item)
}

/**
 * Returns the status label based on the provided status value.
 * Uses column's statusMap if provided, otherwise falls back to default map.
 *
 * @param {any} status - The status value (can be integer or string).
 * @param {Column} column - The column definition which may contain a statusMap.
 * @returns {string} - The label for the given status.
 */
const getStatusLabel = (status: unknown, column: Column): string => {
  const statusValue = status !== null && status !== undefined ? status : ''
  const statusMap = column.statusMap || DEFAULT_STATUS_MAP
  const statusItem =
    statusMap[statusValue as string | number] || statusMap[String(statusValue).toLowerCase()]

  return statusItem?.label || String(statusValue)
}

/**
 * Returns the CSS class string based on the provided status.
 * Uses column's statusMap if provided, otherwise falls back to default map.
 *
 * @param {any} status - The status value (can be integer or string).
 * @param {Column} column - The column definition which may contain a statusMap.
 * @returns {string} - The corresponding CSS class string for the given status.
 */
const getStatusClass = (status: unknown, column: Column): string => {
  const statusValue = status !== null && status !== undefined ? status : ''
  const statusMap = column.statusMap || DEFAULT_STATUS_MAP
  const statusItem =
    statusMap[statusValue as string | number] || statusMap[String(statusValue).toLowerCase()]

  return statusItem?.class || 'bg-gray-100 text-gray-800'
}

/**
 * Handles the edit action for a given item.
 * Emits an 'edit' event with the specified item as payload.
 *
 * @param {any} item - The item to be edited.
 */
const handleEdit = (item: Record<string, unknown>) => {
  emit('edit', item)
}

/**
 * Handles the deletion of an item.
 * Emits a 'delete' event with the specified item as payload.
 *
 * @param {any} item - The item to be deleted.
 */
const handleDelete = (item: Record<string, unknown>) => {
  itemToDelete.value = item
  showConfirmationDialog.value = true
}

/**
 * Handles the view details action for a given item.
 * Emits a 'view-details' event with the specified item as payload.
 *
 * @param {any} item - The item for which to view details.
 */
const handleViewDetails = (item: Record<string, unknown>) => {
  emit('view-details', item)
}

/**
 * Confirms the deletion of an item.
 * Emits a 'delete' event with the item to be deleted.
 * Closes the confirmation dialog after emitting the event.
 */
const confirmDelete = () => {
  if (!itemToDelete.value) return
  emit('delete', itemToDelete.value)
  showConfirmationDialog.value = false
}

/**
 * Cancels the delete operation by hiding the confirmation dialog.
 * Sets the `showConfirmationDialog` reactive property to `false`.
 */
const cancelDelete = () => {
  itemToDelete.value = null
  showConfirmationDialog.value = false
}

const showFiltersDropdown = ref(false)

const toggleFilters = () => {
  showFiltersDropdown.value = !showFiltersDropdown.value
}

const buildSearchParams = () => {
  const params: Record<string, unknown> = {}

  if (searchQuery.value) {
    params.search = searchQuery.value
  }

  Object.keys(localFilters.value).forEach((key) => {
    if (localFilters.value[key]) {
      params[key] = localFilters.value[key]
    }
  })

  return params
}

const handleSearch = debounce(() => {
  if (props.pageLoad) {
    const params = buildSearchParams()
    props.pageLoad(1, props.perPage, params)
  }
}, 300)

const applyFilters = () => {
  if (props.pageLoad) {
    const params = buildSearchParams()
    props.pageLoad(1, props.perPage, params)
  }
  showFiltersDropdown.value = false
}

const clearFilters = () => {
  localFilters.value = {}
  searchQuery.value = ''
  if (props.pageLoad) {
    props.pageLoad(1, props.perPage, {})
  }
  showFiltersDropdown.value = false
}

/**
 * Provides table actions to be used within the Table component.
 *
 * @provide {Object} tableActions - An object containing methods for table actions.
 * @provide {Function} tableActions.confirmDelete - Method to confirm deletion of an item.
 * @param {Object} item - The item to be deleted.
 * @provide {Function} tableActions.showConfirmation - Method to handle the deletion process.
 *
 * @example
 * ---- const tableActions = inject<TableActions>('tableActions')
 * ---- tableActions.confirmDelete(item)
 */
provide('tableActions', {
  confirmDelete: (item) => {
    itemToDelete.value = item
    showConfirmationDialog.value = true
  },
  showConfirmation: handleDelete,
} as TableActions<Record<string, unknown>>)
</script>

<style scoped>
.gen-table {
  scrollbar-width: thin;
  scrollbar-color: hsl(var(--muted)) transparent;
}

.gen-table::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.gen-table::-webkit-scrollbar-track {
  background: transparent;
}

.gen-table::-webkit-scrollbar-thumb {
  background-color: hsl(var(--muted));
  border-radius: 3px;
}

/* Change scrollbar thumb color when hovered */
.gen-table::-webkit-scrollbar-thumb:hover {
  background-color: hsl(var(--muted-foreground));
}

/* For better cross-browser compatibility */
@supports not selector(::-webkit-scrollbar) {
  .gen-table {
    scrollbar-width: thin;
    scrollbar-color: hsl(var(--muted)) transparent;
  }
}
</style>
