<script setup lang="ts">
import { computed, ref } from 'vue'

interface Props {
  currentPage?: number
  totalItems?: number
  itemsPerPage?: number
  siblingCount?: number
  showEdges?: boolean
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  currentPage: 1,
  totalItems: 0,
  itemsPerPage: 10,
  siblingCount: 1,
  showEdges: true,
  disabled: false,
})

const emit = defineEmits<{
  'update:currentPage': [page: number]
  'update:itemsPerPage': [value: number]
  change: [page: number]
}>()

const totalPages = computed(() => Math.ceil((props.totalItems ?? 0) / props.itemsPerPage))
const pageInput = ref('')

const page = computed({
  get: () => props.currentPage ?? 1,
  set: (value) => {
    emit('update:currentPage', value)
    emit('change', value)
  },
})

const selectedItemsPerPage = computed({
  get: () => props.itemsPerPage.toString(),
  set: (value) => {
    emit('update:itemsPerPage', Number(value))
    if (page.value > Math.ceil((props.totalItems ?? 0) / Number(value))) {
      page.value = 1
    }
  },
})

const currentRange = computed(() => {
  const currentPage = props.currentPage ?? 1
  const totalItems = props.totalItems ?? 0
  const start = (currentPage - 1) * props.itemsPerPage + 1
  const end = Math.min(start + props.itemsPerPage - 1, totalItems)
  return `${start}-${end} of ${totalItems}`
})

const itemsPerPageOptions = [10, 20, 50, 100]

function handlePageInputKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter') {
    const newPage = parseInt(pageInput.value)
    if (!isNaN(newPage) && newPage >= 1 && newPage <= totalPages.value) {
      page.value = newPage
      pageInput.value = ''
    } else {
      pageInput.value = ''
    }
  }
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div class="flex items-center gap-4">
        <div>
          <p class="text-sm font-medium text-foreground mt-1">
            {{ currentRange }}
          </p>
        </div>
        <div class="hidden sm:block h-8 w-px bg-border"></div>
        <div class="flex items-center gap-2">
          <label
            for="items-per-page"
            class="text-xs font-semibold text-muted-foreground uppercase tracking-wide"
          >
            Per Page
          </label>
          <Select v-model="selectedItemsPerPage" :disabled="disabled">
            <SelectTrigger id="items-per-page" class="w-20 h-8 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem
                v-for="option in itemsPerPageOptions"
                :key="option"
                :value="option.toString()"
              >
                {{ option }}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <!-- Go to Page Input -->
      <div
        class="flex items-center gap-2 bg-muted/30 rounded-lg px-3 py-2 border border-transparent hover:border-border transition-colors"
      >
        <label for="page-input" class="text-xs font-medium text-muted-foreground"> Go to </label>
        <Input
          id="page-input"
          v-model="pageInput"
          type="number"
          :min="1"
          :max="totalPages"
          class="w-12 h-6 text-center text-sm border-0 bg-transparent focus:ring-0 p-0"
          :placeholder="page.toString()"
          :disabled="disabled"
          @keydown="handlePageInputKeydown"
        />
        <span class="text-xs font-medium text-muted-foreground">/ {{ totalPages }}</span>
      </div>
    </div>

    <!-- Pagination Controls -->
    <div class="flex items-center justify-center sm:justify-end gap-1">
      <Pagination
        v-model:page="page"
        :total="props.totalItems ?? 0"
        :items-per-page="itemsPerPage"
        :sibling-count="siblingCount"
        :show-edges="showEdges"
        :disabled="disabled"
      >
        <PaginationContent v-slot="slotProps" class="flex items-center gap-1">
          <!-- First Page Button -->
          <PaginationFirst v-if="showEdges" class="hidden lg:inline-flex">
            <Button
              variant="outline"
              size="icon"
              class="w-8 h-8 p-0 hover:bg-primary/10 hover:text-primary transition-colors duration-200"
              :disabled="disabled || page === 1"
            >
              <span class="sr-only">Go to first page</span>
              <Iconify icon="lucide:chevron-left" class="h-4 w-4" />
            </Button>
          </PaginationFirst>

          <!-- Previous Button -->
          <PaginationPrevious>
            <Button
              variant="outline"
              size="icon"
              class="w-8 h-8 p-0 hover:bg-primary/10 hover:text-primary transition-colors duration-200"
              :disabled="disabled || page === 1"
            >
              <span class="sr-only">Go to previous page</span>
              <Iconify icon="lucide:chevron-left" class="h-4 w-4" />
            </Button>
          </PaginationPrevious>

          <!-- Page Numbers -->
          <template v-for="(item, index) in slotProps?.items ?? []" :key="index">
            <PaginationItem v-if="item.type === 'page'" :value="item.value" as-child>
              <Button
                :variant="item.value === page ? 'default' : 'outline'"
                class="w-8 h-8 p-0 text-xs font-medium transition-all duration-200"
                :disabled="disabled"
              >
                {{ item.value }}
              </Button>
            </PaginationItem>

            <PaginationEllipsis
              v-else
              :index="index"
              class="w-8 h-8 flex items-center justify-center text-muted-foreground"
            >
              <span class="text-xs">...</span>
            </PaginationEllipsis>
          </template>

          <PaginationNext>
            <Button
              variant="outline"
              size="icon"
              class="w-8 h-8 p-0 hover:bg-primary/10 hover:text-primary transition-colors duration-200"
              :disabled="disabled || page === totalPages"
            >
              <span class="sr-only">Go to next page</span>
              <Iconify icon="lucide:chevron-right" class="h-4 w-4" />
            </Button>
          </PaginationNext>

          <PaginationLast v-if="showEdges" class="hidden lg:inline-flex">
            <Button
              variant="outline"
              size="icon"
              class="w-8 h-8 p-0 hover:bg-primary/10 hover:text-primary transition-colors duration-200"
              :disabled="disabled || page === totalPages"
            >
              <span class="sr-only">Go to last page</span>
              <Iconify icon="lucide:chevron-right" class="h-4 w-4" />
            </Button>
          </PaginationLast>
        </PaginationContent>
      </Pagination>
    </div>
  </div>
</template>
