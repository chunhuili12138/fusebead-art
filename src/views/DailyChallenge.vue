<template>
  <div class="dc-page">
    <header class="dc-header">
      <router-link to="/" class="dc-back">← 首页</router-link>
      <h1>每日挑战</h1>
      <span class="dc-date">{{ currentDate }}</span>
    </header>

    <div v-if="dailyStore.isTodayCompleted" class="dc-done animate-scale-in">
      <div class="dc-done-icon">🎉</div>
      <h2>今日挑战已完成</h2>
      <div class="dc-done-stats">
        <div class="dc-done-stat"><span>准确率</span><strong>{{ lastAccuracy }}%</strong></div>
        <div class="dc-done-stat"><span>积分</span><strong>+{{ lastScore }}</strong></div>
      </div>
      <p>明天再来挑战新图案吧</p>
      <router-link to="/" class="dc-done-btn">返回首页</router-link>
    </div>

    <div v-else class="dc-body">
      <div class="dc-main animate-fade-in-up">
        <h2>今日图案</h2>
        <p class="dc-pattern-name">{{ patternDisplayName }}</p>

        <div class="dc-preview">
          <div v-for="(row, r) in targetPattern" :key="r" class="dc-preview-row">
            <div v-for="(cell, c) in row" :key="c" class="dc-preview-cell" :style="{ backgroundColor: cell ? getColor(cell) : '#f3f4f6' }"></div>
          </div>
        </div>

        <div class="dc-info">
          <div class="dc-info-row"><span>网格</span><span>{{ gridSize.rows }}×{{ gridSize.cols }}</span></div>
        </div>

        <div class="dc-rewards">
          <h3>奖励规则</h3>
          <div class="dc-reward"><span>100% 准确率</span><strong>50 积分</strong></div>
          <div class="dc-reward"><span>80%-99%</span><strong>30 积分</strong></div>
          <div class="dc-reward"><span>60%-79%</span><strong>10 积分</strong></div>
        </div>

        <button @click="startChallenge" class="dc-start-btn">开始挑战</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useDailyStore } from '@/stores/dailyStore'
import { useGameStore } from '@/stores/gameStore'
import { generateHeartPattern, generateStarPattern, generateFlowerPattern, generateDiamondPattern, generateSmileyPattern } from '@/utils/patternGenerator'
import { COLOR_LIST } from '@/assets/colors'

const router = useRouter()
const dailyStore = useDailyStore()
const gameStore = useGameStore()

const gridSize = ref({ rows: 16, cols: 16 })
const targetPattern = ref<number[][]>([])
const lastAccuracy = ref(0)
const lastScore = ref(0)

const currentDate = computed(() => {
  const d = new Date()
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`
})

const patternDisplayName = computed(() => {
  const names: Record<string, string> = { heart: '爱心', star: '星星', flower: '花朵', diamond: '钻石', smiley: '笑脸' }
  return names[dailyStore.todayChallenge?.patternId || 'heart'] || '神秘图案'
})

function loadPattern() {
  const id = dailyStore.todayChallenge?.patternId || 'heart'
  const fn: Record<string, (s: number) => number[][]> = { heart: generateHeartPattern, star: generateStarPattern, flower: generateFlowerPattern, diamond: generateDiamondPattern, smiley: generateSmileyPattern }
  targetPattern.value = (fn[id] || generateHeartPattern)(16)
}

function getColor(id: number) { return COLOR_LIST.find(c => c.id === id)?.hex || '#ccc' }

function startChallenge() {
  gameStore.setMode('challenge')
  gameStore.initializeGrid(gridSize.value.rows, gridSize.value.cols)
  gameStore.setTargetPattern(targetPattern.value)
  router.push('/game?from=/daily')
}

onMounted(() => {
  dailyStore.initializeToday()
  loadPattern()
})
</script>

<style scoped>
.dc-page { min-height: 100vh; min-height: 100dvh;   background: var(--pg-daily); padding: 1.5rem; display: flex; flex-direction: column; }

.dc-header { display: flex; align-items: center; gap: 1rem; margin-bottom: 2rem; }
.dc-header h1 { flex: 1; font-size: 1.5rem; }
.dc-back { color: var(--color-text-muted); text-decoration: none; padding: 0.4rem 0.8rem; background: rgba(255,255,255,0.7); border-radius: var(--radius-sm); font-size: 0.9rem; }
.dc-date { font-size: 0.9rem; color: var(--color-text-muted); }

.dc-done { text-align: center; background: var(--color-surface); border-radius: var(--radius-xl); padding: 3rem 2rem; box-shadow: var(--shadow-md); max-width: 440px; margin: 2rem auto; width: 100%; }
.dc-done-icon { font-size: 4rem; margin-bottom: 1rem; }
.dc-done h2 { color: #10b981; margin-bottom: 1.5rem; }
.dc-done-stats { display: flex; justify-content: center; gap: 2rem; margin-bottom: 1.5rem; }
.dc-done-stat { display: flex; flex-direction: column; }
.dc-done-stat span { font-size: 0.8rem; color: var(--color-text-muted); }
.dc-done-stat strong { font-size: 1.3rem; color: var(--color-text-heading); }
.dc-done p { color: var(--color-text-muted); margin-bottom: 1.5rem; }
.dc-done-btn { display: inline-block; padding: 0.75rem 2rem; background: var(--color-primary); color: white; text-decoration: none; border-radius: var(--radius-sm); font-weight: 600; }

.dc-body { display: flex; justify-content: center; flex: 1; }
.dc-main { background: var(--color-surface); border-radius: var(--radius-xl); padding: 2rem; box-shadow: var(--shadow-md); max-width: 480px; width: 100%; text-align: center; }
.dc-main h2 { margin-bottom: 0.25rem; }
.dc-pattern-name { color: var(--color-text-muted); font-size: 1.1rem; margin-bottom: 1.25rem; }

.dc-preview { display: inline-block; background: #f9fafb; padding: 1rem; border-radius: var(--radius-md); margin-bottom: 1.25rem; }
.dc-preview-row { display: flex; gap: 1px; margin-bottom: 1px; }
.dc-preview-cell { width: 10px; height: 10px; border-radius: 1px; }

.dc-info { margin-bottom: 1rem; }
.dc-info-row { display: flex; justify-content: space-between; padding: 0.5rem 0.75rem; background: #f9fafb; border-radius: var(--radius-sm); font-size: 0.85rem; }

.dc-rewards { margin-bottom: 1.5rem; text-align: left; }
.dc-rewards h3 { font-size: 0.85rem; margin-bottom: 0.5rem; }
.dc-reward { display: flex; justify-content: space-between; padding: 0.4rem 0.5rem; border-bottom: 1px solid #f3f4f6; font-size: 0.85rem; }
.dc-reward:last-child { border: none; }
.dc-reward span { color: var(--color-text-muted); }
.dc-reward strong { color: #f59e0b; }

.dc-start-btn { width: 100%; padding: 0.9rem; background: var(--color-primary); color: white; border: none; border-radius: var(--radius-md); font-size: 1.05rem; font-weight: 600; cursor: pointer; transition: background 0.2s; }
.dc-start-btn:hover { background: var(--color-primary-dark); }

@media (max-width: 640px) {
  .dc-page { padding: 1rem; }
  .dc-main { padding: 1.5rem; }
}
</style>
