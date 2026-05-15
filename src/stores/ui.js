import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUIStore = defineStore('ui', () => {
  const theme = ref('')

  function setTheme(newTheme) {
    theme.value = newTheme
  }

  return {
    theme,
    setTheme
  }
})