<template>
  <div class="lv-page">
    <header class="lv-header">
      <router-link to="/" class="lv-back">← 首页</router-link>
      <h1>关卡挑战</h1>
      <div class="lv-progress">
        <div class="lv-progress-bar"><div class="lv-progress-fill" :style="{ width: progressPercent + '%' }"></div></div>
        <span>{{ userStore.currentLevel }}/{{ totalLevels }}</span>
      </div>
    </header>

    <div v-if="hasSavedProgress" class="lv-resume animate-fade-in-up">
      <div class="lv-resume-card">
        <h3>继续游戏</h3>
        <p>检测到未完成的关卡 {{ savedLevel }}，完成度 {{ savedProgress }}%</p>
        <button @click="continueGame" class="lv-resume-btn">继续挑战</button>
      </div>
    </div>

    <div class="lv-grid stagger-children">
      <button
        v-for="lv in levelConfigs"
        :key="lv.level"
        class="lv-card"
        :class="{
          'lv-card--locked': !isUnlocked(lv.level),
          'lv-card--current': lv.level === userStore.currentLevel,
          'lv-card--done': isCompleted(lv.level)
        }"
        :disabled="!isUnlocked(lv.level)"
        @click="selectLevel(lv)"
      >
        <span class="lv-card-num">{{ lv.level }}</span>
        <span class="lv-card-preview" :style="previewStyle(lv.level)"></span>
        <span class="lv-card-icon">{{ isCompleted(lv.level) ? '✓' : isUnlocked(lv.level) ? '☆' : '🔒' }}</span>
        <span class="lv-card-size">{{ lv.gridSize.rows }}×{{ lv.gridSize.cols }}</span>
        <span class="lv-card-reward">{{ lv.reward.base }}分</span>
      </button>
    </div>

    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showModal" class="lv-modal-overlay" @click.self="showModal = false">
          <div class="lv-modal animate-scale-in">
            <h2>第 {{ selected?.level }} 关</h2>
            <div class="lv-modal-preview">
              <div v-for="(row, r) in previewGrid" :key="r" class="lv-modal-preview-row">
                <div v-for="(cell, c) in row" :key="c" class="lv-modal-preview-cell"
                  :style="{ backgroundColor: cell ? getColor(cell) : 'transparent' }">
                </div>
              </div>
            </div>
            <div class="lv-modal-info">
              <div class="lv-info-row"><span>名称</span><span>{{ patternName }}</span></div>
              <div class="lv-info-row"><span>网格</span><span>{{ selected?.gridSize.rows }}×{{ selected?.gridSize.cols }}</span></div>
              <div class="lv-info-row"><span>颜色</span><span>{{ selected?.requiredColors.length }} 种</span></div>
              <div class="lv-info-row"><span>基础分</span><span>{{ selected?.reward.base }}</span></div>
              <div class="lv-info-row"><span>完美分</span><span>{{ selected?.reward.perfect }}</span></div>
            </div>
            <div class="lv-modal-btns">
              <button @click="showModal = false" class="lv-modal-btn--cancel">取消</button>
              <button @click="startLevel" class="lv-modal-btn--go">开始挑战</button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import { useGameStore } from '@/stores/gameStore'
import { getTotalLevels, LEVELS } from '@/assets/levels'
import { ALL_PATTERNS } from '@/assets/patterns'
import { COLOR_LIST } from '@/assets/colors'

const router = useRouter()
const userStore = useUserStore()
const gameStore = useGameStore()

const showModal = ref(false)
const selected = ref<typeof LEVELS[0] | null>(null)
const hasSavedProgress = ref(false)
const savedLevel = ref(1)
const savedProgress = ref(0)

const totalLevels = getTotalLevels()
const levelConfigs = LEVELS

const progressPercent = computed(() =>
  Math.round((userStore.currentLevel / totalLevels) * 100)
)

const selectedIdx = computed(() =>
  selected.value ? selected.value.level - 1 : 0
)

const patternName = computed(() =>
  ALL_PATTERNS[selectedIdx.value]?.name ?? ''
)

const previewGrid = computed(() => {
  const lv = selected.value
  if (!lv) return []
  // show a smaller preview (scale down if too large)
  const grid = lv.targetPattern
  if (lv.gridSize.rows <= 16 && lv.gridSize.cols <= 16) return grid
  // thumbnail: sample every other row/col
  const step = Math.ceil(Math.max(grid.length, grid[0]?.length ?? 0) / 14)
  const thumb: number[][] = []
  for (let r = 0; r < grid.length; r += step) {
    const row: number[] = []
    for (let c = 0; c < (grid[r]?.length ?? 0); c += step) {
      row.push(grid[r]?.[c] ?? 0)
    }
    thumb.push(row)
  }
  return thumb
})

function isUnlocked(n: number) { return userStore.userData.unlockedLevels.includes(n) }
function isCompleted(n: number) { return n < userStore.currentLevel }

function getColor(id: number): string {
  return COLOR_LIST.find(c => c.id === id)?.hex || '#eee'
}

function previewStyle(level: number) {
  const p = ALL_PATTERNS[level - 1]
  if (!p) return {}
  const topColor = p.colors[0]
  const hex = getColor(topColor)
  return { background: `linear-gradient(135deg, ${hex}33, ${hex}88)` }
}

function selectLevel(lv: typeof LEVELS[0]) {
  selected.value = lv
  showModal.value = true
}

