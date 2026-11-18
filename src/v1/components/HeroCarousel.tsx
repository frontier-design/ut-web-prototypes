import { useEffect, useRef, useState } from 'react'
import './HeroCarousel.css'

export interface HeroSlide {
  /** Project name, used for the thumbnail's accessible label. */
  title: string
  video: string
  poster: string
  thumb: string
}

/**
 * Full-bleed hero (Figma "-" / IMG_2746): stacked autoplaying, muted videos that
 * crossfade. Each clip plays once, then the next one starts. The active
 * thumbnail's white outline draws around as a timer while its clip plays;
 * clicking a thumbnail jumps straight to that clip.
 */
export function HeroCarousel({ slides, startAt = 0 }: { slides: HeroSlide[]; startAt?: number }) {
  const [active, setActive] = useState(startAt)
  const videos = useRef<(HTMLVideoElement | null)[]>([])
  const timers = useRef<(SVGRectElement | null)[]>([])

  // Play the active clip from the start; pause the others once they've faded out
  useEffect(() => {
    const current = videos.current[active]
    if (current) {
      current.currentTime = 0
      current.play().catch(() => {})
    }
    const t = window.setTimeout(() => {
      videos.current.forEach((v, i) => i !== active && v?.pause())
    }, 1000) // matches the crossfade in HeroCarousel.css
    return () => window.clearTimeout(t)
  }, [active])

  // Timer: the active thumbnail's outline draws around as its clip plays.
  // Driven by the video's own currentTime, so it stays in sync if playback stalls.
  useEffect(() => {
    let frame = 0
    timers.current.forEach((r, i) => i !== active && r?.style.setProperty('stroke-dashoffset', '100'))
    const tick = () => {
      const v = videos.current[active]
      const p = v && v.duration ? Math.min(1, v.currentTime / v.duration) : 0
      timers.current[active]?.style.setProperty('stroke-dashoffset', String(100 - p * 100))
      frame = requestAnimationFrame(tick)
    }
    tick()
    return () => cancelAnimationFrame(frame)
  }, [active])

  const next = () => setActive((i) => (i + 1) % slides.length)

  return (
    <section className="v1-hero" aria-label="Featured projects">
      {slides.map((s, i) => (
        <video
          key={s.video}
          ref={(el) => {
            videos.current[i] = el
          }}
          className={`v1-hero__video${i === active ? ' is-active' : ''}`}
          src={s.video}
          poster={s.poster}
          muted
          playsInline
          autoPlay={i === startAt}
          preload={i === active || i === (active + 1) % slides.length ? 'auto' : 'metadata'}
          onEnded={i === active ? next : undefined}
          aria-hidden="true"
        />
      ))}

      <div className="v1-hero__thumbs">
        {slides.map((s, i) => (
          <button
            key={s.thumb}
            type="button"
            className={`v1-hero__thumb${i === active ? ' is-active' : ''}`}
            onClick={() => setActive(i)}
            aria-label={`Show ${s.title}`}
            aria-pressed={i === active}
          >
            <img src={s.thumb} alt="" />
            {/* Progress outline: pathLength 100 → dashoffset 100 (empty) … 0 (closed) */}
            <svg className="v1-hero__timer" viewBox="0 0 82.72 46.58" preserveAspectRatio="none" aria-hidden="true">
              <rect
                ref={(el) => {
                  timers.current[i] = el
                }}
                x="1"
                y="1"
                width="80.72"
                height="44.58"
                rx="1.5"
                pathLength="100"
              />
            </svg>
          </button>
        ))}
      </div>
    </section>
  )
}
