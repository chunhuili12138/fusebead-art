<template>
  <!-- ═══════ PC Layout ═══════ -->
  <div v-if="!isMobile" class="pc-root">
    <header class="pc-header">
      <router-link :to="backRoute" class="pc-back">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        <span>返回</span>
      </router-link>

      <div class="pc-title-group">
        <h1 class="pc-title">{{ gameTitle }}</h1>
        <span class="pc-badge" :class="gameStore.gameState.mode === 'free' ? 'pc-badge--free' : ''">
          {{ gameStore.gameState.mode === 'challenge' ? '挑战模式' : '自由创作' }}
        </span>
      </div>

      <div class="pc-actions">
        <button @click="undo" :disabled="!canUndo" class="pc-btn" title="撤销"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 7v6h6"/><path d="M21 17a9 9 0 00-9-9 9 9 0 00-6 2.3L3 13"/></svg></button>
        <button @click="redo" :disabled="!canRedo" class="pc-btn" title="重做"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 7v6h-6"/><path d="M3 17a9 9 0 019-9 9 9 0 016 2.3L21 13"/></svg></button>
        <button @click="clearGrid" class="pc-btn" title="清空"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14"/></svg></button>
        <button v-if="targetPattern.length" @click="showTargetPattern = !showTargetPattern" class="pc-btn" :class="{ 'pc-btn--active': showTargetPattern }" :title="showTargetPattern ? '隐藏参考图' : '显示参考图'"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" v-html="targetToggleIcon"></svg></button>
        <button v-if="gameStore.gameState.mode === 'free'" @click="exportImage" class="pc-btn" title="导出"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg></button>
        <button @click="showResult" class="pc-btn--submit">完成</button>
      </div>
    </header>

    <div class="pc-body">
      <div class="pc-canvas" @mouseenter="onGameAreaEnter" @mouseleave="onGameAreaLeave">
        <div id="game-grid" class="pc-grid">
          <GridCanvas :grid-data="gameStore.gameState.gridData" :rows="gameStore.gameState.gridSize.rows" :cols="gameStore.gameState.gridSize.cols" :cell-size="beadSize" :gap="gridGap" :target-pattern="showTargetPattern ? targetPattern : null" :show-target="showTargetPattern && !!targetPattern.length" :target-opacity="0.3" :highlighted-row="highlightedCell?.row ?? null" :highlighted-col="highlightedCell?.col ?? null" :error-cell="errorCell" :placing-anim="placingAnimCell" />
        </div>
      </div>

      <aside class="pc-tools">
        <BeadBox :families="colorFamilies" :selected-color="gameStore.gameState.selectedColor" :is-eraser-mode="gameStore.gameState.isEraserMode" :show-count="gameStore.gameState.mode === 'challenge'" show-title @pick="onColorPick" @eraser="onEraserToggle" />
      </aside>
    </div>

    <TweezersCursor :state="tweezerState" :tweezer-size="36" />
  </div>

  <!-- ═══════ Mobile Layout ═══════ -->
  <div v-else class="m-root">
    <header class="m-header">
      <router-link :to="backRoute" class="m-back"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg></router-link>
      <h1 class="m-title">{{ gameTitle }}</h1>
      <div class="m-actions">
        <button @click="undo" :disabled="!canUndo" class="m-btn"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 7v6h6"/><path d="M21 17a9 9 0 00-9-9 9 9 0 00-6 2.3L3 13"/></svg></button>
        <button @click="showPreview = true" class="m-btn" title="预览全图"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg></button>
        <button @click="showResult" class="m-btn--submit">完成</button>
      </div>
    </header>

    <div class="m-canvas" id="game-grid" @click="onGridClick">
      <div class="m-canvas-inner">
        <GridCanvas :grid-data="gameStore.gameState.gridData" :rows="gameStore.gameState.gridSize.rows" :cols="gameStore.gameState.gridSize.cols" :cell-size="beadSize" :gap="gridGap" :target-pattern="showTargetPattern ? targetPattern : null" :show-target="!!targetPattern.length" :target-opacity="0.3" :highlighted-row="highlightedCell?.row ?? null" :highlighted-col="highlightedCell?.col ?? null" :error-cell="errorCell" :placing-anim="placingAnimCell" />
      </div>
    </div>

    <div class="m-tools">
      <BeadBox :families="colorFamilies" :selected-color="gameStore.gameState.selectedColor" :is-eraser-mode="gameStore.gameState.isEraserMode" :show-count="gameStore.gameState.mode === 'challenge'" :show-title="false" @pick="onColorPick" @eraser="onEraserToggle" />
      <div class="m-tips"><span>👆 点豆子选色</span><span>📌 点格子放置</span></div>
    </div>
  </div>

  <!-- ═══════ Shared: Score modal ═══════ -->
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="showScoreModal" class="modal-overlay" @click.self="closeScoreModal">
        <div class="modal-card animate-scale-in">
          <div class="modal-icon">🎉</div>
          <h2 class="modal-title">{{ resultTitle }}</h2>
          <div class="modal-stats">
            <div class="modal-stat"><div class="modal-stat-label">准确率</div><div class="modal-stat-value">{{ scoreResult.accuracy }}%</div></div>
            <div class="modal-stat"><div class="modal-stat-label">完成度</div><div class="modal-stat-value">{{ scoreResult.completion }}%</div></div>
            <div class="modal-stat modal-stat--highlight"><div class="modal-stat-label">获得积分</div><div class="modal-stat-value">+{{ scoreResult.score }}</div></div>
          </div>
          <div class="modal-badge" :class="performanceClass">{{ performanceLevel }}</div>
          <div class="modal-actions">
            <button @click="closeScoreModal" class="modal-btn--secondary">继续编辑</button>
            <button @click="finishGame" class="modal-btn--primary">完成返回</button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>

  <!-- Preview modal (mobile) -->
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="showPreview" class="modal-overlay" @click.self="showPreview = false">
        <div class="preview-modal animate-scale-in">
          <div class="preview-header">
            <h3>全图预览</h3>
            <button @click="showPreview = false" class="preview-close">✕</button>
          </div>
          <div class="preview-body">
            <canvas ref="previewCanvasRef"></canvas>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useGameStore } from '@/stores/gameStore'
