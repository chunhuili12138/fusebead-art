import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export interface DailyChallenge {
  date: string;
  patternId: string;
  completed: boolean;
  score?: number;
  accuracy?: number;
}

export const useDailyStore = defineStore('daily', () => {
  const completedDates = ref<string[]>([]);
  const todayChallenge = ref<DailyChallenge | null>(null);

  const today = computed(() => {
    return new Date().toISOString().split('T')[0];
  });

  const isTodayCompleted = computed(() => {
    return completedDates.value.includes(today.value);
  });

  function initializeToday() {
    const dateStr = today.value;
    const patternId = generateDailyPatternId(dateStr);

    todayChallenge.value = {
      date: dateStr,
      patternId,
      completed: isTodayCompleted.value,
    };

    loadFromStorage();
  }

  function generateDailyPatternId(dateStr: string): string {
    let hash = 0;
    for (let i = 0; i < dateStr.length; i++) {
      const char = dateStr.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    const patterns = ['heart', 'star', 'flower', 'diamond', 'smiley'];
    const index = Math.abs(hash) % patterns.length;
    return patterns[index];
  }

  function completeChallenge(score: number, accuracy: number) {
    const dateStr = today.value;

    if (!completedDates.value.includes(dateStr)) {
      completedDates.value.push(dateStr);
    }

    todayChallenge.value = {
      date: dateStr,
      patternId: todayChallenge.value?.patternId || '',
      completed: true,
      score,
      accuracy,
    };

    saveToStorage();
  }

  function getRewardScore(accuracy: number): number {
    if (accuracy >= 100) return 50;
    if (accuracy >= 80) return 30;
    if (accuracy >= 60) return 10;
    return 0;
  }

  function saveToStorage() {
    localStorage.setItem('fusebead_daily', JSON.stringify({
      completedDates: completedDates.value,
    }));
  }

  function loadFromStorage() {
    const saved = localStorage.getItem('fusebead_daily');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        completedDates.value = data.completedDates || [];
      } catch (e) {
        console.error('Failed to load daily data:', e);
      }
    }
  }

  return {
    today,
    todayChallenge,
    isTodayCompleted,
    initializeToday,
    completeChallenge,
    getRewardScore,
  };
});
