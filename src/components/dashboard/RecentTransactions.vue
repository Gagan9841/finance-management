<script setup lang="ts">
import type { RecentTransaction } from '@/types/dashboard'

defineProps<{
  transactions: RecentTransaction[]
}>()
</script>

<template>
  <div class="lg:col-span-2">
    <Card>
      <CardHeader>
        <div class="flex items-center justify-between">
          <CardTitle class="text-lg font-bold text-gray-900">Recent Transaction</CardTitle>
          <Button
            variant="ghost"
            class="text-sm text-teal-500 hover:text-teal-600 hover:bg-transparent px-2"
          >
            View All →
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table class="text-left">
          <TableHeader>
            <TableRow class="hover:bg-transparent">
              <TableHead class="pb-3.5 font-semibold text-gray-400 text-xs uppercase"
                >NAME/BUSINESS</TableHead
              >
              <TableHead class="pb-3.5 font-semibold text-gray-400 text-xs uppercase"
                >TYPE</TableHead
              >
              <TableHead class="pb-3.5 font-semibold text-gray-400 text-xs uppercase"
                >AMOUNT</TableHead
              >
              <TableHead class="pb-3.5 font-semibold text-gray-400 text-xs uppercase"
                >DATE</TableHead
              >
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="transaction in transactions" :key="transaction.id" class="gap-3.5">
              <TableCell class="py-4">
                <div class="flex items-center gap-3">
                  <div
                    :class="`w-12 h-12 rounded-lg ${transaction.bgColor} flex items-center justify-center text-xl font-bold ${transaction.textColor || ''}`"
                  >
                    <Iconify :icon="transaction.icon" class="w-8 h-8" />
                  </div>
                  <div>
                    <p class="font-medium text-sm text-gray-900">
                      {{ transaction.name }}
                    </p>
                    <p class="text-xs text-gray-500">
                      {{ transaction.company }}
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell class="py-4">
                <Badge
                  variant="secondary"
                  class="bg-gray-100 text-gray-600 text-sm font-normal hover:bg-gray-100"
                >
                  {{ transaction.type }}
                </Badge>
              </TableCell>
              <TableCell class="font-semibold text-sm text-gray-900 py-4">
                {{ transaction.amount }}
              </TableCell>
              <TableCell class="text-gray-400 font-normal text-sm py-4">
                {{ transaction.date }}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  </div>
</template>
