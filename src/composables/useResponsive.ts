import { ref, computed, onMounted, onUnmounted } from 'vue'

export function useResponsive() {
  const windowWidth = ref(window.innerWidth)
  const windowHeight = ref(window.innerHeight)

  const isMobile = computed(() => windowWidth.value < 768)
  const isTablet = computed(() => windowWidth.value >= 768 && windowWidth.value < 1024)
  const isDesktop = computed(() => windowWidth.value >= 1024)

  const isTouchDevice = ref(false)

  // Adaptive bead size based on viewport AND grid dimensions
  function getBeadSize(gridCols: number, containerWidth?: number): number {
    const available = (containerWidth ?? windowWidth.value) - 48 // padding
    const maxCell = Math.floor(available / gridCols) - 3 // gap

    if (isMobile.value) {
      return Math.max(16, Math.min(24, maxCell))
    }
    if (isTablet.value) {
      return Math.max(20, Math.min(28, maxCell))
    }
    return Math.max(24, Math.min(36, maxCell))
  }

  const beadSize = computed(() => {
    if (isMobile.value) return 20
    if (isTablet.value) return 24
    return 28
  })

  const gridGap = computed(() => {
    if (isMobile.value) return 2
    return 3
  })

  const containerWidth = computed(() => {
    if (isMobile.value) return '100%'
    if (isTablet.value) return '95%'
    return '90%'
  })

  const maxGridSize = computed(() => {
    if (isMobile.value) return { rows: 32, cols: 32 }
    return { rows: 64, cols: 64 }
  })

  // Touch-friendly minimum target size
  const touchTargetSize = computed(() => isMobile.value ? 44 : 36)

  // Safe area insets for notched phones
  const safeAreaTop = ref(0)
  const safeAreaBottom = ref(0)

  function detectTouch() {
    isTouchDevice.value = 'ontouchstart' in window || navigator.maxTouchPoints > 0
  }

  function updateSafeArea() {
    const style = getComputedStyle(document.documentElement)
    safeAreaTop.value = parseInt(style.getPropertyValue('env(safe-area-inset-top)')) || 0
    safeAreaBottom.value = parseInt(style.getPropertyValue('env(safe-area-inset-bottom)')) || 0
  }

  function updateWindowSize() {
    windowWidth.value = window.innerWidth
    windowHeight.value = window.innerHeight
  }

  onMounted(() => {
    detectTouch()
    updateWindowSize()
    updateSafeArea()
    window.addEventListener('resize', updateWindowSize)
    window.addEventListener('orientationchange', () => {
      setTimeout(updateWindowSize, 100)
    })
  })

  onUnmounted(() => {
    window.removeEventListener('resize', updateWindowSize)
    window.removeEventListener('orientationchange', updateWindowSize)
  })

  return {
    isMobile,
    isTablet,
    isDesktop,
    isTouchDevice,
    beadSize,
    gridGap,
    containerWidth,
    maxGridSize,
    touchTargetSize,
    safeAreaTop,
    safeAreaBottom,
    getBeadSize,
    windowWidth,
    windowHeight,
  }
}
