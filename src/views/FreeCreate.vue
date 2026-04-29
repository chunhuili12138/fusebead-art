<template>
  <div class="fc-page">
    <header class="fc-header">
      <router-link to="/" class="fc-back">← 首页</router-link>
      <h1>自由创作</h1>
      <button @click="showModal = true" class="fc-new-btn">+ 新建</button>
    </header>

    <div v-if="works.length === 0" class="fc-empty animate-fade-in-up">
      <div class="fc-empty-icon">🎨</div>
      <h2>还没有作品</h2>
      <p>点击"新建"开始你的第一幅拼豆创作吧</p>
      <button @click="showModal = true" class="fc-empty-btn">创建作品</button>
    </div>

    <div v-else class="fc-grid stagger-children">
      <div v-for="work in works" :key="work.id" class="fc-card">
        <div class="fc-card-preview" @click="editWork(work)">
          <img v-if="work.thumbnail" :src="work.thumbnail" :alt="work.name" />
          <span v-else class="fc-card-letter">{{ work.name.charAt(0) }}</span>
        </div>
        <div class="fc-card-body">
          <h3 class="fc-card-name">{{ work.name }}</h3>
          <div class="fc-card-meta">
            <span>{{ work.gridSize.rows }}×{{ work.gridSize.cols }}</span>
            <span>{{ formatDate(work.createdAt) }}</span>
          </div>
          <div class="fc-card-actions">
            <button @click="editWork(work)" class="fc-act fc-act--edit">✏️ 编辑</button>
            <button @click="exportWork(work)" class="fc-act fc-act--export">📥 导出</button>
            <button @click="deleteWork(work.id)" class="fc-act fc-act--del">🗑️</button>
          </div>
        </div>
      </div>
    </div>

    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showModal" class="fc-modal-overlay" @click.self="closeModal">
          <div class="fc-modal animate-scale-in">
            <h2>新建画布</h2>
            <div class="fc-field">
              <label for="wname">作品名称</label>
              <input id="wname" v-model="form.name" type="text" placeholder="给作品起个名字" maxlength="50" />
            </div>
            <div class="fc-row">
              <div class="fc-field">
                <label for="wrows">行数</label>
                <input id="wrows" v-model.number="form.rows" type="number" min="8" max="64" />
              </div>
              <div class="fc-field">
                <label for="wcols">列数</label>
                <input id="wcols" v-model.number="form.cols" type="number" min="8" max="64" />
              </div>
            </div>
            <div class="fc-presets">
              <span class="fc-preset-label">快捷尺寸：</span>
              <button v-for="s in presets" :key="s.label" @click="form.rows = s.r; form.cols = s.c" class="fc-preset">{{ s.label }}</button>
            </div>

            <!-- Image import -->
            <div class="fc-import">
              <div class="fc-import-label">从图片生成底图（可选）</div>
              <label class="fc-import-btn">
                <input type="file" accept="image/*" @change="onImageSelected" hidden />
                <span v-if="!importing">📷 选择图片</span>
                <span v-else>⏳ 处理中...</span>
              </label>
              <div v-if="importError" class="fc-import-err">{{ importError }}</div>
              <img v-if="importPreview" :src="importPreview" class="fc-import-preview" alt="像素预览" />
              <div v-if="importPreview" class="fc-import-mode">
                <span class="fc-import-mode-label">导入方式：</span>
                <label class="fc-import-radio"><input type="radio" v-model="importMode" value="place" /> 直接放置豆子</label>
                <label class="fc-import-radio"><input type="radio" v-model="importMode" value="overlay" /> 半透明参考底图</label>
              </div>
              <button v-if="importGridData" @click="clearImport" class="fc-import-clear">清除底图</button>
            </div>

            <div class="fc-modal-btns">
              <button @click="closeModal" class="fc-modal-btn--cancel">取消</button>
              <button @click="createWork" class="fc-modal-btn--go">开始创作</button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '@/stores/gameStore'
