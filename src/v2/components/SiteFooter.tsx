import type { CSSProperties } from 'react'
import { Container } from '../../shared/components/Grid'
import './SiteFooter.css'

/** Contact footer (the wordmark above it lives in the page, so it can be sticky). */
export function SiteFooter({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <footer className={`site-footer ${className ?? ''}`} style={style}>
      <Container>
        <div className="site-footer__meta">
          <div className="site-footer__offices">
            <address>
              Toronto Office:<br />
              Unit 10 - 163 Sterling Rd<br />
              Toronto, ON, M6R 2B7
            </address>
            <address>
              Ottawa Office:<br />
              Unit A - 430 Parkdale Ave<br />
              Ottawa, ON, K1Y 1H1
            </address>
          </div>

          <div className="site-footer__contact">
            <div className="site-footer__email">
              <p>Let’s Talk</p>
              <a href="mailto:studio@urbantypology.com">studio@urbantypology.com</a>
            </div>
            <div className="site-footer__social">
              <a href="https://www.instagram.com/" target="_blank" rel="noreferrer">Instagram,</a>
              <a href="https://www.linkedin.com/" target="_blank" rel="noreferrer">Linkedin</a>
            </div>
            <p>© 2027 Urbantypology Inc.</p>
          </div>
        </div>
      </Container>
    </footer>
  )
}
