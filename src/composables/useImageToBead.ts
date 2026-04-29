import { COLOR_LIST } from '@/assets/colors'

interface RgbColor { r: number; g: number; b: number }

// Precompute RGB values for all colors (cache)
let _cache: { id: number; rgb: RgbColor }[] | null = null
function getColorRgbCache() {
  if (_cache) return _cache
  _cache = COLOR_LIST.map(c => {
    const h = c.hex.replace('#', '')
    return {
      id: c.id,
      rgb: {
        r: parseInt(h.substring(0, 2), 16),
        g: parseInt(h.substring(2, 4), 16),
        b: parseInt(h.substring(4, 6), 16),
      }
    }
  })
  return _cache
}

// Find closest bead color by RGB Euclidean distance
function closestColor(r: number, g: number, b: number): number {
  const palette = getColorRgbCache()
  let bestId = palette[0].id
  let bestDist = Infinity
  for (const c of palette) {
    const dr = r - c.rgb.r
    const dg = g - c.rgb.g
    const db = b - c.rgb.b
    const dist = dr * dr + dg * dg + db * db // squared distance (faster, no sqrt)
    if (dist < bestDist) { bestDist = dist; bestId = c.id }
  }
  return bestId
}

export interface ImageToBeadResult {
  gridData: number[][]
  rows: number
  cols: number
  previewDataUrl: string
}

export async function imageToBead(
  file: File,
  targetRows: number,
  targetCols: number
): Promise<ImageToBeadResult> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)

    img.onload = () => {
      URL.revokeObjectURL(url)

      // Scale to target grid dimensions
      const canvas = document.createElement('canvas')
      canvas.width = targetCols
      canvas.height = targetRows
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0, targetCols, targetRows)

      // Read pixel data
      const imageData = ctx.getImageData(0, 0, targetCols, targetRows)
      const pixels = imageData.data

      // Build grid: match each pixel to closest bead color
      const gridData: number[][] = []
      for (let r = 0; r < targetRows; r++) {
        const row: number[] = []
        for (let c = 0; c < targetCols; c++) {
          const idx = (r * targetCols + c) * 4
          const red = pixels[idx]
          const green = pixels[idx + 1]
          const blue = pixels[idx + 2]
          const alpha = pixels[idx + 3]

          // Skip fully transparent pixels
          if (alpha < 128) {
            row.push(0)
          } else {
            row.push(closestColor(red, green, blue))
          }
        }
        gridData.push(row)
      }

      // Generate preview (thumbnail)
      const previewCanvas = document.createElement('canvas')
      const previewSize = 200
      const scale = Math.min(previewSize / targetCols, previewSize / targetRows)
      previewCanvas.width = Math.round(targetCols * scale)
      previewCanvas.height = Math.round(targetRows * scale)
      const pctx = previewCanvas.getContext('2d')!
      // Render as pixel grid
      for (let r = 0; r < targetRows; r++) {
        for (let c = 0; c < targetCols; c++) {
          const colorId = gridData[r][c]
          const clr = COLOR_LIST.find(x => x.id === colorId)
          pctx.fillStyle = colorId === 0 ? '#e8e0d5' : (clr?.hex || '#ccc')
          pctx.fillRect(Math.floor(c * scale), Math.floor(r * scale), Math.ceil(scale), Math.ceil(scale))
        }
      }

      resolve({
        gridData,
        rows: targetRows,
        cols: targetCols,
        previewDataUrl: previewCanvas.toDataURL('image/png'),
      })
    }

    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('图片加载失败'))
    }

    img.src = url
  })
}
