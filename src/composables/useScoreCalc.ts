export interface ScoreResult {
  accuracy: number;
  completion: number;
  score: number;
}

export function useScoreCalc() {
  function calculateScore(userGrid: number[][], targetGrid: number[][]): ScoreResult {
    let totalCells = 0;
    let correctCells = 0;
    let targetFilledCells = 0;
    let correctFilledCells = 0;

    targetGrid.forEach((row, r) => {
      row.forEach((targetColor, c) => {
        totalCells++;
        const userColor = userGrid[r]?.[c] || 0;

        if (targetColor !== 0) {
          targetFilledCells++;
          if (userColor === targetColor) {
            correctCells++;
            correctFilledCells++;
          }
        } else if (userColor === 0) {
          correctCells++;
        }
      });
    });

    const accuracy = totalCells > 0 ? correctCells / totalCells : 1;
    const completion = targetFilledCells > 0 ? correctFilledCells / targetFilledCells : 0;

    const baseScore = 20;
    const score = Math.round(baseScore * accuracy * (0.5 + 0.5 * completion));

    return {
      accuracy: Math.round(accuracy * 100),
      completion: Math.min(Math.round(completion * 100), 100),
      score,
    };
  }

  function calculateDailyReward(accuracy: number): number {
    if (accuracy >= 100) return 50;
    if (accuracy >= 80) return 30;
    if (accuracy >= 60) return 10;
    return 0;
  }

  function getPerformanceLevel(accuracy: number): string {
    if (accuracy >= 100) return '完美';
    if (accuracy >= 90) return '优秀';
    if (accuracy >= 75) return '良好';
    if (accuracy >= 60) return '及格';
    return '需努力';
  }

  return {
    calculateScore,
    calculateDailyReward,
    getPerformanceLevel,
  };
}
