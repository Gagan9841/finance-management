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
          <CardTitle class="text-lg font-semibold">Recent Transaction</CardTitle>
          <Button variant="ghost" class="text-sm text-blue-600 hover:text-blue-700">
            View All →
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table class="text-center">
          <TableHeader>
            <TableRow>
              <TableHead>NAME/BUSINESS</TableHead>
              <TableHead class="text-center">TYPE</TableHead>
              <TableHead class="text-center">AMOUNT</TableHead>
              <TableHead class="text-center">DATE</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="transaction in transactions" :key="transaction.id">
              <TableCell>
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                    <Iconify :icon="transaction.icon" class="w-6 h-6 text-gray-600" />
                  </div>
                  <div>
                    <p class="font-medium">
                      {{ transaction.name }}
                    </p>
                    <p class="text-sm text-gray-500">
                      {{ transaction.company }}
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="secondary" class="text-gray-700">
                  {{ transaction.type }}
                </Badge>
              </TableCell>
              <TableCell class="font-semibold">
                {{ transaction.amount }}
              </TableCell>
              <TableCell class="text-gray-500">
                {{ transaction.date }}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  </div>
</template>
