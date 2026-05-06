import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
    meta: { title: '拼豆艺术' },
  },
  {
    path: '/daily',
    name: 'DailyChallenge',
    component: () => import('@/views/DailyChallenge.vue'),
    meta: { title: '每日挑战' },
  },
  {
    path: '/level',
    name: 'LevelGame',
    component: () => import('@/views/LevelGame.vue'),
    meta: { title: '关卡挑战' },
  },
  {
    path: '/free',
    name: 'FreeCreate',
    component: () => import('@/views/FreeCreate.vue'),
    meta: { title: '自由创作' },
  },
  {
    path: '/game',
    name: 'GameBoard',
    component: () => import('@/views/GameBoard.vue'),
    meta: { title: '游戏画板' },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, _from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title as string;
  }
  next();
});

export default router;
