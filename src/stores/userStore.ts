import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export interface UserData {
  username: string;
  totalScore: number;
  unlockedLevels: number[];
  completedChallenges: string[];
  achievements: string[];
}

export const useUserStore = defineStore('user', () => {
  const userData = ref<UserData>({
    username: '玩家',
    totalScore: 0,
    unlockedLevels: [1],
    completedChallenges: [],
    achievements: [],
  });

  const currentLevel = computed(() => {
    return Math.max(...userData.value.unlockedLevels);
  });

  const totalCompletedChallenges = computed(() => {
    return userData.value.completedChallenges.length;
  });

  function loadFromStorage() {
    const saved = localStorage.getItem('fusebead_user');
    if (saved) {
      try {
        userData.value = JSON.parse(saved);
      } catch (e) {
        console.error('Failed to load user data:', e);
      }
    }
  }

  function saveToStorage() {
    localStorage.setItem('fusebead_user', JSON.stringify(userData.value));
  }

  function addScore(score: number) {
    userData.value.totalScore += score;
    saveToStorage();
  }

  function unlockLevel(level: number) {
    if (!userData.value.unlockedLevels.includes(level)) {
      userData.value.unlockedLevels.push(level);
      saveToStorage();
    }
  }

  function completeChallenge(date: string) {
    if (!userData.value.completedChallenges.includes(date)) {
      userData.value.completedChallenges.push(date);
      saveToStorage();
    }
  }

  function updateUsername(name: string) {
    userData.value.username = name;
    saveToStorage();
  }

  function resetProgress() {
    userData.value = {
      username: userData.value.username,
      totalScore: 0,
      unlockedLevels: [1],
      completedChallenges: [],
      achievements: [],
    };
    saveToStorage();
  }

  loadFromStorage();

  return {
    userData,
    currentLevel,
    totalCompletedChallenges,
    addScore,
    unlockLevel,
    completeChallenge,
    updateUsername,
    resetProgress,
    saveToStorage,
  };
});
