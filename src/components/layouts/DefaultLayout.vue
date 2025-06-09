<template>
  <div class="flex h-screen">
    <SidebarProvider>
      <AppSidebar class="hidden lg:flex" />
      <SidebarInset>
        <div class="flex flex-1 flex-col">
          <Header />
          <main class="flex flex-1 flex-col gap-2 p-2">
            <div class="min-h-[100vh] flex-1 rounded-xl p-4 bg-primary md:min-h-min">
              <slot />
            </div>
          </main>
          <Footer />
        </div>
      </SidebarInset>
    </SidebarProvider>
  </div>
</template>

<script setup lang="ts"></script>
