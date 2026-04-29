import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export interface GridSize {
  rows: number;
  cols: number;
}

export interface GameState {
  mode: 'challenge' | 'free';
  level?: number;
  gridSize: GridSize;
  gridData: number[][];
  targetPattern?: number[][];
  selectedColor: number;
  isEraserMode: boolean;
  history: number[][][];
  historyIndex: number;
}

export const useGameStore = defineStore('game', () => {
  const gameState = ref<GameState>({
    mode: 'challenge',
    gridSize: { rows: 16, cols: 16 },
    gridData: [],
    selectedColor: 1,
    isEraserMode: false,
    history: [],
    historyIndex: -1,
  });

  const canUndo = computed(() => gameState.value.historyIndex > 0);
  const canRedo = computed(() => gameState.value.historyIndex < gameState.value.history.length - 1);

  function initializeGrid(rows: number, cols: number) {
    gameState.value.gridSize = { rows, cols };
    gameState.value.gridData = Array(rows).fill(null).map(() => Array(cols).fill(0));
    gameState.value.history = [JSON.parse(JSON.stringify(gameState.value.gridData))];
    gameState.value.historyIndex = 0;
  }

  function setMode(mode: 'challenge' | 'free') {
    gameState.value.mode = mode;
  }

  function setLevel(level: number) {
    gameState.value.level = level;
  }

  function setTargetPattern(pattern: number[][]) {
    gameState.value.targetPattern = pattern;
  }

  function setSelectedColor(colorId: number) {
    gameState.value.selectedColor = colorId;
    gameState.value.isEraserMode = false;
  }

  function toggleEraserMode() {
    gameState.value.isEraserMode = !gameState.value.isEraserMode;
  }

  function placeBead(row: number, col: number, colorId: number) {
    if (row < 0 || row >= gameState.value.gridSize.rows ||
        col < 0 || col >= gameState.value.gridSize.cols) {
      return false;
    }

    saveHistory();
    gameState.value.gridData[row][col] = colorId;
    return true;
  }

  function eraseBead(row: number, col: number) {
    if (row < 0 || row >= gameState.value.gridSize.rows ||
        col < 0 || col >= gameState.value.gridSize.cols) {
      return false;
    }

    saveHistory();
    gameState.value.gridData[row][col] = 0;
    return true;
  }

  function saveHistory() {
    const snapshot = JSON.parse(JSON.stringify(gameState.value.gridData));
    gameState.value.history = gameState.value.history.slice(0, gameState.value.historyIndex + 1);
    gameState.value.history.push(snapshot);
    gameState.value.historyIndex++;

    if (gameState.value.history.length > 50) {
      gameState.value.history.shift();
      gameState.value.historyIndex--;
    }
  }

  function undo() {
    if (canUndo.value) {
      gameState.value.historyIndex--;
      gameState.value.gridData = JSON.parse(JSON.stringify(
        gameState.value.history[gameState.value.historyIndex]
      ));
    }
  }

  function redo() {
    if (canRedo.value) {
      gameState.value.historyIndex++;
      gameState.value.gridData = JSON.parse(JSON.stringify(
        gameState.value.history[gameState.value.historyIndex]
      ));
    }
  }

  function clearGrid() {
    saveHistory();
    gameState.value.gridData = Array(gameState.value.gridSize.rows)
      .fill(null)
      .map(() => Array(gameState.value.gridSize.cols).fill(0));
  }

  function resetGame() {
    gameState.value = {
      mode: 'challenge',
      gridSize: { rows: 16, cols: 16 },
      gridData: [],
      selectedColor: 1,
      isEraserMode: false,
      history: [],
      historyIndex: -1,
    };
  }

  function saveToStorage() {
    localStorage.setItem('fusebead_game', JSON.stringify(gameState.value));
  }

  function loadFromStorage() {
    const saved = localStorage.getItem('fusebead_game');
    if (saved) {
      try {
        gameState.value = JSON.parse(saved);
      } catch (e) {
        console.error('Failed to load game state:', e);
      }
    }
  }

  return {
    gameState,
    canUndo,
    canRedo,
    initializeGrid,
    setMode,
    setLevel,
    setTargetPattern,
    setSelectedColor,
    toggleEraserMode,
    placeBead,
    eraseBead,
    undo,
    redo,
    clearGrid,
    resetGame,
    saveToStorage,
    loadFromStorage,
  };
});
