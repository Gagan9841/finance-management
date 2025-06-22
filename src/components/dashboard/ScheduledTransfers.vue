<script setup lang="ts">
import type { ScheduledTransfer } from '@/types/dashboard'

defineProps<{
  transfers: ScheduledTransfer[]
}>()
</script>

<template>
  <div>
    <Card>
      <CardHeader>
        <div class="flex items-center justify-between">
          <CardTitle class="text-lg font-semibold">Payables</CardTitle>
          <Button variant="ghost" class="text-sm text-blue-600 hover:text-blue-700">
            View All →
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div class="space-y-4">
          <div
            v-for="transfer in transfers"
            :key="transfer.id"
            class="flex items-center justify-between"
          >
            <div class="flex items-center gap-3">
              <Avatar class="h-10 w-10">
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
            <div class="text-right">
              <p class="font-semibold text-sm">- {{ transfer.amount }}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
