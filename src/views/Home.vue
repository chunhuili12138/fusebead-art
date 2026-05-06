<template>
  <div class="home">
    <div class="home-hero">
      <h1 class="home-logo">✦ 拼豆艺术</h1>
      <button class="theme-toggle" @click="toggleTheme" :aria-label="theme === 'dark' ? '切换到日间模式' : '切换到夜间模式'">
        <svg v-if="theme === 'dark'" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
        <svg v-else viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>
      </button>
      <p class="home-tagline">用彩色豆子拼出你的像素世界</p>

      <div v-if="userStore.userData" class="home-stats">
        <div class="stat-badge">
          <span class="stat-label">积分</span>
          <span class="stat-num">{{ userStore.userData.totalScore }}</span>
        </div>
        <div class="stat-badge">
          <span class="stat-label">关卡</span>
          <span class="stat-num">{{ userStore.currentLevel }}/{{ totalLevels }}</span>
        </div>
        <div class="stat-badge">
          <span class="stat-label">作品</span>
          <span class="stat-num">{{ freeWorksCount }}</span>
        </div>
      </div>
    </div>

    <div class="home-cards stagger-children">
      <router-link to="/daily" class="home-card home-card--daily">
        <div class="card-icon">📅</div>
        <div class="card-content">
          <h2>每日挑战</h2>
          <p>完成今日图案获取奖励</p>
        </div>
        <span v-if="dailyStore.isTodayCompleted" class="card-tag tag--done">✓ 已完成</span>
        <span v-else class="card-tag tag--time">{{ timeRemaining }}</span>
      </router-link>

      <router-link to="/level" class="home-card home-card--level">
        <div class="card-icon">🎮</div>
        <div class="card-content">
          <h2>关卡挑战</h2>
          <p>循序渐进解锁新关卡</p>
        </div>
        <div class="card-tag tag--info">进度 {{ userStore.currentLevel }}/{{ totalLevels }}</div>
      </router-link>

      <router-link to="/free" class="home-card home-card--free">
        <div class="card-icon">🎨</div>
        <div class="card-content">
          <h2>自由创作</h2>
          <p>无限制挥洒创意</p>
        </div>
        <span class="card-tag tag--info">作品 {{ freeWorksCount }}</span>
      </router-link>

      <!-- Deleted:<router-link to="/leaderboard" class="home-card home-card--rank"> -->
      <!-- Deleted:<div class="card-icon">🏆</div> -->
      <!-- Deleted:<h2>排行榜</h2> -->
      <!-- Deleted:<p>看看大家的作品排名</p> -->
      <!-- Deleted:<span class="card-tag tag--rank">#{{ userRank }}</span> -->
      <!-- Deleted:</router-link> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { useDailyStore } from '@/stores/dailyStore'
import { getTotalLevels } from '@/assets/levels'
import { useTheme } from '@/composables/useTheme'

const userStore = useUserStore()
const dailyStore = useDailyStore()
const { theme, toggle: toggleTheme } = useTheme()

const timeRemaining = ref('')
const freeWorksCount = ref(0)
const totalLevels = getTotalLevels()

let timer: number | null = null

const progressPercent = computed(() => Math.round((userStore.currentLevel / totalLevels) * 100))

function updateTimeRemaining() {
  const now = new Date()
  const tomorrow = new Date(now)
  tomorrow.setDate(tomorrow.getDate() + 1)
  tomorrow.setHours(0, 0, 0, 0)
  const diff = tomorrow.getTime() - now.getTime()
  const h = Math.floor(diff / 3600000)
  const m = Math.floor((diff % 3600000) / 60000)
  const s = Math.floor((diff % 60000) / 1000)
  timeRemaining.value = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

onMounted(() => {
  dailyStore.initializeToday()
  updateTimeRemaining()
  timer = window.setInterval(updateTimeRemaining, 1000)

  try {
    const works = JSON.parse(localStorage.getItem('fusebead_free_works') || '[]')
    freeWorksCount.value = works.length
  } catch { freeWorksCount.value = 0 }
})

onUnmounted(() => {
  if (timer !== null) clearInterval(timer)
})
</script>

<style scoped>
.home {
  min-height: 100vh;
  min-height: 100dvh;
  background: var(--pg-home);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 1.5rem 3rem;
}

.home-hero {
  text-align: center;
  margin-bottom: 2.5rem;
  animation: fadeInUp 0.5s ease-out both;
}

.home-logo {
  font-size: 2.2rem;
  font-weight: 700;
  background: linear-gradient(135deg, var(--color-primary), var(--color-teal));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.4rem;
}

.theme-toggle {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-surface);
  color: var(--color-text-muted);
  cursor: pointer;
  transition: all 0.2s;
}
.theme-toggle:hover {
  background: var(--color-bg);
  color: var(--color-text);
}