import { generateThumbnail } from '@/utils/imageExporter'
import { COLOR_LIST } from '@/assets/colors'
import { imageToBead } from '@/composables/useImageToBead'

interface FreeWork {
  id: string
  name: string
  gridSize: { rows: number; cols: number }
  gridData: number[][]
  createdAt: string
  thumbnail?: string
}

const router = useRouter()
const gameStore = useGameStore()

const works = ref<FreeWork[]>([])
const showModal = ref(false)

const form = reactive({ name: '', rows: 16, cols: 16 })
const presets = [
  { label: '8×8', r: 8, c: 8 },
  { label: '16×16', r: 16, c: 16 },
  { label: '32×32', r: 32, c: 32 },
  { label: '48×48', r: 48, c: 48 },
]

const importing = ref(false)
const importError = ref('')
const importPreview = ref('')
const importGridData = ref<number[][] | null>(null)
const importMode = ref<'place' | 'overlay'>('place')

function loadWorks() {
  try { works.value = JSON.parse(localStorage.getItem('fusebead_free_works') || '[]') }
  catch { works.value = [] }
}
function saveWorks() { localStorage.setItem('fusebead_free_works', JSON.stringify(works.value)) }
function formatDate(d: string) { return new Date(d).toLocaleDateString('zh-CN') }
function makeThumb(data: number[][]) { return generateThumbnail(data, COLOR_LIST.reduce((a,c) => ({ ...a, [c.id]: c.hex }), {} as Record<number,string>), 100) }

function closeModal() { showModal.value = false; form.name = ''; form.rows = 16; form.cols = 16; clearImport() }

async function onImageSelected(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  importing.value = true
  importError.value = ''
  importPreview.value = ''
  importGridData.value = null
  try {
    const result = await imageToBead(file, form.rows, form.cols)
    importGridData.value = result.gridData
    importPreview.value = result.previewDataUrl
    if (!form.name.trim()) form.name = file.name.replace(/\.[^.]+$/, '')
  } catch (err: any) {
    importError.value = err.message || '图片处理失败'
  } finally {
    importing.value = false
    input.value = ''
  }
}

function clearImport() {
  importGridData.value = null
  importPreview.value = ''
  importError.value = ''
  importMode.value = 'place'
}

function createWork() {
  if (!form.name.trim()) return alert('请输入作品名称')
  if (form.rows < 8 || form.rows > 64 || form.cols < 8 || form.cols > 64) return alert('尺寸需在 8-64 之间')

  const data = importGridData.value
    ? (importMode.value === 'overlay'
      ? Array(form.rows).fill(null).map(() => Array(form.cols).fill(0))
      : importGridData.value)
    : Array(form.rows).fill(null).map(() => Array(form.cols).fill(0))
  const thumb = makeThumb(data)
  const work: FreeWork = { id: Date.now().toString(), name: form.name, gridSize: { rows: form.rows, cols: form.cols }, gridData: data, createdAt: new Date().toISOString(), thumbnail: thumb }
  if (importMode.value === 'overlay' && importGridData.value) {
    ;(work as any).targetPattern = importGridData.value
  }
  works.value.unshift(work)
  saveWorks()

  gameStore.setMode('free')
  gameStore.initializeGrid(form.rows, form.cols)
  if (importGridData.value) {
    if (importMode.value === 'overlay') {
      // Reference overlay: empty grid + translucent target pattern
      gameStore.setTargetPattern(JSON.parse(JSON.stringify(importGridData.value)))
    } else {
      // Auto-place: put beads directly on grid
      gameStore.gameState.gridData = JSON.parse(JSON.stringify(data))
      gameStore.gameState.history = [JSON.parse(JSON.stringify(data))]
      gameStore.gameState.historyIndex = 0
    }
  }
  router.push('/game')
  closeModal()
}

