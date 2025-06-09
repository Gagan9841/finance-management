import { ref, watch } from 'vue'

type Theme = 'light' | 'dark'

const theme = ref<Theme>('light')

export function useTheme() {
  const setTheme = (newTheme: Theme) => {
    theme.value = newTheme
    document.documentElement.classList.remove('light', 'dark')
    document.documentElement.classList.add(newTheme)
    localStorage.setItem('theme', newTheme)
  }

  // Initialize theme from localStorage or system preference
  const initTheme = () => {
    const savedTheme = localStorage.getItem('theme') as Theme
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    setTheme(savedTheme || systemTheme)
  }

  // Watch for system theme changes
  watch(
    () => window.matchMedia('(prefers-color-scheme: dark)').matches,
    (isDark) => {
      if (!localStorage.getItem('theme')) {
        setTheme(isDark ? 'dark' : 'light')
      }
    },
  )

  // Initialize theme on mount
  initTheme()

  return {
    theme,
    setTheme,
  }
}