import { useUserStore } from '@/stores/userStore'
import { useDragBead } from '@/composables/useDragBead'
import { useGridLogic } from '@/composables/useGridLogic'
import { useScoreCalc } from '@/composables/useScoreCalc'
import { useResponsive } from '@/composables/useResponsive'
import { useTweezers } from '@/composables/useTweezers'
import { COLOR_LIST, DEFAULT_COLORS, COLOR_FAMILIES } from '@/assets/colors'
import { renderGridToCanvas, exportGridAsPNG } from '@/utils/imageExporter'
import GridCanvas from '@/components/GridCanvas.vue'
import BeadBox from '@/components/BeadBox.vue'
import TweezersCursor from '@/components/TweezersCursor.vue'
import { normalizeEvent } from '@/utils/eventAdapter'

const router = useRouter()
const route = useRoute()
const gameStore = useGameStore()
const userStore = useUserStore()
const { calculateScore, getPerformanceLevel } = useScoreCalc()
const { beadSize: defaultBeadSize, gridGap, isMobile } = useResponsive()

const showScoreModal = ref(false)
const showPreview = ref(false)
const previewCanvasRef = ref<HTMLCanvasElement | null>(null)
const scoreResult = ref({ accuracy: 0, completion: 0, score: 0 })
const showTargetPattern = ref(true)
const errorCell = ref<{row:number;col:number}|null>(null)
const placingAnimCell = ref<{row:number;col:number}|null>(null)

const { highlightedCell } = useGridLogic(computed(() => gameStore.gameState.gridData), gameStore.gameState.gridSize)
const { state: tweezerState, showTweezers, hideTweezers, holdBead, releaseBead } = useTweezers({ beadSize: defaultBeadSize.value })

// Adaptive bead size for mobile
const beadSize = computed(() => {
  const cols = gameStore.gameState.gridSize.cols
  const base = defaultBeadSize.value
  if (!isMobile.value || cols <= 16) return base
  const availW = window.innerWidth - 32
  const maxCell = Math.floor((availW - (12 * 2)) / 12)
  return Math.max(12, Math.min(base, maxCell))
})

