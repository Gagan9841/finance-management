<script setup lang="ts" generic="T extends { id: any; name: string }">
import { ref, computed } from 'vue'

const props = defineProps<{
  modelValue?: any
  items: T[]
  placeholder?: string
  disabled?: boolean
}>()

const emit = defineEmits<{ (e: 'update:modelValue', v: any): void }>()

const open = ref(false)
const search = ref('')

const filtered = computed(() => {
  if (!search.value) return props.items
  const term = search.value.toLowerCase()
  return props.items.filter((i) => i.name.toLowerCase().includes(term))
})

function select(item: T) {
  emit('update:modelValue', item.id)
  search.value = item.name
  open.value = false
}
</script>

<template>
  <Combobox v-model:open="open" :disabled="disabled">
    <ComboboxTrigger as-child>
      <Button
        variant="outline"
        role="combobox"
        :aria-expanded="open"
        class="w-full justify-between"
      >
        {{
          modelValue ? (items.find((i) => i.id === modelValue)?.name ?? placeholder) : placeholder
        }}
        <i class="i-heroicons-chevron-up-down w-4 h-4 ml-2 opacity-50" />
      </Button>
    </ComboboxTrigger>

    <ComboboxContent>
      <ComboboxInput
        v-model="search"
        :placeholder="placeholder"
        class="w-full"
        autocomplete="off"
      />
      <ComboboxEmpty>No results</ComboboxEmpty>
      <ComboboxItem v-for="item in filtered" :key="item.id" :value="item.id" @select="select(item)">
        {{ item.name }}
      </ComboboxItem>
    </ComboboxContent>
  </Combobox>
</template>
