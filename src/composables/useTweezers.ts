import { ref, onMounted, onUnmounted } from 'vue'
import type { Ref } from 'vue'
import { normalizeEvent } from '@/utils/eventAdapter'

export interface TweezerState {
  isActive: boolean
  x: number
  y: number
  isHoldingBead: boolean
  beadColor: string | null
  beadSize: number
}

export function useTweezers(
  options: {
    enabled?: Ref<boolean>
    beadSize?: number
  } = {}
) {
  const state = ref<TweezerState>({
    isActive: false,
    x: 0,
    y: 0,
    isHoldingBead: false,
    beadColor: null,
    beadSize: options.beadSize || 28
  })

  const isEnabled = options.enabled || ref(true)

  let lastX = 0
  let lastY = 0

  function onPointerMove(e: MouseEvent | TouchEvent) {
    if (!isEnabled.value) return

    const normalized = normalizeEvent(e)
    lastX = normalized.x
    lastY = normalized.y

    state.value = {
      ...state.value,
      x: normalized.x,
      y: normalized.y
    }
  }

  function showTweezers(show: boolean = true) {
    state.value = {
      ...state.value,
      isActive: show,
      x: lastX,
      y: lastY
    }
  }

  function showTweezersAt(x: number, y: number) {
    state.value = {
      ...state.value,
      isActive: true,
      x,
      y
    }
  }

  function hideTweezers() {
    state.value = {
      ...state.value,
      isActive: false
    }
  }

  function holdBead(colorHex: string) {
    state.value = {
      ...state.value,
      isActive: true,
      isHoldingBead: true,
      beadColor: colorHex
    }
  }

  function releaseBead() {
    state.value = {
      ...state.value,
      isHoldingBead: false,
      beadColor: null
    }
  }

  function updateBeadSize(size: number) {
    state.value = {
      ...state.value,
      beadSize: size
    }
  }

  onMounted(() => {
    document.addEventListener('mousemove', onPointerMove)
    document.addEventListener('touchmove', onPointerMove, { passive: false })
  })

  onUnmounted(() => {
    document.removeEventListener('mousemove', onPointerMove)
    document.removeEventListener('touchmove', onPointerMove)
  })

  return {
    state,
    showTweezers,
    showTweezersAt,
    hideTweezers,
    holdBead,
    releaseBead,
    updateBeadSize,
    onPointerMove
  }
}
