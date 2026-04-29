<template>
  <div class="bb-root" :class="{ 'bb-root--mobile': isMobile }">
    <div v-if="showTitle" class="bb-header">
      <h3 class="bb-title">{{ title }}</h3>
    </div>

    <div class="bb-families">
      <div
        v-for="fam in families"
        :key="fam.id"
        class="bb-family"
      >
        <button
          class="bb-family-header"
          @click="toggleFamily(fam.id)"
          :aria-expanded="expanded.has(fam.id)"
        >
          <span class="bb-family-name">{{ fam.name }}</span>
          <span class="bb-family-preview">
            <span
              v-for="c in famInline(fam)"
              :key="c.id"
              class="bb-inline-dot"
              :style="dotStyle(c)"
            ></span>
          </span>
          <svg
            class="bb-chevron"
            :class="{ 'bb-chevron--open': expanded.has(fam.id) }"
            viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"
          >
            <path d="M6 9l6 6 6-6"/>
          </svg>
        </button>

        <Transition name="bb-expand">
          <div v-show="expanded.has(fam.id)" class="bb-family-body">
            <button
              v-for="c in fam.colors"
              :key="c.id"
              class="bb-bead"
              :class="{
                'bb-bead--selected': selectedColor === c.id && !isEraserMode,
                'bb-bead--disabled': c.disabled,
              }"
              @click="onPick(c.id)"
              :disabled="c.disabled"
              :aria-label="c.name"
              :title="c.name"
            >
              <span
                class="bb-bead-circle"
                :style="{ background: c.hex }"
              ></span>
              <span class="bb-bead-name">{{ c.name }}</span>
              <span v-if="showCount && c.count !== undefined" class="bb-bead-count">{{ c.count }}</span>
            </button>
          </div>
        </Transition>
      </div>

      <!-- Eraser -->
      <button
        v-if="showEraser"
        class="bb-eraser"
        :class="{ 'bb-eraser--active': isEraserMode }"
        @click="onEraser"
        aria-label="橡皮擦"
      >
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M20 20H7L3 16l9-9 8 8-1 5z"/><path d="M6.5 13.5l7-7"/>
        </svg>
        <span>橡皮擦</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useResponsive } from '@/composables/useResponsive'

export interface BeadColor {
  id: number
  name: string
  hex: string
  label?: string
  count?: number
  disabled?: boolean
}

interface FamilyGroup {
  id: string
  name: string
  colors: BeadColor[]
}

const props = withDefaults(defineProps<{
  families: FamilyGroup[]
  selectedColor: number | null
  isEraserMode?: boolean
  showTitle?: boolean
  title?: string
  showEraser?: boolean
  showCount?: boolean
}>(), {
  showTitle: true,
  title: '豆子盒',
  showEraser: true,
  showCount: false,
  isEraserMode: false,
})

const emit = defineEmits<{
  (e: 'pick', colorId: number): void
  (e: 'eraser'): void
}>()

const { isMobile } = useResponsive()
const expanded = reactive(new Set<string>())

// Expand first family by default on desktop
if (!isMobile.value && props.families.length > 0) {
  expanded.add(props.families[0].id)
}

function toggleFamily(id: string) {
  if (expanded.has(id)) {
    expanded.delete(id)
  } else {
    expanded.clear()
    expanded.add(id)
  }
}

function famInline(fam: FamilyGroup) {
  return fam.colors.slice(0, 3)
}

function dotStyle(c: BeadColor) {
  return { background: `radial-gradient(circle at 35% 35%, white 0%, ${c.hex} 35%, ${c.hex} 100%)` }
}

function onPick(id: number) {
  emit('pick', id)
}

function onEraser() {
  emit('eraser')
}
</script>

<style scoped>
.bb-root {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
  max-height: 100%;
  display: flex;
  flex-direction: column;
}

.bb-header {
  padding: 0.55rem 0.75rem;
  border-bottom: 1px solid var(--color-border);
  flex-shrink: 0;
}

