export interface LevelConfig {
  level: number
  gridSize: { rows: number; cols: number }
  targetPattern: number[][]
  requiredColors: number[]
  reward: { base: number; perfect: number }
}

import { ALL_PATTERNS, getPatternGrid } from './patterns'

export const LEVELS: LevelConfig[] = ALL_PATTERNS.map((p, i) => ({
  level: i + 1,
  gridSize: { rows: p.rows, cols: p.cols },
  targetPattern: getPatternGrid(p.pattern),
  requiredColors: p.colors,
  reward: {
    base: 15 + i * 5,
    perfect: 30 + i * 10,
  },
}))

export function getLevelConfig(levelNum: number): LevelConfig | undefined {
  return LEVELS.find(l => l.level === levelNum)
}

export function getTotalLevels(): number {
  return LEVELS.length
}
