<template>
  <div class="space-y-3">
    <Label :for="id">{{ label }}</Label>

    <!-- File Input -->
    <div class="relative">
      <Input
        :id="id"
        ref="fileInput"
        type="file"
        :accept="accept"
        multiple
        class="hidden"
        @change="onChange"
      />

      <!-- Custom Upload Button -->
      <div
        class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer"
        :class="{ 'border-blue-500 bg-blue-50': isDragOver }"
        @click="triggerFileInput"
        @drop="handleDrop"
        @dragover.prevent="isDragOver = true"
        @dragleave="isDragOver = false"
        @dragenter.prevent
      >
        <Iconify name="upload" class="w-8 h-8 text-gray-400 mx-auto mb-2" />
        <p class="text-sm text-gray-600 mb-1">Drag and drop files here, or click to browse</p>
        <p class="text-xs text-gray-500">
          {{ accept ? `Accepted: ${accept}` : 'All file types accepted' }}
        </p>
      </div>
    </div>

    <!-- File List -->
    <div v-if="files.length" class="space-y-2">
      <h4 class="text-sm font-medium text-gray-900">Selected Files</h4>
      <div class="space-y-2">
        <div
          v-for="f in files"
          :key="f.id"
          class="flex items-center justify-between rounded-md border p-3 bg-gray-50"
        >
          <div class="flex items-center gap-3">
            <Iconify :name="getFileIcon(f.file.type)" class="w-5 h-5 text-gray-500" />
            <div>
              <span class="text-sm font-medium text-gray-900">{{ f.file.name }}</span>
              <p class="text-xs text-gray-500">{{ formatFileSize(f.file.size) }}</p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <div class="flex items-center gap-2">
              <div class="w-16 bg-gray-200 rounded-full h-2">
                <div
                  class="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  :style="{ width: `${f.progress}%` }"
                ></div>
              </div>
              <span class="text-xs text-gray-500 w-8">{{ f.progress }}%</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              class="text-red-600 hover:text-red-700"
              @click="removeFile(f.id)"
            >
              <Iconify name="x" class="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useToast } from '@/composables/useToast'

interface FileItem {
  id: string
  file: File
  progress: number
}

const props = defineProps<{
  id: string
  label: string
  accept?: string
  maxSize?: number // in bytes
  maxFiles?: number
}>()

const emit = defineEmits<{
  (e: 'uploaded', files: { name: string; url: string }[]): void
  (e: 'error', message: string): void
}>()

const files = ref<FileItem[]>([])
const isDragOver = ref(false)
const fileInput = ref<HTMLInputElement>()
const { showToast } = useToast()

function triggerFileInput() {
  fileInput.value?.click()
}

function onChange(e: Event) {
  const target = e.target as HTMLInputElement
  const selected = Array.from(target.files || [])
  processFiles(selected)
}

function handleDrop(e: DragEvent) {
  e.preventDefault()
  isDragOver.value = false

  const droppedFiles = Array.from(e.dataTransfer?.files || [])
  processFiles(droppedFiles)
}

function processFiles(newFiles: File[]) {
  // Validate files
  const validFiles = newFiles.filter((file) => {
    // Check file size
    if (props.maxSize && file.size > props.maxSize) {
      emit('error', `File ${file.name} exceeds maximum size of ${formatFileSize(props.maxSize)}`)
      return false
    }

    // Check file type
    if (
      props.accept &&
      !props.accept
        .split(',')
        .some((type: string) => file.type.match(type.trim().replace('*', '.*')))
    ) {
      emit('error', `File ${file.name} is not an accepted file type`)
      return false
    }

    return true
  })

  // Check max files limit
  if (props.maxFiles) {
    const totalFiles = files.value.length + validFiles.length
    if (totalFiles > props.maxFiles) {
      emit('error', `Maximum ${props.maxFiles} files allowed`)
      return
    }
  }

  // Add valid files
  const newFileItems = validFiles.map((file, idx) => ({
    id: `${Date.now()}-${idx}`,
    file,
    progress: 0,
  }))

  files.value.push(...newFileItems)
  simulateUpload()
}

function removeFile(fileId: string) {
  const index = files.value.findIndex((f) => f.id === fileId)
  if (index > -1) {
    files.value.splice(index, 1)
  }
}

function simulateUpload() {
  const interval = setInterval(() => {
    let done = true
    files.value = files.value.map((f: FileItem) => {
      const next = Math.min(100, f.progress + 10)
      if (next < 100) done = false
      return { ...f, progress: next }
    })
    if (done) {
      clearInterval(interval)
      const uploadedFiles = files.value.map((f: FileItem) => ({
        name: f.file.name,
        url: URL.createObjectURL(f.file),
      }))
      emit('uploaded', uploadedFiles)

      // Show success toast
      const fileCount = uploadedFiles.length
      const fileNames = uploadedFiles.map((f) => f.name).join(', ')
      const message =
        fileCount === 1
          ? `File "${uploadedFiles[0].name}" uploaded successfully`
          : `${fileCount} files uploaded successfully: ${fileNames}`

      showToast(message, 'success', 3000)
    }
  }, 120)
}

function getFileIcon(mimeType: string): string {
  if (mimeType.startsWith('image/')) return 'image'
  if (mimeType.startsWith('video/')) return 'video'
  if (mimeType.startsWith('audio/')) return 'music'
  if (mimeType.includes('pdf')) return 'file-text'
  if (mimeType.includes('word') || mimeType.includes('document')) return 'file-text'
  if (mimeType.includes('sheet') || mimeType.includes('excel')) return 'file-text'
  return 'file'
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
</script>
