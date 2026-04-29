<template>
  <div
    class="pattern-overlay"
    :style="{
      gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
      gap: `${gap}px`,
      opacity: opacity
    }"
  >
    <div
      v-for="(row, r) in pattern"
      :key="r"
      class="overlay-row"
    >
      <div
        v-for="(cell, c) in row"
        :key="c"
        class="overlay-cell"
        :style="{
          width: `${cellSize}px`,
          height: `${cellSize}px`,
          borderRadius: '50%',
          backgroundColor: cell !== 0 ? getColorHex(cell) : 'transparent'
        }"
        :class="{ 'empty': cell === 0 }"
      >
        <div v-if="cell !== 0" class="overlay-dot"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { DEFAULT_COLORS } from '@/assets/colors'

const props = withDefaults(defineProps<{
  pattern: number[][]
  rows: number
  cols: number
  cellSize?: number
  gap?: number
  opacity?: number
}>(), {
  cellSize: 28,
  gap: 3,
  opacity: 0.35
})

function getColorHex(colorId: number): string {
  return DEFAULT_COLORS[colorId]?.hex || '#cccccc'
}
</script>

<style scoped>
.pattern-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: grid;
  pointer-events: none;
  z-index: 1;
}

.overlay-row {
  display: contents;
}

.overlay-cell {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
}

.overlay-cell.empty {
  background-color: transparent !important;
}

.overlay-dot {
  width: 25%;
  height: 25%;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  box-shadow: 0 0 3px rgba(255, 255, 255, 0.3);
}
</style>
