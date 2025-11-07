/**
 * Creates a debounced version of a function that delays its execution until after a specified wait time.
 * @template T - The type of the function to debounce
 * @param {T} fn - The function to debounce
 * @param {number} delay - The number of milliseconds to wait before executing the function
 * @returns {(...args: Parameters<T>) => Promise<ReturnType<T>> & { cancel: () => void }} - The debounced function with a cancel method
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number,
): ((...args: Parameters<T>) => Promise<ReturnType<T>>) & { cancel: () => void } {
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  const debounced = (...args: Parameters<T>): Promise<ReturnType<T>> => {
    return new Promise((resolve, reject) => {
      if (timeoutId !== null) {
        clearTimeout(timeoutId)
      }

      timeoutId = setTimeout(() => {
        try {
          const result = fn(...args)
          resolve(result)
        } catch (error) {
          reject(error)
        } finally {
          timeoutId = null
        }
      }, delay)
    })
  }

  debounced.cancel = () => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId)
      timeoutId = null
    }
  }

  return debounced
}

export default debounce