.bb-title {
  font-size: 0.8rem;
  color: var(--color-text-muted);
  font-weight: 600;
  margin: 0;
}

.bb-families {
  overflow-y: auto;
  flex: 1;
}

/* Family section */
.bb-family {
  border-bottom: 1px solid #f3f4f6;
}
.bb-family:last-child { border-bottom: none; }

.bb-family-header {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  width: 100%;
  padding: 0.4rem 0.6rem;
  border: none;
  background: none;
  cursor: pointer;
  font-family: inherit;
  font-size: 0.75rem;
  color: var(--color-text);
  transition: background 0.15s;
}
.bb-family-header:hover { background: #f9fafb; }

.bb-family-name {
  font-weight: 600;
  color: var(--color-text-muted);
  white-space: nowrap;
  min-width: 42px;
  text-align: left;
}

.bb-family-preview {
  display: flex;
  gap: 3px;
  flex: 1;
}

.bb-inline-dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 1px solid rgba(0,0,0,0.15);
  box-shadow: 0 1px 2px rgba(0,0,0,0.1);
  flex-shrink: 0;
}

.bb-chevron {
  flex-shrink: 0;
  color: var(--color-text-muted);
  transition: transform 0.2s;
}
.bb-chevron--open { transform: rotate(180deg); }

/* Expanded body */
.bb-family-body {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(56px, 1fr));
  gap: 3px;
  padding: 0.35rem 0.5rem 0.5rem;
}

.bb-bead {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1px;
  padding: 0.3rem 0.15rem;
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: #fdfcf9;
  cursor: pointer;
  transition: all 0.12s;
  font-family: inherit;
  min-width: 48px;
}
.bb-bead:hover:not(:disabled) { border-color: #c4b5a0; background: #faf6f0; }
.bb-bead:active:not(:disabled) { transform: scale(0.95); }
.bb-bead--selected {
  border-color: var(--color-primary);
  background: color-mix(in srgb, var(--color-primary) 8%, var(--color-surface));
  box-shadow: 0 0 0 2px rgba(255,107,157,0.18);
}
.bb-bead--disabled { opacity: 0.3; cursor: not-allowed; }

.bb-bead-circle {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 1.5px solid rgba(0,0,0,0.12);
  box-shadow: inset 0 1px 2px rgba(255,255,255,0.4), 0 1px 2px rgba(0,0,0,0.1);
  flex-shrink: 0;
}

.bb-bead-name {
  font-size: 0.55rem;
  color: var(--color-text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  line-height: 1;
}

.bb-bead-count {
  font-size: 0.5rem;
  color: var(--color-text-muted);
  background: rgba(0,0,0,0.05);
  padding: 0.05rem 0.3rem;
  border-radius: 0.4rem;
  font-weight: 600;
}

/* Eraser */
.bb-eraser {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  width: 100%;
  padding: 0.5rem;
  border: none;
  border-top: 1px solid var(--color-border);
  background: none;
  cursor: pointer;
  font-family: inherit;
  font-size: 0.78rem;
  color: var(--color-text-muted);
  transition: background 0.15s;
  flex-shrink: 0;
}
.bb-eraser:hover { background: #f9fafb; }
.bb-eraser--active { background: #e0faf7; color: #2c9e96; }

/* Transition */
.bb-expand-enter-active { transition: all 0.2s ease; }
.bb-expand-leave-active { transition: all 0.15s ease; }
.bb-expand-enter-from, .bb-expand-leave-to { opacity: 0; max-height: 0; overflow: hidden; }
.bb-expand-enter-to, .bb-expand-leave-from { opacity: 1; max-height: 400px; }

/* Mobile */
.bb-root--mobile {
  max-height: 180px;
}
.bb-root--mobile .bb-bead {
  min-width: 44px;
  padding: 0.25rem 0.1rem;
}
.bb-root--mobile .bb-bead-circle {
  width: 18px;
  height: 18px;
}
@media (max-width: 768px) {
  .bb-family-body { grid-template-columns: repeat(auto-fill, minmax(48px, 1fr)); }
}
</style>
