<script setup lang="ts">
import type { ScheduledTransfer } from '@/types/dashboard'

defineProps<{
  transfers: ScheduledTransfer[]
}>()
</script>

<template>
  <div>
    <Card class="bg-muted border-none shadow-none flex flex-col gap-6">
      <CardHeader>
        <div class="flex items-center justify-between">
          <CardTitle class="text-lg font-bold">Payables</CardTitle>
          <Button variant="ghost" class="text-sm text-blue-600 hover:text-blue-700">
            View All →
          </Button>
        </div>
      </CardHeader>
      <CardContent class="gap-3 flex flex-col">
        <div
          v-for="transfer in transfers"
          :key="transfer.id"
          class="flex items-center justify-between pb-4 border-b last:border-b-0 border-muted-foreground/10"
        >
          <div class="flex items-center gap-x-3">
            <Avatar class="h-8 w-8">
              <AvatarImage :src="transfer.avatar" :alt="transfer.name" />
              <AvatarFallback class="bg-blue-100 text-blue-700 text-sm font-medium">
                {{
                  transfer.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                }}
              </AvatarFallback>
            </Avatar>
            <div>
              <p class="font-medium text-sm">
                {{ transfer.name }}
              </p>
              <p class="text-xs text-gray-500">
                {{ transfer.date }}
              </p>
            </div>
          </div>
          <div>
            <p class="font-semibold text-base">- {{ transfer.amount }}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
