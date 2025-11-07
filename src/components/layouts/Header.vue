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
      <div class="flex items-center gap-2">
        <h1 class="text-2xl font-bold">
          {{ getRouteTitle() }}
        </h1>
      </div>
    </div>

    <div class="flex items-center gap-2">
      <Button
        variant="ghost"
        size="lg"
        class="h-10 w-10 cursor-pointer"
        @click="setTheme(theme === 'dark' ? 'light' : 'dark')"
      >
        <Iconify
          :icon="theme === 'dark' ? 'solar:sun-bold' : 'tabler:moon-filled'"
          class="h-full w-full"
        />
        <span class="sr-only">Toggle theme</span>
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button variant="ghost" size="lg" class="h-10 w-10 cursor-pointer">
            <Iconify
              icon="solar:bell-bold"
              class="h-full w-full text-muted-foreground cursor-pointer"
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" side="bottom">
          <DropdownMenuLabel>Notifications</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            v-for="notification in notifications"
            :key="notification.id"
            class="cursor-pointer"
            :class="{ 'bg-muted': notification.read, 'border-b': !notification.read }"
            @click="markAsRead(notification.id)"
          >
            <div class="flex items-center gap-2">
              <div class="flex flex-col">
                <div class="flex items-center">
                  <p class="text-sm font-medium">
                    {{ notification.title }}
                  </p>
                  <sup v-if="!notification.read">
                    <Iconify icon="mdi:dot" class="h-4 w-4 text-primary" />
                  </sup>
                </div>
                <p class="text-sm text-muted-foreground">{{ notification.description }}</p>
              </div>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger
          class="flex items-center gap-2 cursor-pointer hover:bg-muted/50 rounded-md px-2 py-1 transition-colors"
        >
          <Avatar class="h-8 w-8">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback class="text-xs"> MN </AvatarFallback>
          </Avatar>
          <span class="text-sm font-medium text-foreground">{{ user?.name }}</span>
          <Iconify icon="lucide:chevron-down" class="h-4 w-4 text-muted-foreground" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" side="bottom" class="w-56">
          <DropdownMenuLabel class="font-normal">
            <div class="flex flex-col space-y-1">
              <p class="text-sm font-medium leading-none">{{ user?.name }}</p>
              <p class="text-xs leading-none text-muted-foreground">{{ user?.email }}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem class="cursor-pointer">
            <Iconify icon="solar:user-bold" class="h-4 w-4 mr-2" />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem class="cursor-pointer">
            <Iconify icon="solar:settings-bold" class="h-4 w-4 mr-2" />
            Settings
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem class="cursor-pointer text-red-600">
            <Iconify icon="solar:logout-bold" class="h-4 w-4 mr-2" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useTheme } from '@/composables/use-theme'
import { useAuthStore } from '@/stores/authStore'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const authStore = useAuthStore()
const { user } = storeToRefs(authStore)

const { theme, setTheme } = useTheme()

const notifications = ref([
  {
    id: 1,
    title: 'Notification 1',
    description: 'This is the first notification',
    read: false,
  },
  {
    id: 2,
    title: 'Notification 2',
    description: 'This is the second notification',
    read: false,
  },
  {
    id: 3,
    title: 'Notification 3',
    description: 'This is the third notification',
    read: false,
  },
])

const markAsRead = (id: number) => {
  notifications.value = notifications.value.map((notification) =>
    notification.id === id ? { ...notification, read: true } : notification,
  )
}

const getRouteTitle = () => {
  if (route.fullPath === '/') return 'Dashboard'
  const segments = route.fullPath.split('/')
  const last = segments.pop()
  if (!last) return ''
  return last.charAt(0).toUpperCase() + last.slice(1)
}
</script>
