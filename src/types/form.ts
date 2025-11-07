export type FieldType =
  | 'text'
  | 'number'
  | 'date'
  | 'password'
  | 'select'
  | 'select-multiple'
  | 'treeselect'
  | 'typeahead'
  | 'editor'
  | 'checkbox'
  | 'switch'
  | 'radio'
  | 'file'

export interface BaseField {
  name: string
  label: string
  placeholder?: string
  disabled?: boolean
  class?: string
  required?: boolean
}

export interface TextField extends BaseField {
  type: 'text' | 'number' | 'date' | 'password'
}
export interface SelectField extends BaseField {
  type: 'select' | 'select-multiple'
  options: { value: string | number; label: string }[]
  multiple?: boolean
}
export interface TreeselectField extends BaseField {
  type: 'treeselect'
  options: any[] // vue3-treeselect format
  disableNode?: boolean
}
export interface TypeaheadField extends BaseField {
  type: 'typeahead'
  options: { id: string | number; name: string }[]
}
export interface EditorField extends BaseField {
  type: 'editor'
}
export interface CheckboxField extends BaseField {
  type: 'checkbox' | 'switch'
  /** for permission matrix */
  permissions?: { value: string; label: string }[]
}
export interface RadioField extends BaseField {
  type: 'radio'
}
export interface FileField extends BaseField {
  type: 'file'
  sizeValidation?: string
}

export type Fields =
  | TextField
  | SelectField
  | TreeselectField
  | TypeaheadField
  | EditorField
  | CheckboxField
  | RadioField
  | FileField
