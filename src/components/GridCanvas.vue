<template>
  <div class="gcv-wrap">
    <div class="pegboard" ref="gridRef">
      <div
        class="gcv-grid"
        :style="{
          gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
          gap: `${gap}px`
        }"
      >
        <template v-for="(row, r) in gridData" :key="r">
          <div
            v-for="(cell, c) in row"
            :key="c"
            class="gcv-cell"
            :data-row="r"
            :data-col="c"
            :class="{
              'gcv-cell--highlight': highlightedRow === r && highlightedCol === c,
              'gcv-cell--target': showTarget && hasTargetCell(r, c) && targetPattern![r][c] !== 0 && cell === 0,
              'gcv-cell--filled': cell !== 0,
              'gcv-cell--placing': placingAnim?.row === r && placingAnim?.col === c,
              'gcv-cell--error': errorCell?.row === r && errorCell?.col === c
            }"
          >
            <RealisticBead
              :color-id="cell"
              :color-hex="getColorHex(cell)"
              :size="cellSize"
              :highlighted="highlightedRow === r && highlightedCol === c"
              :error-flash="errorCell?.row === r && errorCell?.col === c"
            />

            <!-- Target guide dot -->
            <div
              v-if="showTarget && hasTargetCell(r, c) && targetPattern![r][c] !== 0 && cell === 0"
              class="gcv-target-dot"
              :style="{ backgroundColor: getTargetColor(targetPattern![r][c]), opacity: targetOpacity }"
            ></div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { DEFAULT_COLORS } from '@/assets/colors'
import RealisticBead from './RealisticBead.vue'

const props = withDefaults(defineProps<{
  gridData: number[][]
  rows: number
  cols: number
  cellSize?: number
  gap?: number
  targetPattern?: number[][] | null
  showTarget?: boolean
  targetOpacity?: number
  highlightedRow?: number | null
  highlightedCol?: number | null
  errorCell?: { row: number; col: number } | null
  placingAnim?: { row: number; col: number } | null
}>(), {
  cellSize: 28,
  gap: 3,
  targetPattern: null,
  showTarget: false,
  targetOpacity: 0.35,
  highlightedRow: null,
  highlightedCol: null,
  errorCell: null,
  placingAnim: null
})

const gridRef = ref<HTMLElement | null>(null)

function getColorHex(id: number): string {
  if (id === 0) return '#e0d5c5'
  return DEFAULT_COLORS[id]?.hex || '#ccc'
}
function getTargetColor(id: number): string {
  return DEFAULT_COLORS[id]?.hex || '#ccc'
}

function hasTargetCell(r: number, c: number): boolean {
  if (!props.targetPattern) return false
  return !!props.targetPattern[r]?.[c]
}

defineExpose({ gridRef })
</script>

<style scoped>
.gcv-wrap {
  display: inline-flex;
  align-items: flex-start;
  justify-content: center;
}

.pegboard {
  background: linear-gradient(180deg, var(--peg-surface), color-mix(in srgb, var(--peg-surface) 80%, var(--peg-cell)));
  border: 2px solid var(--peg-border);
  border-radius: 0.75rem;
  padding: 0.6rem;
  box-shadow:
    0 4px 16px rgba(0,0,0,0.08),
    inset 0 1px 0 rgba(255,255,255,0.4);
  position: relative;
  overflow: hidden;
}

.pegboard::before {
  content: '';
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.01) 2px, rgba(0,0,0,0.01) 3px),
              repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(0,0,0,0.01) 2px, rgba(0,0,0,0.01) 3px);
  pointer-events: none;
  border-radius: inherit;
}

.gcv-grid {
  display: grid;
  position: relative;
  z-index: 1;
}

.gcv-cell {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.12s ease;
}

.gcv-cell:active {
  transform: scale(0.92);
}

.gcv-cell--highlight {
  z-index: 3;
}
.gcv-cell--highlight::after {
  content: '';
  position: absolute;
  inset: -4px;
  border-radius: 50%;
  border: 2px solid rgba(78,205,196,0.5);
  box-shadow: 0 0 8px rgba(78,205,196,0.3);
  animation: highlightPulse 1s ease-in-out infinite;
  pointer-events: none;
}

@keyframes highlightPulse {
  0%, 100% { box-shadow: 0 0 4px rgba(78,205,196,0.2); }
  50% { box-shadow: 0 0 12px rgba(78,205,196,0.5); }
}

.gcv-target-dot {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  pointer-events: none;
  z-index: 1;
}

.gcv-cell--target {
  animation: targetHint 2s ease-in-out infinite;
}
@keyframes targetHint {
  0%, 100% { filter: brightness(1); }
  50% { filter: brightness(1.08); }
}

.gcv-cell--placing {
  animation: beadBounce 0.35s ease-out;
}
@keyframes beadBounce {
  0% { transform: scale(1.4); opacity: 0.4; }
  55% { transform: scale(0.9); opacity: 1; }
  100% { transform: scale(1); opacity: 1; }
}

.gcv-cell--error {
  animation: beadShake 0.4s ease-in-out;
}
@keyframes beadShake {
  0%, 100% { filter: brightness(1); }
  25% { filter: brightness(1.6) saturate(0.5); }
  50% { filter: brightness(0.7); }
  75% { filter: brightness(1.4) saturate(0.5); }
}

@media (max-width: 768px) {
  .pegboard {
    padding: 0.35rem;
    border-radius: 0.5rem;
    border-width: 1.5px;
  }
}
</style>
