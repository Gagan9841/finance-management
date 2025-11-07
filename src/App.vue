<script setup lang="ts">
import { provide } from 'vue'
import mitt from 'mitt'
import { Toaster } from '@/components/ui/sonner'
import 'vue-sonner/style.css'

const emitter = mitt()
provide('emitter', emitter)
</script>

<template>
  <Toaster rich-colors position="top-right" />
  <router-view />
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
