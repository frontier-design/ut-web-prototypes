import { useEffect, type RefObject } from 'react'

/** Fallback so the intro never gets stuck if the hero video is slow or missing. */
const INTRO_FALLBACK_MS = 3000

/**
 * Motion for the Presentation collage:
 *  - `.is-intro`  (hero): its video fades up once the first frame is ready.
 *  - every `.presentation__media`: parallax — the picture drifts slightly against
 *    its frame while scrolling, so each frame reads like a window.
 * Styling lives in Presentation.css; this only toggles classes.
 */
export function useCollageMotion(rootRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    // --- Intro: hero video fade-up ---
    const intro = root.querySelector<HTMLElement>('.is-intro')
    const introVideo = intro?.querySelector('video')
    let introTimer = 0
    let introFrame = 0
    const markReady = () => {
      window.clearTimeout(introTimer)
      // wait two frames so the hidden state paints first and the fade actually runs
      introFrame = requestAnimationFrame(() => {
        introFrame = requestAnimationFrame(() => intro?.classList.add('is-ready'))
      })
    }
    if (intro) {
      if (introVideo && introVideo.readyState >= 2) markReady()
      else {
        introVideo?.addEventListener('loadeddata', markReady, { once: true })
        introTimer = window.setTimeout(markReady, INTRO_FALLBACK_MS)
      }
    }

    // --- Parallax: write each visible frame's position to --p ---
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const visible = new Set<HTMLElement>()
    let frame = 0

    const update = () => {
      frame = 0
      const vh = window.innerHeight
      visible.forEach((el) => {
        const r = el.getBoundingClientRect()
        // −1 when the frame's centre is a full (frame + viewport) half-span above centre, +1 below
        const p = (r.top + r.height / 2 - vh / 2) / ((vh + r.height) / 2)
        el.style.setProperty('--p', Math.max(-1, Math.min(1, p)).toFixed(4))
      })
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    const observer = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) visible.add(e.target as HTMLElement)
        else visible.delete(e.target as HTMLElement)
      }
      schedule()
    })

    if (!reduceMotion) {
      root.querySelectorAll<HTMLElement>('.presentation__media').forEach((el) => observer.observe(el))
      window.addEventListener('scroll', schedule, { passive: true })
      window.addEventListener('resize', schedule)
    }

    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      window.clearTimeout(introTimer)
      cancelAnimationFrame(introFrame)
      introVideo?.removeEventListener('loadeddata', markReady)
    }
  }, [rootRef])
}
