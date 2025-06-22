<script setup lang="ts">
import type { ApexOptions } from 'apexcharts'

defineProps<{
  chartOptions: ApexOptions
  chartSeries: ApexOptions['series']
}>()
</script>

<template>
  <Card>
    <CardHeader>
      <div class="flex items-center justify-between">
        <CardTitle class="text-lg font-semibold">Working Capital</CardTitle>
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 rounded-full bg-emerald-500" />
            <span class="text-sm text-gray-600">Income</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 rounded-full bg-yellow-500" />
            <span class="text-sm text-gray-600">Expenses</span>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger as-child>
              <Button variant="outline" class="w-32"> Last 7 days </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Last 7 days</DropdownMenuItem>
              <DropdownMenuItem>Last 30 days</DropdownMenuItem>
              <DropdownMenuItem>Last 90 days</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </CardHeader>
    <CardContent>
      <div class="h-80">
        <ApexChart type="area" height="100%" :options="chartOptions" :series="chartSeries" />
      </div>
    </CardContent>
  </Card>
</template>
