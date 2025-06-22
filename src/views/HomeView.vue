<script setup lang="ts">
import { getDashboardData } from '@/api/dashboard/dashboard'
import { useResponse } from '@/composables/useResponse'
import type { AxiosError } from 'axios'
import type { ApiResponse } from '@/types/response'
import { onMounted, ref } from 'vue'
import type { RecentTransaction, ScheduledTransfer } from '@/types/dashboard'
import StatsCards from '@/components/dashboard/StatsCards.vue'
import WorkingCapitalChart from '@/components/dashboard/WorkingCapitalChart.vue'
// import WalletCard from '@/components/dashboard/WalletCard.vue'
import RecentTransactions from '@/components/dashboard/RecentTransactions.vue'
import ScheduledTransfers from '@/components/dashboard/ScheduledTransfers.vue'
import type { ApexOptions } from 'apexcharts'

const { handleError } = useResponse<unknown>()

const dashboardData = ref<unknown>(null)

const chartOptions = ref<ApexOptions>({
  chart: {
    type: 'area',
    height: 350,
    toolbar: {
      show: false,
    },
  },
  colors: ['#10b981', '#eab308'],
  dataLabels: {
    enabled: false,
  },
  stroke: {
    curve: 'smooth',
    width: 3,
  },
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.3,
      opacityTo: 0.1,
      stops: [0, 90, 100],
    },
  },
  grid: {
    show: true,
    borderColor: '#e5e7eb',
    strokeDashArray: 3,
  },
  xaxis: {
    categories: ['Apr 14', 'Apr 15', 'Apr 16', 'Apr 17', 'Apr 18', 'Apr 19', 'Apr 20'],
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
    labels: {
      style: {
        colors: '#6b7280',
        fontSize: '12px',
      },
    },
  },
  yaxis: {
    labels: {
      formatter: function (val: number) {
        return val >= 1000 ? (val / 1000).toFixed(0) + 'K' : val.toString()
      },
      style: {
        colors: '#6b7280',
        fontSize: '12px',
      },
    },
  },
  legend: {
    show: false,
  },
  tooltip: {
    x: {
      format: 'dd MMM',
    },
    theme: 'dark',
  },
  responsive: [
    {
      breakpoint: 768,
      options: {
        chart: {
          height: 250,
        },
      },
    },
  ],
})

const chartSeries = ref<ApexOptions['series']>([
  {
    name: 'Income',
    data: [4800, 5200, 4600, 5000, 4800, 5300, 4900],
  },
  {
    name: 'Expenses',
    data: [5100, 5800, 5400, 6200, 4200, 3800, 4100],
  },
])

const recentTransactions = ref<RecentTransaction[]>([
  {
    id: 1,
    name: 'Iphone 13 Pro MAX',
    company: 'Apple Inc',
    type: 'Mobile',
    amount: '$420.84',
    date: '14 Apr 2022',
    icon: 'solar:iphone-bold-duotone',
  },
  {
    id: 2,
    name: 'Netflix Subscription',
    company: 'Netflix',
    type: 'Entertainment',
    amount: '$100.00',
    date: '05 Apr 2022',
    icon: 'solar:video-frame-play-horizontal-bold-duotone',
  },
  {
    id: 3,
    name: 'Figma Subscription',
    company: 'Figma, Inc',
    type: 'Software',
    amount: '$244.20',
    date: '02 Apr 2022',
    icon: 'solar:figma-bold-duotone',
  },
])

const scheduledTransfers = ref<ScheduledTransfer[]>([
  {
    id: 1,
    name: 'Salah Ahmed',
    date: 'April 28, 2022 at 11:00',
    amount: '$435.00',
    avatar: 'https://i.pravatar.cc/40?u=1',
  },
  {
    id: 2,
    name: 'Delowar Hossain',
    date: 'April 25, 2022 at 11:00',
    amount: '$132.00',
    avatar: 'https://i.pravatar.cc/40?u=2',
  },
  {
    id: 3,
    name: 'Moinul Hasan Nayem',
    date: 'April 25, 2022 at 11:00',
    amount: '$826.00',
    avatar: 'https://i.pravatar.cc/40?u=3',
  },
  {
    id: 4,
    name: 'Dr Jubed Ahmed',
    date: 'April 16, 2022 at 11:00',
    amount: '$435.00',
    avatar: 'https://i.pravatar.cc/40?u=4',
  },
  {
    id: 5,
    name: 'AR Jakir Alp',
    date: 'April 14, 2022 at 11:00',
    amount: '$228.00',
    avatar: 'https://i.pravatar.cc/40?u=5',
  },
])

const stats = ref([
  {
    title: 'Total balance',
    value: '$5240.21',
    icon: 'solar:wallet-money-bold-duotone',
  },
  {
    title: 'Total spending',
    value: '$250.80',
    icon: 'solar:card-recive-bold-duotone',
  },
  {
    title: 'Total saved',
    value: '$550.25',
    icon: 'solar:safe-2-bold-duotone',
  },
])

const loadDashboardData = async () => {
  await getDashboardData()
    .then((res) => {
      dashboardData.value = res.data
    })
    .catch((err: AxiosError<ApiResponse<unknown>>) => {
      handleError(err)
    })
}

onMounted(async () => {
  await loadDashboardData()
})
</script>

<template>
  <div class="flex-1">
    <div class="grid grid-cols-1 lg:grid-cols-[7fr_3fr] gap-4">
      <div class="space-y-4">
        <StatsCards :stats="stats" />
        <WorkingCapitalChart :chart-options="chartOptions" :chart-series="chartSeries" />
        <RecentTransactions :transactions="recentTransactions" />
      </div>

      <div class="space-y-4">
        <!-- <WalletCard /> -->
        <ScheduledTransfers :transfers="scheduledTransfers" />
      </div>
    </div>
  </div>
</template>
