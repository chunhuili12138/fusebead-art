export async function exportGridAsPNG(
  canvas: HTMLCanvasElement,
  filename: string = 'fusebead-art.png'
): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Failed to create blob'))
          return
        }

        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.download = filename
        link.href = url
        link.click()

        setTimeout(() => {
          URL.revokeObjectURL(url)
          resolve()
        }, 100)
      }, 'image/png')
    } catch (error) {
      reject(error)
    }
  })
}

function drawRealisticBead(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  colorHex: string
) {
  const cx = x + radius
  const cy = y + radius

  // Bead body - radial gradient for 3D effect
  const gradient = ctx.createRadialGradient(
    cx - radius * 0.25, cy - radius * 0.25, radius * 0.05,
    cx, cy, radius
  )
  gradient.addColorStop(0, lightenColor(colorHex, 60))
  gradient.addColorStop(0.35, colorHex)
  gradient.addColorStop(1, darkenColor(colorHex, 25))

  ctx.beginPath()
  ctx.arc(cx, cy, radius, 0, Math.PI * 2)
  ctx.fillStyle = gradient
  ctx.fill()

  // Drop shadow
  ctx.save()
  ctx.beginPath()
  ctx.arc(cx, cy + radius * 0.1, radius, 0, Math.PI * 2)
  ctx.fillStyle = 'rgba(0,0,0,0.15)'
  ctx.fill()
  ctx.restore()

  // Re-draw bead on top of shadow
  ctx.beginPath()
  ctx.arc(cx, cy, radius, 0, Math.PI * 2)
  ctx.fillStyle = gradient
  ctx.fill()

  // Inner shadow at bottom
  const innerShadow = ctx.createRadialGradient(
    cx, cy + radius * 0.3, radius * 0.3,
    cx, cy, radius
  )
  innerShadow.addColorStop(0, 'rgba(0,0,0,0)')
  innerShadow.addColorStop(1, 'rgba(0,0,0,0.1)')
  ctx.beginPath()
  ctx.arc(cx, cy, radius, 0, Math.PI * 2)
  ctx.fillStyle = innerShadow
  ctx.fill()

  // Highlight spot
  const highlightGradient = ctx.createRadialGradient(
    cx - radius * 0.3, cy - radius * 0.3, 0,
    cx - radius * 0.3, cy - radius * 0.3, radius * 0.3
  )
  highlightGradient.addColorStop(0, 'rgba(255,255,255,0.5)')
  highlightGradient.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.beginPath()
  ctx.arc(cx - radius * 0.15, cy - radius * 0.2, radius * 0.22, 0, Math.PI * 2)
  ctx.fillStyle = highlightGradient
  ctx.fill()

  // Center hole
  const holeGradient = ctx.createRadialGradient(
    cx, cy, radius * 0.08,
    cx, cy, radius * 0.16
  )
  holeGradient.addColorStop(0, 'rgba(0,0,0,0.5)')
  holeGradient.addColorStop(1, 'rgba(0,0,0,0.15)')
  ctx.beginPath()
  ctx.arc(cx, cy, radius * 0.15, 0, Math.PI * 2)
  ctx.fillStyle = holeGradient
  ctx.fill()

  // Subtle outline
  ctx.beginPath()
  ctx.arc(cx, cy, radius - 0.5, 0, Math.PI * 2)
  ctx.strokeStyle = 'rgba(0,0,0,0.08)'
  ctx.lineWidth = 0.5
  ctx.stroke()
}

function drawPegSocket(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number
) {
  const cx = x + radius
  const cy = y + radius

  // Socket base
  const baseGradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius)
  baseGradient.addColorStop(0, '#d4c9b8')
  baseGradient.addColorStop(0.7, '#c4b8a5')
  baseGradient.addColorStop(1, '#b0a590')

  ctx.beginPath()
  ctx.arc(cx, cy, radius, 0, Math.PI * 2)
  ctx.fillStyle = baseGradient
  ctx.fill()

  // Peg top (center protrusion)
  const pegGradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius * 0.3)
  pegGradient.addColorStop(0, '#c9bda8')
  pegGradient.addColorStop(1, '#b0a090')

  ctx.beginPath()
  ctx.arc(cx, cy, radius * 0.25, 0, Math.PI * 2)
  ctx.fillStyle = pegGradient
  ctx.fill()

  // Shadow under peg
  ctx.save()
  ctx.beginPath()
  ctx.arc(cx, cy + 1, radius, 0, Math.PI * 2)
  ctx.fillStyle = 'rgba(0,0,0,0.08)'
  ctx.fill()
  ctx.restore()
}

function lightenColor(hex: string, amount: number): string {
  const num = parseInt(hex.replace('#', ''), 16)
  const r = Math.min(255, (num >> 16) + amount)
  const g = Math.min(255, ((num >> 8) & 0x00FF) + amount)
  const b = Math.min(255, (num & 0x0000FF) + amount)
  return `rgb(${r},${g},${b})`
}

function darkenColor(hex: string, amount: number): string {
  const num = parseInt(hex.replace('#', ''), 16)
  const r = Math.max(0, (num >> 16) - amount)
  const g = Math.max(0, ((num >> 8) & 0x00FF) - amount)
  const b = Math.max(0, (num & 0x0000FF) - amount)
  return `rgb(${r},${g},${b})`
}

export function renderGridToCanvas(
  gridData: number[][],
  colors: Record<number, string>,
  cellSize: number = 28,
  gap: number = 3
): HTMLCanvasElement {
  const rows = gridData.length
  const cols = gridData[0]?.length || 0

  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  if (!ctx) {
    throw new Error('Failed to get canvas context')
  }

  const cellRadius = cellSize / 2
  canvas.width = cols * (cellSize + gap) + gap + 4
  canvas.height = rows * (cellSize + gap) + gap + 4

  // Pegboard background
  ctx.fillStyle = '#f5f0e8'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const colorId = gridData[r]?.[c] || 0
      const x = c * (cellSize + gap) + gap + 2
      const y = r * (cellSize + gap) + gap + 2

      if (colorId !== 0) {
        const colorHex = colors[colorId] || '#cccccc'
        drawRealisticBead(ctx, x, y, cellRadius, colorHex)
      } else {
        drawPegSocket(ctx, x, y, cellRadius)
      }
    }
  }

  return canvas
}

export function generateThumbnail(
  gridData: number[][],
  colors: Record<number, string>,
  maxSize: number = 100
): string {
  const rows = gridData.length
  const cols = gridData[0]?.length || 0
  const cellSize = Math.max(Math.min(maxSize / rows, maxSize / cols), 4)
  const gap = Math.max(Math.floor(cellSize * 0.1), 1)

  const canvas = renderGridToCanvas(gridData, colors, cellSize, gap)
  return canvas.toDataURL('image/png')
}
