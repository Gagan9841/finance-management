<template>
  <div class="flex items-center justify-center min-h-screen w-full bg-muted px-2">
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <main class="flex flex-1 flex-col gap-2 px-2 py-2 w-full">
          <div class="flex-1 rounded-xl p-4 bg-muted">
            <router-view />
          </div>
        </main>
        <Footer />
      </SidebarInset>
    </SidebarProvider>
  </div>
</template>

<script setup lang="ts">
import { SidebarProvider, SidebarInset } from '../ui/sidebar'
import AppSidebar from './AppSidebar.vue'
import Header from './Header.vue'
import Footer from './Footer.vue'
</script>
