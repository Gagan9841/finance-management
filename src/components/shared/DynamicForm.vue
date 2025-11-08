<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, inject, computed } from 'vue'
import type { Fields } from '@/types/form'
import { api } from '@/utils/apiRequest'
import { useResponse } from '@/composables/useResponse'
import { Form } from '@/components/ui/form'
import { useLoadingStore } from '@/stores/loadingStore'

const props = defineProps<{
  fields: Fields[]
  apiSlug: string
  fileDeleteUri?: string
  formTitle: string
}>()

const emit = defineEmits<{
  (e: 'refresh'): void
}>()

const isOpen = ref(false)
const isEditing = ref(false)
const isLoading = ref(false)

const { startLoading, stopLoading } = useLoadingStore()
const { handleResponse, handleError } = useResponse<any>()

const emitter: any = inject('emitter')

const formData = ref<Record<string, any>>(
  Object.fromEntries(props.fields.map((f) => [f.name, f.type === 'file' ? [] : ''])),
)

const defaultValues = computed(() =>
  Object.fromEntries(props.fields.map((f) => [f.name, f.type === 'file' ? [] : ''])),
)

function onFileChange({ name, files }: { name: string; files: FileList }) {
  const dt = new DataTransfer()
  ;[...files].forEach((f) => dt.items.add(f))
  formData.value[name] = [...(formData.value[name] ?? []), ...dt.files]
}

function onRemoveFile({ name, file }: { name: string; file: any }) {
  if (file.id) {
    api
      .delete(props.fileDeleteUri ?? '', { data: { id: file.id } })
      .then((r) => {
        handleResponse(r)
        refreshFileList(name)
      })
      .catch(handleError)
  } else {
    refreshFileList(name, file)
  }
}

function refreshFileList(name: string, remove?: any) {
  const currentFile = formData.value[name] ?? []
  formData.value[name] = remove
    ? currentFile.filter((f: any) => f.name !== remove.name && f.id !== remove.id)
    : currentFile
}

async function submitForm() {
  isLoading.value = true
  const fd = new FormData()

  props.fields.forEach((f) => {
    const val = formData.value[f.name]

    if (f.type === 'file') {
      ;(val ?? []).forEach((file: any) => {
        if (!file.id) fd.append('files[]', file)
        fd.append('file_types[]', f.name)
      })
    } else if (f.type === 'select-multiple') {
      fd.append(f.name, JSON.stringify(val ?? []))
    } else if (f.type === 'switch' || f.type === 'checkbox') {
      fd.append(f.name, val ? '1' : '0')
    } else {
      fd.append(f.name, val ?? '')
    }
  })

  try {
    if (isEditing.value) {
      // assume payload has an `id` field for edit
      const id = formData.value.id
      await api.put(props.apiSlug, id, { data: fd }).then(handleResponse).catch(handleError)
    } else {
      await api.post(props.apiSlug, fd).then(handleResponse).catch(handleError)
    }
    close()
    emit('refresh')
  } catch (e: any) {
    handleError(e)
  } finally {
    isLoading.value = false
  }
}

function openCreate() {
  startLoading()
  isEditing.value = false
  formData.value = { ...defaultValues.value }
  stopLoading()
  isOpen.value = true
}
function openEdit(payload: any) {
  startLoading()
  isEditing.value = true
  formData.value = { ...payload }
  stopLoading()
  isOpen.value = true
}
function close() {
  stopLoading()
  isOpen.value = false
  formData.value = { ...defaultValues.value }
  stopLoading()
}

onMounted(() => {
  emitter.on('create', openCreate)
  emitter.on('edit', openEdit)
  emitter.on('clearForm', close)
})
onBeforeUnmount(() => {
  emitter.off('create', openCreate)
  emitter.off('edit', openEdit)
  emitter.off('clearForm', close)
})
</script>

<template>
  <Sheet v-model:open="isOpen">
    <SheetContent side="right" class="w-[30vw] sm:max-w-none flex flex-col">
      <SheetHeader class="pb-6 border-b">
        <SheetTitle class="text-2xl font-semibold">
          {{ isEditing ? 'Update' : 'Add' }} {{ props.formTitle }}
        </SheetTitle>
        <p class="text-sm text-muted-foreground mt-1">
          {{ isEditing ? 'Modify the details below' : 'Fill in the details to create a new entry' }}
        </p>
      </SheetHeader>

      <Form class="flex-1 overflow-y-auto" @submit:prevent="submitForm">
        <div class="space-y-6 mt-6 px-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div v-for="field in props.fields" :key="field.name">
              <FormFields
                :field="field"
                :model-value="formData[field.name]"
                @update:model-value="(v) => (formData[field.name] = v)"
                @file-change="onFileChange"
                @remove-file="onRemoveFile"
              />
            </div>
          </div>
        </div>
      </Form>

      <SheetFooter class="px-4 pt-6 border-t mt-6 w-full">
        <div class="flex w-full gap-3">
          <SheetClose as-child>
            <Button type="button" variant="destructive" class="flex-1" @click="close">
              Cancel
            </Button>
          </SheetClose>
          <Button type="submit" class="flex-1" :disabled="isLoading" @click="submitForm">
            <Iconify icon="lucide:check" class="w-4 h-4" />
            Save
          </Button>
        </div>
      </SheetFooter>

      <Loading />
    </SheetContent>
  </Sheet>
</template>
