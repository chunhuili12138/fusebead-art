import { ref, computed, type ComputedRef } from 'vue';

export interface GridPosition {
  row: number;
  col: number;
}

export function useGridLogic(
  gridData: ComputedRef<number[][]> | number[][],
  gridSize: { rows: number; cols: number }
) {
  const highlightedCell = ref<GridPosition | null>(null);

  const resolvedGridData = computed(() => {
    if ('value' in gridData) {
      return gridData.value;
    }
    return gridData as number[][];
  });

  const gridStats = computed(() => {
    let filledCells = 0;
    let emptyCells = 0;
    const colorCount: Record<number, number> = {};

    for (let r = 0; r < gridSize.rows; r++) {
      for (let c = 0; c < gridSize.cols; c++) {
        const colorId = resolvedGridData.value[r]?.[c] || 0;
        if (colorId === 0) {
          emptyCells++;
        } else {
          filledCells++;
          colorCount[colorId] = (colorCount[colorId] || 0) + 1;
        }
      }
    }

    return {
      filledCells,
      emptyCells,
      totalCells: gridSize.rows * gridSize.cols,
      colorCount,
    };
  });

  function getCellColor(row: number, col: number): number {
    if (row < 0 || row >= gridSize.rows || col < 0 || col >= gridSize.cols) {
      return 0;
    }
    return resolvedGridData.value[row]?.[col] || 0;
  }

  function isCellEmpty(row: number, col: number): boolean {
    return getCellColor(row, col) === 0;
  }

  function highlightCell(row: number, col: number) {
    highlightedCell.value = { row, col };
  }

  function clearHighlight() {
    highlightedCell.value = null;
  }

  function getCellKey(row: number, col: number): string {
    return `${row}-${col}`;
  }

  function validatePosition(row: number, col: number): boolean {
    return row >= 0 && row < gridSize.rows && col >= 0 && col < gridSize.cols;
  }

  return {
    highlightedCell,
    gridStats,
    getCellColor,
    isCellEmpty,
    highlightCell,
    clearHighlight,
    getCellKey,
    validatePosition,
  };
}