function editWork(work: FreeWork) {
  gameStore.setMode('free')
  gameStore.initializeGrid(work.gridSize.rows, work.gridSize.cols)
  gameStore.gameState.gridData = JSON.parse(JSON.stringify(work.gridData))
  gameStore.gameState.history = [JSON.parse(JSON.stringify(work.gridData))]
  gameStore.gameState.historyIndex = 0
  // Restore target pattern if saved
  const tp = (work as any).targetPattern
  if (tp && tp.length) {
    gameStore.setTargetPattern(JSON.parse(JSON.stringify(tp)))
  }
  router.push('/game')
}

function exportWork(work: FreeWork) {
  const cell = 20; const g = 2
  const cvs = document.createElement('canvas')
  const ctx = cvs.getContext('2d')!
  cvs.width = work.gridSize.cols * (cell + g) + g
  cvs.height = work.gridSize.rows * (cell + g) + g
  ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, cvs.width, cvs.height)
  for (let r = 0; r < work.gridSize.rows; r++)
    for (let c = 0; c < work.gridSize.cols; c++) {
      const id = work.gridData[r][c]
      ctx.fillStyle = id ? (COLOR_LIST.find(x => x.id === id)?.hex || '#ccc') : '#fff'
      ctx.fillRect(c * (cell + g) + g, r * (cell + g) + g, cell, cell)
    }
  const a = document.createElement('a'); a.download = `${work.name}.png`; a.href = cvs.toDataURL(); a.click()
}

function deleteWork(id: string) {
  if (confirm('确定要删除这个作品吗？')) { works.value = works.value.filter(w => w.id !== id); saveWorks() }
}

onMounted(loadWorks)
</script>

<style scoped>
.fc-page { min-height: 100vh; min-height: 100dvh;   background: var(--pg-free); padding: 1.5rem; }

.fc-header { display: flex; align-items: center; gap: 1rem; margin-bottom: 2rem; }
.fc-header h1 { flex: 1; font-size: 1.5rem; }
.fc-back { color: var(--color-text-muted); text-decoration: none; padding: 0.4rem 0.8rem; background: rgba(255,255,255,0.7); border-radius: var(--radius-sm); font-size: 0.9rem; }
.fc-new-btn { padding: 0.5rem 1.25rem; background: var(--color-primary); color: white; border: none; border-radius: var(--radius-sm); font-weight: 600; cursor: pointer; font-size: 0.9rem; }

.fc-empty { text-align: center; padding: 4rem 2rem; background: var(--color-surface); border-radius: var(--radius-xl); box-shadow: var(--shadow-sm); max-width: 480px; margin: 2rem auto; }
.fc-empty-icon { font-size: 4rem; margin-bottom: 1rem; }
.fc-empty h2 { margin-bottom: 0.5rem; }
.fc-empty p { color: var(--color-text-muted); margin-bottom: 1.5rem; }
.fc-empty-btn { padding: 0.75rem 2rem; background: var(--color-primary); color: white; border: none; border-radius: var(--radius-sm); font-weight: 600; cursor: pointer; }

.fc-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 1.25rem; max-width: 1200px; }

.fc-card { background: var(--color-surface); border-radius: var(--radius-lg); overflow: hidden; box-shadow: var(--shadow-sm); transition: all 0.2s; border: 1px solid var(--color-border); }
.fc-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-md); }

