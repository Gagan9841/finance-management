<script setup lang="ts">
import { ref, computed } from 'vue'

interface Node {
  id: string | number
  label: string
  children?: Node[]
}

const props = defineProps<{
  modelValue?: string | number | null
  options: Node[]
  placeholder?: string
  disableBranchNodes?: boolean
}>()

const emit = defineEmits<{ (e: 'update:modelValue', v: string | number | null): void }>()

const open = ref(false)
const search = ref('')

const flat = computed(() => {
  const walk = (nodes: Node[], path: string[] = []): any[] => {
    return nodes.flatMap((node) => {
      const full = [...path, node.label].join(' > ')
      const leaf = !node.children?.length
      const disabled = props.disableBranchNodes && !leaf
      const entry = { ...node, full, leaf, disabled }
      return [entry, ...(node.children ? walk(node.children, [...path, node.label]) : [])]
    })
  }
  const list = walk(props.options)
  if (!search.value) return list
  return list.filter((i) => i.full.toLowerCase().includes(search.value.toLowerCase()))
})

function select(node: any) {
  if (node.disabled) return
  emit('update:modelValue', node.id)
  open.value = false
}
</script>

<template>
  <Popover v-model:open="open">
    <PopoverTrigger as-child>
      <Button variant="outline" class="w-full justify-between">
        {{
          modelValue ? (flat.find((i) => i.id === modelValue)?.full ?? placeholder) : placeholder
        }}
        <i class="i-heroicons-chevron-up-down w-4 h-4 ml-2 opacity-50" />
      </Button>
    </PopoverTrigger>

    <PopoverContent class="w-full p-0" align="start">
      <Command>
        <CommandInput v-model="search" :placeholder="placeholder" />
        <CommandList>
          <CommandEmpty>No results</CommandEmpty>
          <CommandGroup>
            <CommandItem
              v-for="node in flat"
              :key="node.id"
              :value="node.id"
              :disabled="node.disabled"
              @select="select(node)"
            >
              <span :class="{ 'opacity-50': node.disabled }">{{ node.full }}</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </PopoverContent>
  </Popover>
</template>
