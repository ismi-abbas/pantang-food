export const pantangTheme = {
  bg: '#f5f4ed',
  warm: '#e8e6dc',
  deep: '#dcd8ca',
  ink: '#141413',
  soft: '#5e5d59',
  muted: '#4d4c48',
  line: '#f0eee6',
  lineSoft: '#e8e6dc',
  cream: '#faf9f5',
  terra: '#c96442',
  terraDeep: '#7a4a2b',
} as const

function hexToRgb(hex: string) {
  const normalized = hex.replace('#', '')
  const expanded = normalized.length === 3
    ? normalized.split('').map((char) => char + char).join('')
    : normalized

  const value = Number.parseInt(expanded, 16)

  return {
    r: ((value >> 16) & 255) / 255,
    g: ((value >> 8) & 255) / 255,
    b: (value & 255) / 255,
  }
}

function toLinear(channel: number) {
  return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4
}

function luminance(hex: string) {
  const { r, g, b } = hexToRgb(hex)
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b)
}

export function contrastRatio(foreground: string, background: string) {
  const light = Math.max(luminance(foreground), luminance(background))
  const dark = Math.min(luminance(foreground), luminance(background))

  return (light + 0.05) / (dark + 0.05)
}
