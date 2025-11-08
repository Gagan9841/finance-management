<template>
  <div>
    <AlertDialog :open="isOpen">
      <AlertDialogContent class="bg-red-200">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your account and remove your
            data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            class="bg-gray-200 cursor-pointer text-gray-800 hover:bg-gray-300"
            @click="handleCancel"
            >Cancel</AlertDialogCancel
          >
          <AlertDialogAction
            class="bg-destructive cursor-pointer text-destructive-foreground hover:bg-destructive/90"
            @click="handleConfirm"
            >Continue</AlertDialogAction
          >
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'update:isOpen', value: boolean): void
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()

const isOpen = ref(props.isOpen)

watch(
  () => props.isOpen,
  (newVal) => {
    isOpen.value = newVal
  },
)

function handleConfirm() {
  emit('confirm')
}

function handleCancel() {
  emit('cancel')
}

defineExpose({
  open: () => {
    isOpen.value = true
  },
  close: () => {
    isOpen.value = false
  },
})
</script>