.home-tagline {
  color: var(--color-text-muted);
  font-size: 0.95rem;
  margin-bottom: 1.2rem;
}

.home-stats {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
}

.stat-badge {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgba(255,255,255,0.7);
  backdrop-filter: blur(6px);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 0.5rem 1.2rem;
  min-width: 72px;
}

.stat-label {
  font-size: 0.7rem;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.stat-num {
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--color-text-heading);
}

/* Cards */
.home-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem;
  width: 100%;
  max-width: 1100px;
}

.home-card {
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  padding: 1.75rem 1.25rem;
  text-decoration: none;
  color: inherit;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-sm);
  transition: all 0.25s ease;
  position: relative;
  overflow: hidden;
}

.home-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  border-radius: var(--radius-lg) var(--radius-lg) 0 0;
}

.home-card--daily::before { background: #f59e0b; }
.home-card--level::before { background: #3b82f6; }
.home-card--free::before { background: #ec4899; }

.home-card:hover {
  transform: translateY(-6px);
  box-shadow: var(--shadow-lg);
}

.home-card h2 {
  font-size: 1.1rem;
  margin: 0.5rem 0 0.25rem;
}

.home-card p {
  font-size: 0.8rem;
  color: var(--color-text-muted);
  margin-bottom: 0.75rem;
}

.card-icon {
  font-size: 2.5rem;
  line-height: 1;
}

.card-tag {
  font-size: 0.75rem;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-weight: 600;
  margin-top: auto;
}

.tag--done { background: #d1fae5; color: #065f46; }
.tag--time { background: #fef3c7; color: #92400e; font-family: var(--font-mono); font-size: 0.7rem; }
.tag--info { background: #e0e7ff; color: #3730a3; }

.card-progress-bar {
  width: 100%;
  height: 4px;
  background: #e5e7eb;
  border-radius: 2px;
  margin-bottom: 0.5rem;
  overflow: hidden;
}

.card-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #6366f1);
  border-radius: 2px;
  transition: width 0.5s ease;
}

/* Responsive */
@media (max-width: 1024px) {
  .home-cards {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 640px) {
  .home {
    padding: 1.5rem 1rem 2rem;
  }
  .home-logo {
    font-size: 1.8rem;
    margin-bottom: 0.5rem;
  }
  .home-tagline {
    font-size: 0.9rem;
    margin-bottom: 1.5rem;
  }
  .home-stats {
    gap: 0.5rem;
    flex-wrap: nowrap;
  }
  .stat-badge {
    padding: 0.5rem 0.75rem;
    min-width: 64px;
  }
  .stat-label {
    font-size: 0.65rem;
  }
  .stat-num {
    font-size: 1.2rem;
  }
  .home-cards {
    grid-template-columns: 1fr;
    gap: 0.875rem;
  }
  .home-card {
    padding: 1rem;
    flex-direction: row;
    align-items: center;
    text-align: left;
    gap: 0.875rem;
  }
  .card-icon {
    font-size: 2.25rem;
    flex-shrink: 0;
    width: 3rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .home-card h2 {
    font-size: 1.05rem;
    margin: 0 0 0.25rem 0;
    font-weight: 600;
    white-space: nowrap;
  }
  .home-card p {
    font-size: 0.8rem;
    margin: 0;
    color: var(--color-text-muted);
    line-height: 1.4;
  }
  .card-progress-bar {
    display: none;
  }
  .card-tag {
    margin: 0;
    margin-left: auto;
    flex-shrink: 0;
    padding: 0.35rem 0.75rem;
    font-size: 0.75rem;
  }
  .home-card--daily .card-tag {
    min-width: 6.5rem;
    text-align: center;
    font-family: var(--font-mono);
  }
}

@media (max-width: 380px) {
  .home {
    padding: 1.25rem 0.75rem 2rem;
  }
  .home-logo {
    font-size: 1.6rem;
  }
  .home-tagline {
    font-size: 0.85rem;
  }
  .home-cards {
    gap: 0.75rem;
  }
  .home-card {
    padding: 0.875rem 0.75rem;
    gap: 0.75rem;
  }
  .card-icon {
    font-size: 2rem;
    width: 2.5rem;
  }
  .home-card h2 {
    font-size: 1rem;
  }
  .home-card p {
    font-size: 0.75rem;
  }
  .card-tag {
    font-size: 0.7rem;
    padding: 0.25rem 0.625rem;
  }
}
</style>
