import { ref, onMounted, onUnmounted } from 'vue'
import { addPointerEvents, type NormalizedEvent } from '@/utils/eventAdapter'

export interface DragState {
  isDragging: boolean
  selectedColor: number | null
  selectedColorHex: string | null
  currentRow: number | null
  currentCol: number | null
}

export function useDragBead({
  onPlace,
  onErase,
  onTweezerRelease,
  getColorHex,
  isMobile,
}: {
  onPlace: (row: number, col: number, colorId: number) => boolean
  onErase: (row: number, col: number) => void
  onTweezerRelease: () => void
  getColorHex: (colorId: number) => string
  isMobile: boolean
}) {
  const dragState = ref<DragState>({
    isDragging: false,
    selectedColor: null,
    selectedColorHex: null,
    currentRow: null,
    currentCol: null,
  })

  let cleanupFn: (() => void) | null = null

  function startDrag(colorId: number | null) {
    dragState.value.selectedColor = colorId
    dragState.value.selectedColorHex = colorId !== null && colorId !== 0
      ? getColorHex(colorId)
      : null
    dragState.value.isDragging = true
  }

  function endDrag() {
    onTweezerRelease()
    dragState.value.isDragging = false
    dragState.value.selectedColor = null
    dragState.value.selectedColorHex = null
    dragState.value.currentRow = null
    dragState.value.currentCol = null
  }

  function findCellElement(x: number, y: number): HTMLElement | null {
    const element = document.elementFromPoint(x, y)
    if (!element) return null
    return element.closest('[data-row][data-col]') as HTMLElement | null
  }

  function getCellPosition(element: HTMLElement): { row: number; col: number } | null {
    const row = parseInt(element.dataset.row || '')
    const col = parseInt(element.dataset.col || '')
    if (isNaN(row) || isNaN(col)) return null
    return { row, col }
  }

  function placeAt(x: number, y: number) {
    if (dragState.value.selectedColor === null) return
    const cellElement = findCellElement(x, y)
    if (!cellElement) return
    const pos = getCellPosition(cellElement)
    if (!pos) return
    if (dragState.value.selectedColor === 0) {
      onErase(pos.row, pos.col)
    } else {
      onPlace(pos.row, pos.col, dragState.value.selectedColor)
    }
  }

  function handleDragStart(e: NormalizedEvent) {
    if (dragState.value.selectedColor === null) return
    dragState.value.isDragging = true
    const cellElement = findCellElement(e.x, e.y)
    if (!cellElement) return
    const pos = getCellPosition(cellElement)
    if (!pos) return
    dragState.value.currentRow = pos.row
    dragState.value.currentCol = pos.col
    if (dragState.value.selectedColor === 0) {
      onErase(pos.row, pos.col)
    } else {
      onPlace(pos.row, pos.col, dragState.value.selectedColor)
    }
  }

  function handleDragMove(e: NormalizedEvent) {
    if (!dragState.value.isDragging || dragState.value.selectedColor === null) return
    const cellElement = findCellElement(e.x, e.y)
    if (!cellElement) return
    const pos = getCellPosition(cellElement)
    if (!pos) return
    if (dragState.value.currentRow !== pos.row || dragState.value.currentCol !== pos.col) {
      dragState.value.currentRow = pos.row
      dragState.value.currentCol = pos.col
      if (dragState.value.selectedColor === 0) {
        onErase(pos.row, pos.col)
      } else {
        onPlace(pos.row, pos.col, dragState.value.selectedColor)
      }
    }
  }

  function handleDragEnd(_e: NormalizedEvent) {
    dragState.value.isDragging = false
    dragState.value.currentRow = null
    dragState.value.currentCol = null
  }

  function initDrag(element: HTMLElement) {
    cleanupFn = addPointerEvents(element, {
      onStart: handleDragStart,
      onMove: handleDragMove,
      onEnd: handleDragEnd,
    })
  }

  onMounted(() => {
    // On mobile, skip drag listeners — use click-based placement instead
    if (isMobile) return
    const gridElement = document.getElementById('game-grid')
    if (gridElement) {
      initDrag(gridElement)
    }
  })

  onUnmounted(() => {
    if (cleanupFn) {
      cleanupFn()
    }
  })

  return {
    dragState,
    startDrag,
    endDrag,
    initDrag,
    placeAt,
  }
}