const backRoute = computed(() => route.query.from as string || (gameStore.gameState.mode === 'challenge' ? '/level' : '/free'))
const gameTitle = computed(() => gameStore.gameState.mode === 'challenge' ? (gameStore.gameState.level ? `第 ${gameStore.gameState.level} 关` : '每日挑战') : '自由创作')
const resultTitle = computed(() => gameStore.gameState.mode === 'challenge' ? '挑战完成！' : '作品统计')
const targetPattern = computed(() => gameStore.gameState.targetPattern || [])
const canUndo = computed(() => gameStore.canUndo)
const canRedo = computed(() => gameStore.canRedo)
const performanceLevel = computed(() => getPerformanceLevel(scoreResult.value.accuracy))
const performanceClass = computed(() => { const a=scoreResult.value.accuracy; if(a>=100)return'badge--perfect';if(a>=90)return'badge--excellent';if(a>=75)return'badge--good';if(a>=60)return'badge--pass';return'badge--fail' })
const targetToggleIcon = computed(() => showTargetPattern.value ? '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>' : '<path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>')

const colorFamilies = computed(() => {
  const used: Record<number,number> = {}; gameStore.gameState.gridData.forEach(r=>r.forEach(c=>{if(c)used[c]=(used[c]||0)+1}))
  const isC = gameStore.gameState.mode === 'challenge'; const total: Record<number,number> = {}
  if(isC&&targetPattern.value.length){targetPattern.value.forEach(r=>r.forEach(c=>{if(c)total[c]=(total[c]||0)+1}));Object.keys(total).forEach(k=>total[+k]=Math.ceil(total[+k]*1.2))}
  return COLOR_FAMILIES.map(f=>({id:f.id,name:f.name,colors:f.colors.map(c=>{const e=COLOR_LIST.find(x=>x.hex===c.hex);const id=e?.id||0;const u=used[id]||0;const t=isC?(total[id]||0):undefined;return{id,name:c.name,hex:c.hex,count:t!==undefined?Math.max(0,t-u):undefined,disabled:t!==undefined?u>=t:!1}})}))
})

function getColorHex(id:number){return DEFAULT_COLORS[id]?.hex||'#ccc'}
function onColorPick(id:number){endDrag();gameStore.setSelectedColor(id);startDrag(id);if(!isMobile.value)holdBead(getColorHex(id))}
function onEraserToggle(){gameStore.toggleEraserMode();releaseBead();if(gameStore.gameState.isEraserMode){endDrag();startDrag(0);hideTweezers()}else{endDrag();hideTweezers()}}
function onGameAreaEnter(){if(gameStore.gameState.selectedColor!==0){showTweezers()}}
function onGameAreaLeave(){hideTweezers()}

function handlePlace(row:number,col:number,colorId:number):boolean{
  if(gameStore.gameState.mode==='challenge'&&targetPattern.value.length){if(targetPattern.value[row]?.[col]!==0&&targetPattern.value[row]?.[col]!==colorId){showErrorFeedback(row,col);return false}}
  gameStore.placeBead(row,col,colorId);placingAnimCell.value={row,col};setTimeout(()=>placingAnimCell.value=null,350);return true
}
function handleErase(row:number,col:number){gameStore.eraseBead(row,col)}
function showErrorFeedback(row:number,col:number){errorCell.value={row,col};setTimeout(()=>errorCell.value=null,400)}

const { startDrag, endDrag, placeAt } = useDragBead({onPlace:handlePlace,onErase:handleErase,onTweezerRelease:()=>releaseBead(),getColorHex,isMobile:isMobile.value})

function onGridClick(e:MouseEvent|TouchEvent){if(!isMobile.value)return;const n=normalizeEvent(e);placeAt(n.x,n.y)}
function undo(){gameStore.undo()};function redo(){gameStore.redo()};function clearGrid(){if(confirm('确定要清空画布吗？'))gameStore.clearGrid()}
function showResult(){
  if(gameStore.gameState.mode==='challenge'&&targetPattern.value.length){scoreResult.value=calculateScore(gameStore.gameState.gridData,targetPattern.value)}
  else{let f=0;gameStore.gameState.gridData.forEach(r=>r.forEach(c=>{if(c)f++}));const t=gameStore.gameState.gridSize.rows*gameStore.gameState.gridSize.cols;scoreResult.value={accuracy:100,completion:Math.round(f/t*100),score:Math.round(f*.5)}}
  showScoreModal.value=true
}
function closeScoreModal(){showScoreModal.value=false}
async function finishGame(){if(gameStore.gameState.mode==='challenge'){userStore.addScore(scoreResult.value.score);if(gameStore.gameState.level)userStore.unlockLevel(gameStore.gameState.level+1)}if(gameStore.gameState.mode==='free')updateThumb();gameStore.saveToStorage();router.push(backRoute.value)}
function updateThumb(){try{const w=JSON.parse(localStorage.getItem('fusebead_free_works')||'[]');const c=w.find((x:any)=>x.gridSize.rows===gameStore.gameState.gridSize.rows&&x.gridSize.cols===gameStore.gameState.gridSize.cols);if(c){c.gridData=gameStore.gameState.gridData;c.thumbnail=renderGridToCanvas(gameStore.gameState.gridData,COLOR_LIST.reduce((a:any,x)=>({...a,[x.id]:x.hex}),{}),2,1).toDataURL();localStorage.setItem('fusebead_free_works',JSON.stringify(w))}}catch{}}
async function exportImage(){try{await exportGridAsPNG(renderGridToCanvas(gameStore.gameState.gridData,COLOR_LIST.reduce((a:any,x)=>({...a,[x.id]:x.hex}),{}),beadSize.value,gridGap.value),`fusebead-${Date.now()}.png`)}catch{alert('导出失败')}}