function startLevel() {
  if (!selected.value) return
  gameStore.setMode('challenge')
  gameStore.setLevel(selected.value.level)
  gameStore.initializeGrid(selected.value.gridSize.rows, selected.value.gridSize.cols)
  gameStore.setTargetPattern(selected.value.targetPattern)
  router.push('/game')
  showModal.value = false
}

function continueGame() {
  gameStore.loadFromStorage()
  router.push('/game')
}

function checkSaved() {
  const saved = localStorage.getItem('fusebead_game')
  if (!saved) return
  try {
    const state = JSON.parse(saved)
    if (state?.gridData?.length) {
      hasSavedProgress.value = true
      savedLevel.value = state.level || 1
      const total = state.gridSize.rows * state.gridSize.cols
      let filled = 0
      state.gridData.forEach((r: number[]) => r.forEach((c: number) => { if (c !== 0) filled++ }))
      savedProgress.value = Math.round(filled / total * 100)
    }
  } catch { /* ignore */ }
}

onMounted(checkSaved)
</script>

<style scoped>
.lv-page {
  min-height: 100vh;
  min-height: 100dvh;
  background: var(--pg-level);
  padding: 1.5rem;
}

.lv-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}
.lv-header h1 { font-size: 1.5rem; flex: 1; min-width: 0; }
.lv-back { color: var(--color-text-muted); text-decoration: none; padding: 0.4rem 0.8rem; background: rgba(255,255,255,0.7); border-radius: var(--radius-sm); font-size: 0.9rem; }
.lv-back:hover { background: rgba(255,255,255,0.9); }

.lv-progress { display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; color: var(--color-text-muted); font-weight: 600; }
.lv-progress-bar { width: 80px; height: 6px; background: #e5e7eb; border-radius: 3px; overflow: hidden; flex-shrink: 0; }
.lv-progress-fill { height: 100%; background: linear-gradient(90deg, #3b82f6, #6366f1); border-radius: 3px; transition: width 0.5s; }

.lv-resume { margin-bottom: 1.5rem; }
.lv-resume-card { background: var(--color-surface); border-radius: var(--radius-lg); padding: 1.25rem 1.5rem; box-shadow: var(--shadow-sm); display: flex; align-items: center; gap: 1rem; flex-wrap: wrap; }
.lv-resume-card h3 { font-size: 1rem; margin: 0; }
.lv-resume-card p { font-size: 0.85rem; color: var(--color-text-muted); margin: 0; flex: 1; }
.lv-resume-btn { padding: 0.5rem 1.25rem; background: var(--color-primary); color: white; border: none; border-radius: var(--radius-sm); font-weight: 600; cursor: pointer; flex-shrink: 0; }

.lv-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 0.75rem;
  max-width: 1000px;
}

.lv-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 0.75rem 0.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.2rem;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
  position: relative;
  overflow: hidden;
}
.lv-card:not(:disabled):hover { transform: translateY(-3px); box-shadow: var(--shadow-md); }
.lv-card:disabled { opacity: 0.4; cursor: not-allowed; background: #f3f4f6; }
.lv-card--current { border-color: #f59e0b; box-shadow: 0 0 0 2px rgba(245,158,11,0.15); }
.lv-card--done { background: #ecfdf5; border-color: #10b981; }

.lv-card-preview {
  width: 100%;
  height: 24px;
  border-radius: var(--radius-sm);
  margin-bottom: 0.15rem;
}

.lv-card-num {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--color-text-heading);
  line-height: 1;
}
.lv-card-icon { font-size: 1rem; line-height: 1; }
.lv-card-size { font-size: 0.65rem; color: var(--color-text-muted); }
.lv-card-reward { font-size: 0.6rem; color: #f59e0b; font-weight: 600; }

/* Modal */
.lv-modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 1rem; }
.lv-modal { background: var(--color-surface); border-radius: var(--radius-xl); padding: 1.5rem; max-width: 380px; width: 100%; box-shadow: var(--shadow-xl); }
.lv-modal h2 { text-align: center; margin-bottom: 1rem; }

.lv-modal-preview {
  display: inline-grid;
  gap: 1px;
  padding: 0.75rem;
  background: #f9fafb;
  border-radius: var(--radius-sm);
  width: 100%;
  box-sizing: border-box;
  justify-content: center;
  margin-bottom: 1rem;
}
.lv-modal-preview-row { display: flex; gap: 1px; margin-bottom: 1px; }
.lv-modal-preview-cell { width: 10px; height: 10px; border-radius: 1px; }

.lv-modal-info { display: flex; flex-direction: column; gap: 0.4rem; margin-bottom: 1.25rem; }
.lv-info-row { display: flex; justify-content: space-between; padding: 0.5rem 0.75rem; background: #f9fafb; border-radius: var(--radius-sm); font-size: 0.85rem; }
.lv-modal-btns { display: flex; gap: 0.75rem; }
.lv-modal-btn--cancel, .lv-modal-btn--go { flex: 1; padding: 0.65rem; border: none; border-radius: var(--radius-sm); font-weight: 600; cursor: pointer; font-size: 0.9rem; }
.lv-modal-btn--cancel { background: #e5e7eb; color: #374151; }
.lv-modal-btn--go { background: var(--color-primary); color: white; }

.modal-enter-active, .modal-leave-active { transition: opacity 0.2s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }

@media (max-width: 640px) {
  .lv-page { padding: 1rem; }
  .lv-grid { grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap: 0.5rem; }
}
</style>
