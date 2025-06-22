<template>
  <div>
    <Card>
      <CardHeader>
        <div class="flex items-center justify-between">
          <CardTitle class="text-lg font-semibold">Wallet</CardTitle>
          <Button variant="ghost" size="icon">
            <Iconify icon="solar:menu-dots-bold" class="w-5 h-5" />
          </Button>
        </div>
      </CardHeader>
      <CardContent class="pt-2">
        <div class="relative h-[240px]">
          <!-- Bottom card (white) -->
          <div
            class="absolute top-[20%] left-0 right-0 transform transition-transform duration-500 ease-in-out"
          >
            <div
              class="bg-white/70 backdrop-blur-md rounded-xl p-4 border border-gray-200/50 shadow-lg"
            >
              <div class="relative h-full">
                <div class="flex justify-between items-start mb-4 pt-12">
                  <div>
                    <p class="font-semibold text-gray-700">Maglo.</p>
                    <p class="text-gray-500 text-xs">Commercial Bank</p>
                  </div>
                  <div class="flex">
                    <div class="w-6 h-6 rounded-full bg-red-500" />
                    <div class="w-6 h-6 rounded-full bg-yellow-500 -ml-3" />
                  </div>
                </div>

                <div class="text-xl font-mono tracking-wider mb-2">8595 2548****</div>
                <div class="flex justify-between items-end">
                  <p class="text-sm text-gray-500">09/25</p>
                  <Iconify icon="logos:visa" class="w-12 h-auto" />
                </div>
              </div>
            </div>
          </div>

          <!-- Top Card (dark) -->
          <div
            class="absolute top-0 left-0 right-0 bg-slate-900 rounded-xl p-4 text-white overflow-hidden shadow-xl transform transition-transform duration-500 ease-in-out hover:-translate-y-2"
          >
            <div class="flex justify-between items-start mb-4">
              <div>
                <p class="font-semibold">Maglo.</p>
                <p class="text-white/60 text-xs">Universal Bank</p>
              </div>
              <Iconify icon="solar:card-chip-bold-duotone" class="w-10 h-10" />
            </div>
            <div class="text-xl font-mono tracking-wider mb-4">5495 7381 3759 2321</div>
            <div class="flex justify-between items-end">
              <p class="text-sm uppercase">Your Name</p>
              <Iconify icon="ph:wifi-high-bold" class="w-6 h-6" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