watch(beadSize,bs=>{if(tweezerState.value.beadSize!==bs)tweezerState.value.beadSize=bs})

// Mobile preview: render full grid to canvas
watch(showPreview, (on) => {
  if (!on) return
  requestAnimationFrame(() => {
    const cvs = previewCanvasRef.value
    if (!cvs) return
    const grid = gameStore.gameState.gridData
    const rows = grid.length
    const cols = grid[0]?.length || 0
    if (!rows || !cols) return
    const maxW = Math.min(window.innerWidth - 48, 600)
    const maxH = window.innerHeight * 0.7
    const cell = Math.max(6, Math.min(32, Math.floor(maxW / cols), Math.floor(maxH / rows)))
    const gap = Math.max(1, Math.min(Math.floor(cell * 0.12), 3))
    const cmap = COLOR_LIST.reduce((a: Record<number,string>,c)=>({...a,[c.id]:c.hex}),{})
    const rendered = renderGridToCanvas(grid, cmap, cell, gap)
    cvs.width = rendered.width
    cvs.height = rendered.height
    const ctx = cvs.getContext('2d')!
    ctx.drawImage(rendered, 0, 0)
  })
})
onMounted(()=>{if(gameStore.gameState.gridData.length===0)gameStore.initializeGrid(16,16)})
</script>

