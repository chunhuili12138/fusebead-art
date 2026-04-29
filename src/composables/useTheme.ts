import { ref } from 'vue'

type Theme = 'light' | 'dark'

const theme = ref<Theme>('light')

function applyTheme(t: Theme) {
  document.documentElement.setAttribute('data-theme', t)
  localStorage.setItem('fusebead_theme', t)
  theme.value = t
}

export function useTheme() {
  function init() {
    const saved = localStorage.getItem('fusebead_theme') as Theme | null
    if (saved === 'dark' || saved === 'light') {
      applyTheme(saved)
      return
    }
    // Follow system preference
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      applyTheme('dark')
    } else {
      applyTheme('light')
    }
  }

  function toggle() {
    applyTheme(theme.value === 'dark' ? 'light' : 'dark')
  }

  function setTheme(t: Theme) {
    applyTheme(t)
  }

  return { theme, init, toggle, setTheme }
}
