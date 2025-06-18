<template>
  <header
    class="sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between gap-4 border-b bg-background px-4"
  >
    <div class="flex items-center gap-2">
      <SidebarTrigger class="size-2">
        <Button variant="ghost" type="button" size="icon" class="h-9 cursor-pointer w-full">
          <!-- <Menu class="h-4 w-4" /> -->
          <span class="sr-only">Toggle sidebar</span>
        </Button>
      </SidebarTrigger>
      <Separator orientation="vertical" class="mr-2 h-4" />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem class="hidden md:block">
            <BreadcrumbLink href="#"> Building Your Application </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator class="hidden md:block" />
          <BreadcrumbItem>
            <BreadcrumbPage>Data Fetching</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </div>

    <div class="flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        class="h-9 w-9"
        @click="setTheme(theme === 'dark' ? 'light' : 'dark')"
      >
        <Iconify
          :icon="theme === 'dark' ? 'solar:sun-bold' : 'tabler:moon-filled'"
          class="h-4 w-4"
        />
        <span class="sr-only">Toggle theme</span>
      </Button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useTheme } from '@/composables/use-theme'

const { theme, setTheme } = useTheme()
</script>
