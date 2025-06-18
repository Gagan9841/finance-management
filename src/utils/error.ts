export class CustomError {
  public errors: Record<string, string[]>

  constructor() {
    this.errors = {}
  }

  /**
   * Get the first error message for a specific field.
   * @param field - The field name.
   * @returns The first error message, or null if no errors exist for the field.
   */
  get(field: string): string | null {
    if (this.has(field)) {
      return this.errors[field][0]
    }
    return null
  }

  /**
   * Record a set of errors.
   * @param errors - An object containing field-error mappings.
   * @throws Will throw an error if the input format is invalid.
   */
  record(errors: { errors?: Record<string, string[]> }): void {
    if (errors && errors.errors && typeof errors.errors === 'object') {
      this.errors = { ...errors.errors } // Shallow copy to avoid mutation issues
    } else {
      console.error('Invalid error format:', errors)
      throw new Error("Invalid error format. Expected an object with an 'errors' property.")
    }
  }

  /**
   * Clear all errors.
   */
  clear(): void {
    this.errors = {}
  }

  /**
   * Reset errors for a specific field.
   * @param field - The field name.
   */
  reset(field: string): void {
    if (this.has(field)) {
      this.errors[field] = []
    }
  }

  /**
   * Check if a specific field has errors.
   * @param field - The field name.
   * @returns True if the field has errors, false otherwise.
   */
  has(field: string): boolean {
    return Object.prototype.hasOwnProperty.call(this.errors, field) && this.errors[field].length > 0
  }

  /**
   * Check if there are any errors.
   * @returns True if there are any errors, false otherwise.
   */
  any(): boolean {
    return Object.keys(this.errors).some((field) => this.errors[field].length > 0)
  }

  /**
   * Get all errors as an object.
   * @returns An object containing all errors.
   */
  all(): Record<string, string[]> {
    return { ...this.errors } // Return a shallow copy to prevent external mutation
  }

  /**
   * Add a single error to a specific field.
   * @param field - The field name.
   * @param error - The error message.
   */
  add(field: string, error: string): void {
    if (!this.errors[field]) {
      this.errors[field] = []
    }
    this.errors[field].push(error)
  }

  /**
   * Remove a specific error from a field.
   * @param field - The field name.
   * @param error - The error message to remove.
   */
  remove(field: string, error: string): void {
    if (this.has(field)) {
      this.errors[field] = this.errors[field].filter((err) => err !== error)
    }
  }

  /**
   * Check if a field has multiple errors.
   * @param field - The field name.
   * @returns True if the field has multiple errors, false otherwise.
   */
  hasMultiple(field: string): boolean {
    return this.has(field) && this.errors[field].length > 1
  }

  /**
   * Get all error messages for a specific field.
   * @param field - The field name.
   * @returns An array of error messages, or an empty array if no errors exist for the field.
   */
  getAllForField(field: string): string[] {
    return this.has(field) ? [...this.errors[field]] : []
  }

  /**
   * Get all error messages.
   * @returns An array of error messages.
   */
  getErrors(): Record<string, string[]> {
    return this.errors
  }
}