.fc-card-preview { height: 160px; background: #f9fafb; display: flex; align-items: center; justify-content: center; cursor: pointer; overflow: hidden; }
.fc-card-preview img { width: 100%; height: 100%; object-fit: cover; }
.fc-card-letter { font-size: 3rem; font-weight: 700; color: var(--color-primary); }

.fc-card-body { padding: 1rem; }
.fc-card-name { font-size: 1rem; margin-bottom: 0.35rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.fc-card-meta { display: flex; justify-content: space-between; font-size: 0.75rem; color: var(--color-text-muted); margin-bottom: 0.75rem; }
.fc-card-actions { display: flex; gap: 0.4rem; }
.fc-act { flex: 1; padding: 0.4rem; border: none; border-radius: var(--radius-sm); font-size: 0.75rem; cursor: pointer; font-family: inherit; }
.fc-act--edit { background: #dbeafe; color: #1e40af; }
.fc-act--export { background: #d1fae5; color: #065f46; }
.fc-act--del { background: #fee2e2; color: #991b1b; }

/* Modal */
.fc-modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 1rem; }
.fc-modal { background: var(--color-surface); border-radius: var(--radius-xl); padding: 2rem; max-width: 420px; width: 100%; box-shadow: var(--shadow-xl); }
.fc-modal h2 { text-align: center; margin-bottom: 1.5rem; }
.fc-field { margin-bottom: 1rem; }
.fc-field label { display: block; font-size: 0.8rem; color: var(--color-text-muted); margin-bottom: 0.3rem; font-weight: 500; }
.fc-field input { width: 100%; padding: 0.6rem; border: 1.5px solid var(--color-border); border-radius: var(--radius-sm); font-size: 0.9rem; font-family: inherit; box-sizing: border-box; }
.fc-field input:focus { outline: none; border-color: var(--color-primary); }
.fc-row { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }

.fc-presets { display: flex; align-items: center; gap: 0.4rem; margin-bottom: 1.25rem; flex-wrap: wrap; }
.fc-preset-label { font-size: 0.75rem; color: var(--color-text-muted); }
.fc-preset { padding: 0.3rem 0.6rem; border: 1px solid var(--color-border); border-radius: var(--radius-sm); background: var(--color-surface); font-size: 0.75rem; cursor: pointer; font-family: inherit; }
.fc-preset:hover { border-color: var(--color-primary); color: var(--color-primary); }

.fc-import { margin-bottom: 1rem; }
.fc-import-label { font-size: .78rem; color: var(--color-text-muted); margin-bottom: .4rem; font-weight: 500; }
.fc-import-btn { display: flex; align-items: center; justify-content: center; padding: .6rem; border: 2px dashed var(--color-border); border-radius: var(--radius-sm); cursor: pointer; font-size: .85rem; color: var(--color-text-muted); transition: all .2s; }
.fc-import-btn:hover { border-color: var(--color-primary); color: var(--color-primary); background: rgba(255,107,157,.05); }
.fc-import-err { font-size: .75rem; color: #ef4444; margin-top: .3rem; }
.fc-import-preview { margin: .5rem auto 0; max-width: 100%; border-radius: var(--radius-sm); border: 1px solid var(--color-border); display: block; }
.fc-import-clear { margin-top: .4rem; padding: .3rem .6rem; border: 1px solid var(--color-border); border-radius: var(--radius-sm); background: none; font-size: .75rem; color: var(--color-text-muted); cursor: pointer; }

.fc-import-mode { margin-top: .5rem; display: flex; align-items: center; gap: .75rem; flex-wrap: wrap; }
.fc-import-mode-label { font-size: .75rem; color: var(--color-text-muted); font-weight: 500; }
.fc-import-radio { font-size: .78rem; color: var(--color-text); cursor: pointer; display: flex; align-items: center; gap: .2rem; }
.fc-import-radio input { accent-color: var(--color-primary); }

.fc-modal-btns { display: flex; gap: 0.75rem; }
.fc-modal-btn--cancel, .fc-modal-btn--go { flex: 1; padding: 0.7rem; border: none; border-radius: var(--radius-sm); font-weight: 600; cursor: pointer; font-size: 0.9rem; }
.fc-modal-btn--cancel { background: #e5e7eb; color: #374151; }
.fc-modal-btn--go { background: var(--color-primary); color: white; }

.modal-enter-active, .modal-leave-active { transition: opacity 0.2s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }

@media (max-width: 640px) {
  .fc-page { padding: 1rem; }
  .fc-grid { grid-template-columns: 1fr; }
}
</style>
