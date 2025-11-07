<script setup lang="ts" generic="T extends Fields">
import { computed } from 'vue'
import type {
  CheckboxField,
  Fields,
  SelectField,
  TreeselectField,
  TypeaheadField,
} from '@/types/form'
import { FormField } from '../ui/form'

const props = defineProps<{
  field: T
  modelValue: any
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', v: any): void
  (e: 'fileChange', payload: { name: string; files: FileList }): void
  (e: 'removeFile', payload: { name: string; file: any }): void
}>()

const localValue = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
})
</script>

<template>
  <FormField :name="field.name">
    <FormItem class="space-y-2.5">
      <FormLabel
        v-if="field.type !== 'checkbox' && field.type !== 'switch' && field.type !== 'radio'"
        class="text-sm font-medium text-foreground flex items-center gap-2"
      >
        {{ field.label }}
        <span v-if="field.required" class="text-destructive text-xs">*</span>
      </FormLabel>

      <template v-if="['text', 'number', 'date', 'password'].includes(field.type)">
        <FormControl>
          <Input
            v-model="localValue"
            :type="
              field.type === 'date'
                ? 'datetime-local'
                : field.type === 'password'
                  ? 'password'
                  : 'text'
            "
            :placeholder="field.placeholder"
            :disabled="field.disabled"
            class="h-10 transition-all duration-200 focus:ring-2 focus:ring-offset-0"
          />
        </FormControl>
      </template>

      <template v-else-if="field.type === 'select' && !(field as any).multiple">
        <Select v-model="localValue" class="w-full">
          <FormControl>
            <SelectTrigger class="h-10 transition-all duration-200 w-full">
              <SelectValue :placeholder="field.placeholder" />
            </SelectTrigger>
          </FormControl>
          <SelectContent class="animate-in fade-in-75 duration-200">
            <SelectItem
              v-for="opt in (field as SelectField).options"
              :key="opt.value"
              :value="opt.value"
              class="cursor-pointer"
            >
              {{ opt.label }}
            </SelectItem>
          </SelectContent>
        </Select>
      </template>

      <template v-else-if="field.type === 'select-multiple'">
        <Select v-model="localValue" multiple class="w-full">
          <FormControl>
            <SelectTrigger class="h-10 transition-all duration-200 w-full">
              <SelectValue :placeholder="field.placeholder" />
            </SelectTrigger>
          </FormControl>
          <SelectContent class="animate-in fade-in-75 duration-200">
            <SelectItem
              v-for="opt in (field as SelectField).options"
              :key="opt.value"
              :value="opt.value"
              class="cursor-pointer"
            >
              {{ opt.label }}
            </SelectItem>
          </SelectContent>
        </Select>
      </template>

      <template v-else-if="field.type === 'treeselect'">
        <Treeselect
          v-model="localValue"
          :options="(field as TreeselectField).options"
          :placeholder="field.placeholder"
          :disable-branch-nodes="(field as TreeselectField).disableNode"
          class="transition-all duration-200"
        />
      </template>

      <template v-else-if="field.type === 'typeahead'">
        <Typeahead
          v-model="localValue"
          :items="(field as TypeaheadField).options"
          :placeholder="field.placeholder"
          :disabled="field.disabled"
          class="transition-all duration-200"
        />
      </template>

      <template v-else-if="field.type === 'switch'">
        <FormControl>
          <div
            class="flex items-center gap-3 p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
          >
            <Switch v-model="localValue" class="transition-all" />
            <Label class="cursor-pointer font-medium text-sm">{{ field.label }}</Label>
          </div>
        </FormControl>
      </template>

      <template v-else-if="field.type === 'checkbox' && !(field as CheckboxField).permissions">
        <FormControl>
          <div
            class="flex items-center gap-3 p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
          >
            <Checkbox v-model="localValue" class="transition-all" />
            <Label class="cursor-pointer font-medium text-sm">{{ field.label }}</Label>
          </div>
        </FormControl>
      </template>

      <template v-else-if="field.type === 'checkbox' && (field as CheckboxField).permissions">
        <FormLabel class="text-sm font-medium">{{ field.label }}</FormLabel>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-3">
          <div
            v-for="p in (field as CheckboxField).permissions!"
            :key="p.value"
            class="flex items-center gap-3 p-2.5 rounded-lg border border-border hover:bg-muted/30 transition-all duration-200"
          >
            <Checkbox v-model="localValue" :value="p.value" class="transition-all" />
            <Label class="cursor-pointer text-sm font-medium">{{ p.label }}</Label>
          </div>
        </div>
      </template>

      <template v-else-if="field.type === 'radio'">
        <FormControl>
          <div
            class="flex items-center gap-3 p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
          >
            <Input v-model="localValue" class="w-4 h-4 cursor-pointer" type="radio" />
            <Label class="cursor-pointer font-medium text-sm">{{ field.label }}</Label>
          </div>
        </FormControl>
      </template>

      <template v-else-if="field.type === 'file'">
        <FormControl>
          <FileUpload
            :id="field.name"
            :label="field.label"
            @uploaded="emit('fileChange', { name: field.name, files: $event })"
          />
        </FormControl>
        <FormDescription v-if="field.sizeValidation" class="text-xs text-muted-foreground mt-1">
          {{ field.sizeValidation }}
        </FormDescription>

        <div v-if="localValue?.length" class="mt-3 space-y-2">
          <p class="text-xs font-medium text-foreground">Uploaded files:</p>
          <div
            v-for="(f, i) in localValue"
            :key="i"
            class="flex items-center justify-between p-3 bg-muted/50 rounded-lg border border-border/50 hover:bg-muted transition-colors group"
          >
            <div class="flex items-center gap-2 min-w-0">
              <Iconify icon="lucide:file" class="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <span class="text-sm truncate text-foreground">{{ f.name }}</span>
            </div>
            <Button
              class="opacity-0 group-hover:opacity-100 transition-opacity"
              size="sm"
              variant="ghost"
              @click="emit('removeFile', { name: field.name, file: f })"
            >
              <Iconify icon="lucide:x" class="w-4 h-4" />
            </Button>
          </div>
        </div>
      </template>

      <FormMessage class="text-xs" />
    </FormItem>
  </FormField>
</template>
