<template>
  <div
    class="realistic-bead-wrapper"
    :class="{
      'has-bead': colorId !== 0,
      'is-empty': colorId === 0,
      'is-highlighted': highlighted,
      'is-error': errorFlash
    }"
    :style="{
      width: `${size}px`,
      height: `${size}px`
    }"
  >
    <!-- Empty peg socket -->
    <div v-if="colorId === 0" class="peg-socket">
      <div class="peg-top"></div>
    </div>

    <!-- Filled realistic bead -->
    <div
      v-else
      class="bead-realistic"
      :style="{
        background: `radial-gradient(
          circle at 30% 30%,
          ${lighten(colorHex, 40)} 0%,
          ${colorHex} 40%,
          ${darken(colorHex, 20)} 100%
        )`,
        boxShadow: `
          0 ${size * 0.08}px ${size * 0.16}px rgba(0,0,0,0.3),
          inset 0 -${size * 0.06}px ${size * 0.1}px rgba(0,0,0,0.2),
          inset 0 ${size * 0.06}px ${size * 0.1}px rgba(255,255,255,0.4)
        `
      }"
    >
      <div class="bead-highlight"></div>
      <div class="bead-hole"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  colorId: number
  colorHex: string
  size: number
  highlighted?: boolean
  errorFlash?: boolean
}>(), {
  highlighted: false,
  errorFlash: false
})

function lighten(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16)
  const r = Math.min(255, (num >> 16) + Math.floor(255 * percent / 100))
  const g = Math.min(255, ((num >> 8) & 0x00FF) + Math.floor(255 * percent / 100))
  const b = Math.min(255, (num & 0x0000FF) + Math.floor(255 * percent / 100))
  return `rgb(${r},${g},${b})`
}

function darken(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16)
  const r = Math.max(0, (num >> 16) - Math.floor(255 * percent / 100))
  const g = Math.max(0, ((num >> 8) & 0x00FF) - Math.floor(255 * percent / 100))
  const b = Math.max(0, (num & 0x0000FF) - Math.floor(255 * percent / 100))
  return `rgb(${r},${g},${b})`
}
</script>

<style scoped>
.realistic-bead-wrapper {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: transform 0.15s ease;
  flex-shrink: 0;
}

.realistic-bead-wrapper.is-highlighted {
  z-index: 2;
  transform: scale(1.12);
}

.realistic-bead-wrapper.is-error {
  animation: beadError 0.4s ease-in-out;
}

@keyframes beadError {
  0%, 100% { transform: scale(1); }
  25% { transform: scale(1.1); filter: brightness(1.5); }
  50% { transform: scale(0.95); }
  75% { transform: scale(1.05); filter: brightness(1.3); }
}

/* Peg socket (empty cell) */
.peg-socket {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--peg-cell), var(--peg-cell-dark));
  box-shadow:
    0 2px 3px rgba(0, 0, 0, 0.2),
    inset 0 1px 2px rgba(255, 255, 255, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
}

.peg-top {
  width: 50%;
  height: 50%;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--peg-cell), var(--peg-cell-dark));
  box-shadow:
    inset 0 2px 3px rgba(255, 255, 255, 0.3),
    inset 0 -1px 2px rgba(0, 0, 0, 0.2);
}

/* Realistic bead */
.bead-realistic {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  transition: transform 0.2s ease;
  overflow: hidden;
}

.bead-highlight {
  position: absolute;
  top: 12%;
  left: 18%;
  width: 32%;
  height: 22%;
  border-radius: 50%;
  background: radial-gradient(
    ellipse at center,
    rgba(255, 255, 255, 0.7) 0%,
    rgba(255, 255, 255, 0) 100%
  );
  transform: rotate(-25deg);
  pointer-events: none;
}

.bead-hole {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 30%;
  height: 30%;
  border-radius: 50%;
  background: radial-gradient(
    circle at 40% 40%,
    rgba(0, 0, 0, 0.15) 0%,
    rgba(0, 0, 0, 0.4) 60%,
    rgba(0, 0, 0, 0.5) 100%
  );
  box-shadow:
    inset 0 1px 1px rgba(0, 0, 0, 0.4),
    inset 0 -1px 1px rgba(255, 255, 255, 0.15);
  pointer-events: none;
}

.realistic-bead-wrapper.has-bead:hover .bead-realistic {
  transform: scale(1.08);
  filter: brightness(1.08);
}

.realistic-bead-wrapper.is-empty:hover .peg-socket {
  filter: brightness(1.1);
}
</style>
