<template>
  <div class="lb-page">
    <header class="lb-header">
      <router-link to="/" class="lb-back">← 首页</router-link>
      <h1>排行榜</h1>
    </header>

    <!-- Podium -->
    <div class="lb-podium animate-fade-in-up">
      <div class="lb-podium-item lb-podium--2">
        <div class="lb-podium-avatar">{{ top3[1]?.avatar || '👤' }}</div>
        <div class="lb-podium-name">{{ top3[1]?.username || '-' }}</div>
        <div class="lb-podium-score">{{ top3[1]?.totalScore || 0 }}</div>
        <div class="lb-podium-medal">🥈</div>
      </div>
      <div class="lb-podium-item lb-podium--1">
        <div class="lb-podium-crown">👑</div>
        <div class="lb-podium-avatar">{{ top3[0]?.avatar || '👤' }}</div>
        <div class="lb-podium-name">{{ top3[0]?.username || '-' }}</div>
        <div class="lb-podium-score">{{ top3[0]?.totalScore || 0 }}</div>
        <div class="lb-podium-medal">🥇</div>
      </div>
      <div class="lb-podium-item lb-podium--3">
        <div class="lb-podium-avatar">{{ top3[2]?.avatar || '👤' }}</div>
        <div class="lb-podium-name">{{ top3[2]?.username || '-' }}</div>
        <div class="lb-podium-score">{{ top3[2]?.totalScore || 0 }}</div>
        <div class="lb-podium-medal">🥉</div>
      </div>
    </div>

    <!-- Table -->
    <div class="lb-table-wrap">
      <table class="lb-table">
        <thead>
          <tr>
            <th>排名</th>
            <th>玩家</th>
            <th>积分</th>
            <th>关卡</th>
            <th>完成</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(p, i) in players"
            :key="p.rank"
            :class="{ 'lb-row--me': p.username === userStore.userData.username }"
          >
            <td class="lb-rank">
              <span v-if="i < 3" class="lb-medal">{{ ['🥇','🥈','🥉'][i] }}</span>
              <span v-else>#{{ p.rank }}</span>
            </td>
            <td class="lb-name">
              <span class="lb-avatar">{{ p.avatar }}</span>
              {{ p.username }}
            </td>
            <td class="lb-score">{{ p.totalScore }}</td>
            <td class="lb-level">{{ p.maxLevel }}</td>
            <td class="lb-ch">{{ p.completedChallenges }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Current user card (if not in top visible) -->
    <div v-if="myRank > 10" class="lb-me-card animate-fade-in-up">
      <span class="lb-me-rank">#{{ myRank }}</span>
      <span class="lb-me-info">{{ userStore.userData.username }} — {{ userStore.userData.totalScore }} 积分</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '@/stores/userStore'

interface Player {
  rank: number
  username: string
  avatar: string
  totalScore: number
  maxLevel: number
  completedChallenges: number
}

const userStore = useUserStore()
const players = ref<Player[]>([])

const top3 = computed(() => players.value.slice(0, 3))

const myRank = computed(() => {
  const p = players.value.find(x => x.username === userStore.userData.username)
  return p?.rank || 999
})

function genMock(): Player[] {
  const avatars = ['🐱','🐶','🐰','🐼','🐨','🦊','🦁','🐯','🐮','🐷']
  const names = ['小明','小红','张三','李四','王五','赵六','小七','阿八','小九','大十']
  const list: Player[] = []
  for (let i = 0; i < 50; i++) {
    list.push({
      rank: i + 1,
      username: i === 0 ? userStore.userData.username : `${names[i % names.length]}${i > 9 ? i : ''}`,
      avatar: avatars[i % avatars.length],
      totalScore: Math.max(Math.round(10000 - i * 180 + Math.random() * 100), 100),
      maxLevel: Math.max(50 - Math.floor(i / 2), 1),
      completedChallenges: Math.max(100 - i * 2, 0),
    })
  }
  list.sort((a, b) => b.totalScore - a.totalScore || b.completedChallenges - a.completedChallenges)
  list.forEach((p, i) => { p.rank = i + 1 })
  return list
}

onMounted(() => { players.value = genMock() })
</script>

<style scoped>
.lb-page { min-height: 100vh; min-height: 100dvh;   background: var(--pg-rank); padding: 1.5rem; }

.lb-header { display: flex; align-items: center; gap: 1rem; margin-bottom: 2rem; }
.lb-header h1 { font-size: 1.5rem; }
.lb-back { color: var(--color-text-muted); text-decoration: none; padding: 0.4rem 0.8rem; background: rgba(255,255,255,0.7); border-radius: var(--radius-sm); font-size: 0.9rem; }

/* Podium */
.lb-podium { display: flex; justify-content: center; align-items: flex-end; gap: 1rem; margin-bottom: 2rem; }
.lb-podium-item { background: var(--color-surface); border-radius: var(--radius-lg); padding: 1.25rem 1rem; text-align: center; box-shadow: var(--shadow-sm); min-width: 120px; position: relative; }
.lb-podium--1 { transform: scale(1.08); border: 2px solid #fbbf24; z-index: 1; }
.lb-podium--2 { order: -1; }
.lb-podium--3 { order: 2; }
.lb-podium-crown { position: absolute; top: -1.5rem; left: 50%; transform: translateX(-50%); font-size: 2rem; }
.lb-podium-avatar { font-size: 2rem; margin-bottom: 0.25rem; }
.lb-podium-name { font-size: 0.9rem; font-weight: 600; color: var(--color-text-heading); }
.lb-podium-score { font-size: 1.1rem; font-weight: 700; color: #f59e0b; }
.lb-podium-medal { font-size: 1.5rem; margin-top: 0.15rem; }

/* Table */
.lb-table-wrap { background: var(--color-surface); border-radius: var(--radius-lg); overflow: hidden; box-shadow: var(--shadow-sm); margin-bottom: 1.5rem; overflow-x: auto; }
.lb-table { width: 100%; border-collapse: collapse; min-width: 500px; }
.lb-table thead { background: linear-gradient(135deg, #667eea, #764ba2); color: white; }
.lb-table th { padding: 0.75rem 1rem; text-align: left; font-size: 0.8rem; font-weight: 600; }
.lb-table td { padding: 0.7rem 1rem; border-bottom: 1px solid #f3f4f6; font-size: 0.85rem; }
.lb-table tbody tr:hover { background: #f9fafb; }
.lb-row--me { background: #fef3c7 !important; font-weight: 600; }
.lb-rank { font-weight: 700; }
.lb-medal { font-size: 1.2rem; }
.lb-name { display: flex; align-items: center; gap: 0.5rem; }
.lb-avatar { font-size: 1.2rem; }
.lb-score { color: #f59e0b; font-weight: 600; }
.lb-level, .lb-ch { color: var(--color-text-muted); }

.lb-me-card { background: var(--color-surface); border-radius: var(--radius-lg); padding: 1rem 1.5rem; box-shadow: var(--shadow-sm); display: flex; align-items: center; gap: 1rem; justify-content: center; }
.lb-me-rank { background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 0.35rem 0.75rem; border-radius: var(--radius-sm); font-weight: 700; }
.lb-me-info { color: var(--color-text-muted); }

@media (max-width: 768px) {
  .lb-page { padding: 1rem; }
  .lb-podium { gap: 0.5rem; }
  .lb-podium-item { min-width: 90px; padding: 1rem 0.5rem; }
  .lb-podium-name { font-size: 0.75rem; }
  .lb-podium-score { font-size: 0.9rem; }
}
</style>
