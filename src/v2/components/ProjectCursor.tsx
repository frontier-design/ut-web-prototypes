import { useEffect, useRef, useState } from 'react'
import './ProjectCursor.css'

/** Must match the opacity transition in ProjectCursor.css. */
const FADE_MS = 200

/**
 * Shows the project name above the (native, pointer) cursor while hovering any
 * element with `data-project="…"`. The label trails the pointer with easing, and
 * always fades: in, out (keeping its text while fading), and out→in when the
 * project changes.
 * Mouse/trackpad only — touch devices are skipped.
 */
export function ProjectCursor() {
  const ref = useRef<HTMLDivElement>(null)
  const [text, setText] = useState('')
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

    // How quickly the label catches up with the pointer each frame (1 = locked to it)
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const FOLLOW = reduceMotion ? 1 : 0.18

    let x = -999 // pointer
    let y = -999
    let lx = x // label
    let ly = y
    let showing = false // currently faded in (or fading in)
    let shownText = '' // text in the label right now
    let target: string | null = null // project under the pointer
    let hiddenAt = 0 // when the last fade-out started
    let frame = 0
    let swapTimer = 0

    const render = () => {
      if (ref.current) ref.current.style.transform = `translate3d(${lx}px, ${ly}px, 0)`
    }

    const tick = () => {
      lx += (x - lx) * FOLLOW
      ly += (y - ly) * FOLLOW
      render()
      // keep animating until it has settled
      frame = Math.abs(x - lx) + Math.abs(y - ly) > 0.1 ? requestAnimationFrame(tick) : 0
    }

    const projectAt = (target: Element | null) =>
      target?.closest<HTMLElement>('[data-project]')?.dataset.project ?? null

    const show = (project: string) => {
      // Appear right at the pointer rather than gliding in from the last position
      if (!showing) {
        lx = x
        ly = y
        render()
      }
      shownText = project
      setText(project)
      setVisible(true)
      showing = true
    }

    const update = (project: string | null) => {
      if (project === target) return
      target = project
      window.clearTimeout(swapTimer)

      const fadedOut = !showing && performance.now() - hiddenAt >= FADE_MS
      const hide = () => {
        if (showing) hiddenAt = performance.now()
        setVisible(false)
        showing = false
      }

      if (!project) {
        // fade out, keeping the text so it doesn't vanish mid-fade
        hide()
      } else if (fadedOut || shownText === project || !shownText) {
        show(project)
      } else {
        // a different name is still on screen: fade it out, then the new one in
        const wait = showing ? FADE_MS : FADE_MS - (performance.now() - hiddenAt)
        hide()
        swapTimer = window.setTimeout(() => target && show(target), wait)
      }
    }

    const move = (e: PointerEvent) => {
      x = e.clientX
      y = e.clientY
      update(projectAt(e.target as Element))
      if (!frame) frame = requestAnimationFrame(tick)
    }

    // Content scrolls under a still mouse — re-check what's beneath it
    const scroll = () => update(projectAt(document.elementFromPoint(x, y)))
    const leave = () => update(null)

    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('scroll', scroll, { passive: true })
    document.documentElement.addEventListener('pointerleave', leave)
    return () => {
      cancelAnimationFrame(frame)
      window.clearTimeout(swapTimer)
      window.removeEventListener('pointermove', move)
      window.removeEventListener('scroll', scroll)
      document.documentElement.removeEventListener('pointerleave', leave)
    }
  }, [])

  return (
    <div ref={ref} className={`project-cursor${visible ? ' is-visible' : ''}`} aria-hidden="true">
      <div className="project-cursor__inner">
        <span className="project-cursor__label">{text}</span>
      </div>
    </div>
  )
}
