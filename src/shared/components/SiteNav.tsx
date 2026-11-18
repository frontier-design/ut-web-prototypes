import { useRef, type CSSProperties } from 'react'
import logoNav from '../assets/logo-nav.svg'
import { useAdaptiveTone } from '../hooks/useAdaptiveTone'
import './SiteNav.css'

interface SiteNavProps {
  /** Where the logo links to (each version's home). */
  homeHref: string
  /** Where "Let's Talk" goes. */
  contactHref?: string
}

/**
 * Fixed top navigation, shared by v1 and v2. The whole nav switches between black
 * and a light colour together (white, or the version's `--nav-light`), based on the
 * average brightness of the image/video/colour behind its items.
 * Expects --text-ui / --tracking-ui from the version's tokens.
 */
export function SiteNav({ homeHref, contactHref = 'mailto:studio@urbantypology.com' }: SiteNavProps) {
  const ref = useRef<HTMLElement>(null)
  useAdaptiveTone(ref)

  return (
    <header className="site-nav" ref={ref}>
      <div className="container site-nav__inner">
        <a href={homeHref} className="site-nav__logo" aria-label="Urbantypology home" data-adaptive>
          {/* Logo drawn as a mask filled with currentColor, so it always matches the links */}
          <span className="site-nav__logo-mark" style={{ '--logo': `url("${logoNav}")` } as CSSProperties} />
        </a>
        <nav className="site-nav__links" aria-label="Main" data-adaptive>
          <a href="#studio">Studio,</a>
          <a href="#services">Services,</a>
          <a href="#projects">Projects</a>
        </nav>
        <a href={contactHref} data-adaptive>Let’s Talk</a>
      </div>
    </header>
  )
}
