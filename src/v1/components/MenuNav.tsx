import { useEffect, useRef, useState, type CSSProperties, type Ref } from 'react'
import logoNav from '../../shared/assets/logo-nav.svg'
import { Col, Container, Grid } from '../../shared/components/Grid'
import { useAdaptiveTone } from '../../shared/hooks/useAdaptiveTone'
import './MenuNav.css'

const LINKS = [
  { label: 'Studio', href: '#studio' },
  { label: 'Services', href: '#services' },
  { label: 'Projects', href: '#projects' },
  { label: 'Let’s talk', href: '#contact' },
]

type Variant = 'full' | 'half'

interface MenuNavProps {
  /** `full`: the menu covers the screen. `half`: a narrow panel slides in over the last grid columns (10–12 on desktop). */
  variant?: Variant
  homeHref?: string
}

function MenuLinks({ firstRef, onNavigate }: { firstRef: Ref<HTMLAnchorElement>; onNavigate: () => void }) {
  return (
    <ol className="v1-menu__links">
      {LINKS.map((l, i) => (
        <li key={l.label} style={{ '--i': i } as CSSProperties}>
          <a href={l.href} ref={i === 0 ? firstRef : undefined} onClick={onNavigate}>
            <span className="v1-menu__label">{l.label}</span>
          </a>
        </li>
      ))}
    </ol>
  )
}

function MenuContact() {
  return (
    <>
      <p>
        <a href="mailto:studio@urbantypology.com">studio@urbantypology.com</a>
        <br />
        <a href="tel:+14377005446">437 700 5446</a>
      </p>
      <p>
        <a href="https://www.instagram.com/urbantypology" target="_blank" rel="noreferrer">
          Instagram
        </a>
        ,{' '}
        <a href="https://www.linkedin.com/" target="_blank" rel="noreferrer">
          Linkedin
        </a>
      </p>
      <p>Toronto · Ottawa</p>
    </>
  )
}

/**
 * Alternative v1 nav: a minimal bar (logo · "Menu") that opens the menu — the pages
 * in the 70px serif plus the contact details. `full` covers the screen in cyan;
 * `half` slides a narrow cyan panel over columns 10–12, leaving the page visible (dimmed)
 * on the left. The bar keeps the shared nav's position, logo size and tone switching.
 */
export function MenuNav({ variant = 'full', homeHref = '/v1' }: MenuNavProps) {
  const [open, setOpen] = useState(false)
  const barRef = useRef<HTMLElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const firstLinkRef = useRef<HTMLAnchorElement>(null)
  useAdaptiveTone(barRef)

  // Lock page scroll, close on Escape, and move focus in/out of the menu
  useEffect(() => {
    if (!open) return
    const html = document.documentElement
    const prevOverflow = html.style.overflow
    html.style.overflow = 'hidden'
    firstLinkRef.current?.focus({ preventScroll: true })

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    const toggle = toggleRef.current
    return () => {
      html.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKey)
      toggle?.focus({ preventScroll: true })
    }
  }, [open])

  const close = () => setOpen(false)
  const stateClass = open ? ' is-open' : ''

  return (
    <>
      {variant === 'half' && (
        // Dims the visible half of the page; clicking it closes the menu
        <div className={`v1-menu-scrim${stateClass}`} onClick={close} aria-hidden="true" data-tone-ignore />
      )}

      <div
        id="v1-menu"
        className={`v1-menu v1-menu--${variant}${stateClass}`}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        aria-hidden={!open}
        inert={!open}
        data-tone-ignore
      >
        {variant === 'full' ? (
          <Container className="v1-menu__inner">
            <Grid className="v1-menu__grid">
              <Col lg={8} as="nav" aria-label="Main">
                <MenuLinks firstRef={firstLinkRef} onNavigate={close} />
              </Col>
              <Col lg={3} startLg={10} className="v1-menu__contact">
                <MenuContact />
              </Col>
            </Grid>
          </Container>
        ) : (
          <div className="v1-menu__panel">
            <nav aria-label="Main">
              <MenuLinks firstRef={firstLinkRef} onNavigate={close} />
            </nav>
            <div className="v1-menu__contact">
              <MenuContact />
            </div>
          </div>
        )}
      </div>

      <header className={`v1-menubar v1-menubar--${variant}${stateClass}`} ref={barRef}>
        <div className="container v1-menubar__inner">
          <a href={homeHref} className="v1-menubar__logo" aria-label="Urbantypology home" data-adaptive>
            <img src={logoNav} width={104.5} height={15.32} alt="" />
          </a>
          <button
            ref={toggleRef}
            type="button"
            className="v1-menubar__toggle"
            aria-expanded={open}
            aria-controls="v1-menu"
            onClick={() => setOpen((o) => !o)}
            data-adaptive
          >
            {open ? 'Close' : 'Menu'}
          </button>
        </div>
      </header>
    </>
  )
}
