<template>
  <div
    v-if="state.isActive"
    class="tweezers-cursor"
    :class="{
      'holding-bead': state.isHoldingBead,
      'is-mobile': isMobile
    }"
    :style="cursorStyle"
  >
    <div class="cursor-assembly">
      <!-- Tweezers on top -->
      <svg
        viewBox="0 0 40 60"
        :width="tweezerSize"
        :height="svgHeight"
        class="tweezers-svg"
      >
        <!-- Left arm -->
        <path
          d="M10 0 C8 10, 8 20, 6 35 C5 42, 6 48, 4 55 C3 58, 8 58, 9 55 C10 48, 11 38, 12 30 L14 10Z"
          :fill="tweezerColor"
          stroke="#888"
          stroke-width="0.5"
        />
        <!-- Right arm -->
        <path
          d="M30 0 C32 10, 32 20, 34 35 C35 42, 34 48, 36 55 C37 58, 32 58, 31 55 C30 48, 29 38, 28 30 L26 10Z"
          :fill="tweezerColor"
          stroke="#888"
          stroke-width="0.5"
        />
        <!-- Connection ring -->
        <ellipse cx="20" cy="6" rx="9" ry="3" :fill="tweezerColor" stroke="#888" stroke-width="0.5"/>
        <!-- Grip texture -->
        <line x1="12" y1="18" x2="28" y2="18" stroke="#aaa" stroke-width="1" opacity="0.6"/>
        <line x1="11" y1="22" x2="29" y2="22" stroke="#aaa" stroke-width="1" opacity="0.6"/>
        <line x1="10" y1="26" x2="30" y2="26" stroke="#aaa" stroke-width="1" opacity="0.6"/>
      </svg>

      <!-- Bead grasped at tweezer tip -->
      <div
        v-if="state.isHoldingBead && state.beadColor"
        class="held-bead"
        :style="beadStyle"
      >
        <div class="bead-highlight"></div>
        <div class="bead-hole"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useResponsive } from '@/composables/useResponsive'
import type { TweezerState } from '@/composables/useTweezers'

const props = withDefaults(defineProps<{
  state: TweezerState
  tweezerSize?: number
}>(), {
  tweezerSize: 36
})

const { isMobile } = useResponsive()
const tweezerColor = '#c0c0c0'

const svgHeight = computed(() => props.tweezerSize * 1.5)

// The bead center should align with the cursor.
// Layout: SVG height (= tweezerSize*1.5) + negative margin + bead.
// Bead center from container top = tweezerSize * 1.5 - 4 (beadSize cancels out).
const cursorStyle = computed(() => {
  const cx = props.state.x
  const cy = props.state.y
  const offsetY = -(props.tweezerSize * 1.5 - 4)
  return {
    left: `${cx}px`,
    top: `${cy}px`,
    transform: `translate(-50%, ${offsetY}px)`
  }
})

// Position bead at the tweezer tip: top of bead at svgHeight * tipFraction - beadRadius
// with margin-top overlap so it sits right at the tips, behind the tweezers (z-index)
const beadStyle = computed(() => {
  const h = props.state.beadSize
  return {
    width: `${h}px`,
    height: `${h}px`,
    marginTop: `${-(h * 0.5 + 4)}px`,
    background: props.state.beadColor
      ? `radial-gradient(circle at 30% 30%, ${lighten(props.state.beadColor, 40)} 0%, ${props.state.beadColor} 40%, ${darken(props.state.beadColor, 20)} 100%)`
      : '#ccc',
    boxShadow: `
      0 ${h * 0.08}px ${h * 0.16}px rgba(0,0,0,0.3),
      inset 0 -${h * 0.06}px ${h * 0.1}px rgba(0,0,0,0.2),
      inset 0 ${h * 0.06}px ${h * 0.1}px rgba(255,255,255,0.4)
    `
  }
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
.tweezers-cursor {
  position: fixed;
  pointer-events: none;
  z-index: 9999;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
  transition: opacity 0.1s ease;
}

.cursor-assembly {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.tweezers-svg {
  position: relative;
  z-index: 2;
  filter: drop-shadow(0 1px 2px rgba(0,0,0,0.2));
  transform: rotate(-3deg);
  transition: transform 0.15s ease;
}

.tweezers-cursor.holding-bead .tweezers-svg {
  transform: rotate(-3deg) scale(1.05);
}

.held-bead {
  position: relative;
  z-index: 1;
  border-radius: 50%;
  overflow: hidden;
  animation: beadSnap 0.3s ease-out;
}

@keyframes beadSnap {
  0% {
    transform: translateY(-6px) scale(0.6);
    opacity: 0;
  }
  60% {
    transform: translateY(1px) scale(1.05);
    opacity: 1;
  }
  100% {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
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

/* Mobile */
.tweezers-cursor.is-mobile {
  opacity: 0.85;
}

@media (max-width: 768px) {
  .tweezers-svg {
    transform: rotate(-3deg) scale(0.85);
  }
}
</style>
