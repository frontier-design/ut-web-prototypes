import { useEffect, type RefObject } from 'react'

export type Tone = 'light' | 'dark'

/** Luminance (0–1) above which the background counts as light → use black text. */
const LIGHT_THRESHOLD = 0.55
/** How often to re-sample while an item sits over a playing video. */
const VIDEO_INTERVAL_MS = 300

const SAMPLE_W = 24
const SAMPLE_H = 6

const canvas = document.createElement('canvas')
canvas.width = SAMPLE_W
canvas.height = SAMPLE_H
const ctx = canvas.getContext('2d', { willReadFrequently: true })

const relLum = (r: number, g: number, b: number) => (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255

function parseColor(color: string): [number, number, number, number] | null {
  const m = color.match(/rgba?\(([^)]+)\)/)
  if (!m) return null
  const [r, g, b, a = '1'] = m[1].split(/[\s,/]+/).filter(Boolean)
  return [Number(r), Number(g), Number(b), Number(a)]
}

/** First non-transparent background colour walking up from `el`. */
function backgroundLuminance(el: Element | null): number {
  while (el) {
    const c = parseColor(getComputedStyle(el).backgroundColor)
    if (c && c[3] > 0.5) return relLum(c[0], c[1], c[2])
    el = el.parentElement
  }
  return 1 // page default is white
}

/** Average luminance of the part of an <img>/<video> (object-fit: cover) under `rect`. */
function mediaLuminance(media: HTMLImageElement | HTMLVideoElement, rect: DOMRect): number | null {
  if (!ctx) return null
  const nw = media instanceof HTMLVideoElement ? media.videoWidth : media.naturalWidth
  const nh = media instanceof HTMLVideoElement ? media.videoHeight : media.naturalHeight
  if (!nw || !nh) return null

  const box = media.getBoundingClientRect()
  const scale = Math.max(box.width / nw, box.height / nh)
  const [px, py] = getComputedStyle(media).objectPosition.split(' ').map((v) => parseFloat(v) / 100)
  const ox = (box.width - nw * scale) * (px ?? 0.5)
  const oy = (box.height - nh * scale) * (py ?? 0.5)

  // Visible part of the nav item that actually overlaps this media box
  const left = Math.max(rect.left, box.left)
  const top = Math.max(rect.top, box.top)
  const right = Math.min(rect.right, box.right)
  const bottom = Math.min(rect.bottom, box.bottom)
  if (right <= left || bottom <= top) return null

  const sx = (left - box.left - ox) / scale
  const sy = (top - box.top - oy) / scale
  const sw = (right - left) / scale
  const sh = (bottom - top) / scale

  try {
    ctx.drawImage(media, sx, sy, sw, sh, 0, 0, SAMPLE_W, SAMPLE_H)
    const { data } = ctx.getImageData(0, 0, SAMPLE_W, SAMPLE_H)
    let sum = 0
    for (let i = 0; i < data.length; i += 4) sum += relLum(data[i], data[i + 1], data[i + 2])
    return sum / (data.length / 4)
  } catch {
    return null // not decoded yet, or cross-origin
  }
}

/** Luminance of what's visually behind `el` (ignoring the nav itself). */
function sampleLuminance(el: HTMLElement, ignore: HTMLElement): { lum: number; overVideo: boolean } {
  const rect = el.getBoundingClientRect()
  const x = rect.left + rect.width / 2
  const y = rect.top + rect.height / 2
  // Only consider the app's own elements (skips the nav, browser-extension overlays, and
  // layers marked `data-tone-ignore` such as a menu scrim/panel)
  const app = document.getElementById('root') ?? document.body
  const under =
    document
      .elementsFromPoint(x, y)
      .find((n) => app.contains(n) && !ignore.contains(n) && !n.closest('[data-tone-ignore]')) ?? null

  let lum: number | null = null
  // The <img>/<video> itself, or one inside a wrapper marked `data-tone-media`
  const media =
    under instanceof HTMLImageElement || under instanceof HTMLVideoElement
      ? under
      : (under?.closest('[data-tone-media]')?.querySelector<HTMLImageElement | HTMLVideoElement>('img, video') ??
        null)
  if (media) {
    lum = mediaLuminance(media, rect)
    // Account for a black tint drawn over the media (.has-overlay::after)
    const wrap = media.parentElement
    if (lum !== null && wrap?.classList.contains('has-overlay')) {
      const opacity = parseFloat(getComputedStyle(wrap, '::after').opacity) || 0
      lum *= 1 - opacity
    }
  }
  if (lum === null) lum = backgroundLuminance(under)

  return { lum, overVideo: media instanceof HTMLVideoElement }
}

/**
 * Sets one `data-tone="light" | "dark"` on `rootRef`, from the average brightness
 * behind all of its `[data-adaptive]` elements: `dark` text on light backgrounds,
 * `light` on dark ones. Re-samples on scroll/resize, and on a timer while over a video.
 */
export function useAdaptiveTone(rootRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    let frame = 0
    let timer = 0

    const update = () => {
      frame = 0
      let anyOverVideo = false
      let total = 0
      const items = root.querySelectorAll<HTMLElement>('[data-adaptive]')
      items.forEach((el) => {
        const { lum, overVideo } = sampleLuminance(el, root)
        total += lum
        anyOverVideo ||= overVideo
      })
      const tone: Tone = items.length && total / items.length > LIGHT_THRESHOLD ? 'dark' : 'light'
      if (root.dataset.tone !== tone) root.dataset.tone = tone
      window.clearTimeout(timer)
      if (anyOverVideo) timer = window.setTimeout(schedule, VIDEO_INTERVAL_MS)
    }

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    schedule()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    // Images/videos finishing loading can change the result
    document.addEventListener('load', schedule, true)
    document.addEventListener('loadeddata', schedule, true)

    return () => {
      cancelAnimationFrame(frame)
      window.clearTimeout(timer)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      document.removeEventListener('load', schedule, true)
      document.removeEventListener('loadeddata', schedule, true)
    }
  }, [rootRef])
}
