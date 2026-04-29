export interface GridSize {
  rows: number;
  cols: number;
}

export interface PatternData {
  level: number;
  gridSize: GridSize;
  targetPattern: number[][];
  requiredColors: number[];
  timeLimit?: number | null;
  reward: {
    base: number;
    perfect: number;
  };
}

export function generateHeartPattern(size: number = 16): number[][] {
  const pattern: number[][] = [];
  const centerRow = Math.floor(size / 2);
  const centerCol = Math.floor(size / 2);

  for (let r = 0; r < size; r++) {
    const row: number[] = [];
    for (let c = 0; c < size; c++) {
      const dr = r - centerRow;
      const dc = c - centerCol;
      const distance = Math.sqrt(dr * dr + dc * dc);

      if (distance <= size / 3) {
        row.push(1);
      } else {
        row.push(0);
      }
    }
    pattern.push(row);
  }

  return pattern;
}

export function generateStarPattern(size: number = 16): number[][] {
  const pattern: number[][] = [];
  const center = Math.floor(size / 2);

  for (let r = 0; r < size; r++) {
    const row: number[] = [];
    for (let c = 0; c < size; c++) {
      const dr = Math.abs(r - center);
      const dc = Math.abs(c - center);

      if (dr === 0 && dc <= size / 3) {
        row.push(2);
      } else if (dc === 0 && dr <= size / 3) {
        row.push(2);
      } else if (dr === dc && dr <= size / 4) {
        row.push(2);
      } else {
        row.push(0);
      }
    }
    pattern.push(row);
  }

  return pattern;
}

export function generateFlowerPattern(size: number = 16): number[][] {
  const pattern: number[][] = [];
  const center = Math.floor(size / 2);
  const radius = Math.floor(size / 3);

  for (let r = 0; r < size; r++) {
    const row: number[] = [];
    for (let c = 0; c < size; c++) {
      const dr = r - center;
      const dc = c - center;
      const distance = Math.sqrt(dr * dr + dc * dc);

      // 花瓣效果
      const angle = Math.atan2(dr, dc);
      const petalCount = 5;
      const petalFactor = Math.cos(angle * petalCount);

      if (distance <= radius && petalFactor > 0.3) {
        row.push(7);
      } else if (distance <= radius * 0.3) {
        row.push(3);
      } else {
        row.push(0);
      }
    }
    pattern.push(row);
  }

  return pattern;
}

export function generateDiamondPattern(size: number = 16): number[][] {
  const pattern: number[][] = [];
  const center = Math.floor(size / 2);

  for (let r = 0; r < size; r++) {
    const row: number[] = [];
    for (let c = 0; c < size; c++) {
      const dr = Math.abs(r - center);
      const dc = Math.abs(c - center);

      // 菱形判断
      if (dr + dc <= size / 3) {
        row.push(6);
      } else {
        row.push(0);
      }
    }
    pattern.push(row);
  }

  return pattern;
}

export function generateSmileyPattern(size: number = 16): number[][] {
  const pattern: number[][] = [];
  const center = Math.floor(size / 2);
  const radius = Math.floor(size / 3);

  for (let r = 0; r < size; r++) {
    const row: number[] = [];
    for (let c = 0; c < size; c++) {
      const dr = r - center;
      const dc = c - center;
      const distance = Math.sqrt(dr * dr + dc * dc);

      // 脸部轮廓
      if (distance <= radius && distance > radius - 2) {
        row.push(3);
      }
      // 眼睛
      else if (Math.abs(dr + radius * 0.3) < 2 && Math.abs(dc + radius * 0.3) < 2) {
        row.push(9);
      }
      else if (Math.abs(dr + radius * 0.3) < 2 && Math.abs(dc - radius * 0.3) < 2) {
        row.push(9);
      }
      // 嘴巴（微笑弧线）
      else if (dr > radius * 0.2 && dr < radius * 0.6 && 
               Math.abs(dc) < radius * 0.6 &&
               Math.abs(dr - radius * 0.4) < 2) {
        row.push(9);
      }
      else {
        row.push(0);
      }
    }
    pattern.push(row);
  }

  return pattern;
}

export function exportPatternToJSON(pattern: number[][], name: string = 'pattern'): string {
  return JSON.stringify({
    name,
    gridSize: { rows: pattern.length, cols: pattern[0]?.length || 0 },
    data: pattern,
    createdAt: new Date().toISOString(),
  }, null, 2);
}

export function importPatternFromJSON(jsonString: string): { name: string; pattern: number[][] } | null {
  try {
    const data = JSON.parse(jsonString);
    if (data.gridSize && data.data) {
      return {
        name: data.name || 'Imported Pattern',
        pattern: data.data,
      };
    }
    return null;
  } catch (e) {
    console.error('Failed to import pattern:', e);
    return null;
  }
}

export function calculatePatternHash(pattern: number[][]): string {
  const flat = pattern.flat().join(',');
  let hash = 0;
  for (let i = 0; i < flat.length; i++) {
    const char = flat.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}
