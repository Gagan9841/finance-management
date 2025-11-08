<script setup lang="ts">
import { ChevronRight } from 'lucide-vue-next'
import type { SidebarProps } from '../ui/sidebar'
import { useRoute } from 'vue-router'

const props = defineProps<SidebarProps>()

const route = useRoute()

const isActiveRoute = (itemLink?: string) => {
  if (!itemLink) return false
  if (itemLink === '/') {
    return route.path === '/'
  }
  const regex = new RegExp(`^${itemLink}(/|$)`)
  return regex.test(route.path)
}

interface NavItem {
  title: string
  icon: string
  url: string
  isActive?: boolean
  children?: NavItem[]
}

interface NavFooter {
  title: string
  icon: string
  url: string
}

const data: { navMain: NavItem[]; navFooter: NavFooter[] } = {
  navMain: [
    {
      title: 'Dashboard',
      icon: 'material-symbols:dashboard',
      url: '/',
    },
    {
      title: 'Setup',
      icon: 'hugeicons:setup-01',
      url: '/setup',
      children: [
        { title: 'Payables', url: '/setup/payables', icon: 'game-icons:pay-money' },
        {
          title: 'Receivables',
          url: '/setup/receivables',
          icon: 'streamline-plump:payment-recieve-7-remix',
        },
      ],
    },
    {
      title: 'Transactions',
      url: '/transactions',
      icon: 'material-symbols:swap-horiz',
      children: [
        { title: 'All Transactions', url: '/transactions/all', icon: 'material-symbols:list' },
        { title: 'Pending', url: '/transactions/pending', icon: 'material-symbols:pending' },
      ],
    },
    {
      title: 'Invoices',
      url: '/invoices',
      icon: 'material-symbols:receipt-long',
    },
    {
      title: 'My Wallets',
      url: '/wallets',
      icon: 'material-symbols:account-balance-wallet',
    },
    {
      title: 'Settings',
      icon: 'material-symbols:settings',
      url: '/settings',
      children: [
        { title: 'Users', url: '/settings/users', icon: 'material-symbols:person' },
        { title: 'Password', url: '/settings/password', icon: 'material-symbols:lock' },
      ],
    },
  ],
  navFooter: [
    {
      title: 'Help',
      url: '/help',
      icon: 'material-symbols:help',
    },
    {
      title: 'Logout',
      url: '/logout',
      icon: 'material-symbols:logout',
    },
  ],
}

// Check if parent or any child is active
const isParentActive = (item: NavItem) => {
  if (isActiveRoute(item.url)) return true
  if (item.children) {
    return item.children.some((child) => isActiveRoute(child.url))
  }
  return false
}
</script>

<template>
  <Sidebar v-bind="props" class="border-r border-border/40 bg-background shadow-md rounded-lg">
    <SidebarHeader class="border-b border-border/40">
      <div class="flex items-center gap-3 px-6 py-4">
        <div class="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
          <span class="text-white font-bold text-sm">m</span>
        </div>
        <span class="font-semibold text-lg text-foreground">Maglo.</span>
      </div>
    </SidebarHeader>

    <SidebarContent class="px-4 py-4">
      <SidebarMenu class="space-y-2">
        <template v-for="item in data.navMain" :key="item.title">
          <!-- Collapsible menu item with children -->
          <Collapsible
            v-if="item.children?.length"
            :title="item.title"
            :default-open="isParentActive(item)"
            class="group/collapsible"
          >
            <SidebarGroup>
              <SidebarGroupLabel as-child>
                <CollapsibleTrigger
                  class="flex items-center gap-3 w-full rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200"
                  :class="{
                    'bg-primary/10 text-primary border border-primary/20': isParentActive(item),
                    'text-muted-foreground hover:text-foreground hover:bg-muted/80':
                      !isParentActive(item),
                  }"
                >
                  <Iconify :icon="item.icon" class="size-5 shrink-0" />
                  <span class="flex-1 text-left text-sm">{{ item.title }}</span>
                  <ChevronRight
                    class="size-4 transition-transform group-data-[state=open]/collapsible:rotate-90"
                  />
                </CollapsibleTrigger>
              </SidebarGroupLabel>
              <CollapsibleContent>
                <SidebarGroupContent class="mt-2">
                  <SidebarMenu class="space-y-1 ml-4">
                    <SidebarMenuItem v-for="childItem in item.children" :key="childItem.title">
                      <SidebarMenuButton
                        as-child
                        class="w-full rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200"
                        :class="{
                          'bg-primary text-primary-foreground shadow-sm border border-primary/20':
                            isActiveRoute(childItem.url),
                          'text-muted-foreground hover:text-foreground hover:bg-muted/80':
                            !isActiveRoute(childItem.url),
                        }"
                      >
                        <RouterLink :to="childItem.url" class="flex items-center gap-3">
                          <Iconify :icon="childItem.icon" class="size-4 shrink-0" />
                          <span>{{ childItem.title }}</span>
                        </RouterLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>

          <!-- Simple menu item without children -->
          <SidebarGroup v-else>
            <SidebarMenuItem>
              <SidebarMenuButton
                as-child
                class="w-full rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200"
                :class="{
                  'bg-primary text-primary-foreground shadow-sm border border-primary/20':
                    isActiveRoute(item.url),
                  'text-muted-foreground hover:text-foreground hover:bg-muted/80': !isActiveRoute(
                    item.url,
                  ),
                }"
              >
                <RouterLink :to="item.url" class="flex items-center gap-3">
                  <Iconify :icon="item.icon" class="size-5 shrink-0" />
                  <span>{{ item.title }}</span>
                </RouterLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarGroup>
        </template>
      </SidebarMenu>
    </SidebarContent>

    <SidebarFooter class="mt-auto border-t border-border/40 px-4 py-4">
      <SidebarMenu class="space-y-2">
        <template v-for="item in data.navFooter" :key="item.title">
          <SidebarMenuItem>
            <SidebarMenuButton
              as-child
              class="w-full rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground transition-all duration-200 hover:bg-muted/80 hover:text-foreground"
            >
              <RouterLink :to="item.url" class="flex items-center gap-3">
                <Iconify :icon="item.icon" class="size-5 shrink-0" />
                <span>{{ item.title }}</span>
              </RouterLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </template>
      </SidebarMenu>
    </SidebarFooter>

    <SidebarRail />
  </Sidebar>
</template>