<style scoped>
/* ═══════ PC Styles ═══════ */
.pc-root { height: 100vh; display: flex; flex-direction: column; background: var(--pg-game); }
.pc-header { display: flex; align-items: center; gap: .75rem; padding: .5rem 1.25rem; background: var(--color-surface); border-bottom: 1px solid var(--color-border); flex-shrink: 0; }
.pc-back { display: flex; align-items: center; gap: .2rem; color: var(--color-text-muted); text-decoration: none; padding: .35rem .5rem; border-radius: var(--radius-sm); font-size: .85rem; font-weight: 500; flex-shrink: 0; }
.pc-back:hover { background: #f0ebe3; }
.pc-title-group { display: flex; align-items: center; gap: .5rem; flex: 1; min-width: 0; }
.pc-title { font-size: 1.1rem; margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.pc-badge { font-size: .65rem; padding: .12rem .45rem; border-radius: 1rem; background: #eef2ff; color: #6366f1; font-weight: 600; white-space: nowrap; }
.pc-badge--free { background: #fce7f3; color: #ec4899; }
.pc-actions { display: flex; gap: .3rem; flex-shrink: 0; }
.pc-btn { width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border: 1px solid var(--color-border); border-radius: var(--radius-sm); background: var(--color-surface); color: var(--color-text-muted); cursor: pointer; padding: 0; }
.pc-btn:hover:not(:disabled) { background: #f5f0ea; color: var(--color-text); }
.pc-btn:disabled { opacity: .3; cursor: not-allowed; }
.pc-btn--active { background: #e0faf7; border-color: var(--color-teal); color: var(--color-teal-dark); }
.pc-btn--submit { padding: .35rem 1rem; border: none; border-radius: var(--radius-sm); background: var(--color-primary); color: #fff; font-size: .8rem; font-weight: 600; cursor: pointer; }
.pc-btn--submit:hover { background: var(--color-primary-dark); }

.pc-body { flex: 1; display: grid; grid-template-columns: 1fr 260px; gap: 1rem; padding: 1rem; overflow: hidden; min-height: 0; }
.pc-canvas { display: flex; align-items: flex-start; justify-content: center; overflow: auto; cursor: none; }
.pc-canvas :deep(*) { cursor: none !important; }
.pc-grid { display: inline-flex; }
.pc-tools { overflow-y: auto; }

/* ═══════ Mobile Styles ═══════ */
.m-root {
  height: 100dvh;
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  grid-template-columns: 100%;
  overflow: hidden;
  background: var(--color-bg);
}
.m-header {
  display: flex;
  align-items: center;
  gap: .5rem;
  padding: .4rem .75rem;
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
}
.m-back { color: var(--color-text-muted); padding: .25rem; flex-shrink: 0; }
.m-title { font-size: .95rem; margin: 0; flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.m-actions { display: flex; gap: .35rem; flex-shrink: 0; }
.m-btn { width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border: 1px solid var(--color-border); border-radius: var(--radius-sm); background: var(--color-surface); color: var(--color-text-muted); cursor: pointer; padding: 0; }
.m-btn:disabled { opacity: .3; }
.m-btn--submit { padding: .35rem .75rem; border: none; border-radius: var(--radius-sm); background: var(--color-primary); color: #fff; font-size: .8rem; font-weight: 600; cursor: pointer; }

.m-canvas {
  overflow: auto;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;
  min-height: 0;
  padding: .25rem;
}

.m-canvas-inner {
  min-height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.m-tools {
  max-height: 42vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  background: var(--color-surface);
  border-top: 1px solid var(--color-border);
}

.m-tips {
  display: flex;
  gap: 1rem;
  justify-content: center;
  padding: .35rem;
  font-size: .7rem;
  color: var(--color-text-muted);
  flex-shrink: 0;
}

/* ═══════ Shared: Modal ═══════ */
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.5); display: flex; align-items: center; justify-content: center; z-index: 10000; padding: 1rem; }
.modal-card { background: var(--color-surface); border-radius: var(--radius-xl); padding: 2rem; max-width: 400px; width: 100%; box-shadow: var(--shadow-xl); text-align: center; }
.modal-icon { font-size: 3.5rem; margin-bottom: .5rem; }
.modal-title { font-size: 1.3rem; margin-bottom: 1.5rem; }
.modal-stats { display: grid; grid-template-columns: repeat(3,1fr); gap: .75rem; margin-bottom: 1.5rem; }
.modal-stat { padding: 1rem .5rem; background: #f9fafb; border-radius: var(--radius-md); }
.modal-stat--highlight { background: linear-gradient(135deg,#fef3c7,#fde68a); }
.modal-stat-label { font-size: .75rem; color: var(--color-text-muted); margin-bottom: .25rem; }
.modal-stat-value { font-size: 1.4rem; font-weight: 700; color: var(--color-text-heading); }
.modal-badge { padding: .7rem; border-radius: var(--radius-sm); font-weight: 700; margin-bottom: 1.5rem; color: #fff; }
.badge--perfect { background: linear-gradient(135deg,#fbbf24,#f59e0b); }
.badge--excellent{ background: linear-gradient(135deg,#34d399,#10b981); }
.badge--good { background: linear-gradient(135deg,#60a5fa,#3b82f6); }
.badge--pass { background: linear-gradient(135deg,#a78bfa,#8b5cf6); }
.badge--fail { background: linear-gradient(135deg,#f87171,#ef4444); }
.modal-actions { display: flex; gap: .75rem; }
.modal-btn--secondary,.modal-btn--primary { flex: 1; padding: .7rem; border: none; border-radius: var(--radius-sm); font-size: .9rem; font-weight: 600; cursor: pointer; }
.modal-btn--secondary { background: #e5e7eb; color: #374151; }
.modal-btn--primary { background: var(--color-primary); color: #fff; }

.modal-enter-active { transition: opacity .25s; }
.modal-leave-active { transition: opacity .15s; }
.modal-enter-from,.modal-leave-to { opacity: 0; }

/* Preview modal */
.preview-modal {
  background: var(--color-surface);
  border-radius: var(--radius-xl);
  max-width: 90vw;
  max-height: 85vh;
  width: auto;
  box-shadow: var(--shadow-xl);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.preview-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: .75rem 1rem;
  border-bottom: 1px solid var(--color-border);
}
.preview-header h3 { font-size: .95rem; }
.preview-close {
  width: 28px; height: 28px;
  display: flex; align-items: center; justify-content: center;
  border: none; border-radius: var(--radius-sm);
  background: none; color: var(--color-text-muted);
  font-size: 1rem; cursor: pointer;
}
.preview-close:hover { background: #f3f4f6; }
.preview-body {
  padding: .75rem;
  overflow: auto;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}
</style>
