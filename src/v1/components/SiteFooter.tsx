import logoFooter from '../assets/main/logo-footer.svg'
import { Col, Container, Grid } from '../../shared/components/Grid'
import './SiteFooter.css'

/** Contact footer on the page cream (mockup "Option 1 - Main"): CTA headline over 8 columns, details in columns 10–12. */
export function SiteFooter() {
  return (
    <footer className="v1-footer" id="contact">
      <Container>
        <Grid>
          <Col lg={8}>
            <p className="v1-footer__headline">
              Bringing meaning to land, from space to place, from the heart.{' '}
              <a href="mailto:studio@urbantypology.com">Let’s talk about yours.</a>
            </p>
          </Col>

          <Col lg={3} startLg={10} className="v1-footer__aside">
            <img className="v1-footer__logo" src={logoFooter} width={322} height={47.2} alt="Urbantypology" />

            <div className="v1-footer__details">
              <p>
                Telephone: <a href="tel:+14377005446">437 700 5446</a>
                <br />
                Email: <a href="mailto:studio@urbantypology.com">studio@urbantypology.com</a>
                <br />
                Instagram:{' '}
                <a href="https://www.instagram.com/urbantypology" target="_blank" rel="noreferrer">
                  @urbantypology
                </a>
                <br />
                Linkedin:{' '}
                <a href="https://www.linkedin.com/" target="_blank" rel="noreferrer">
                  Urbantypology Inc.
                </a>
              </p>
              <address>
                Toronto Office
                <br />
                Unit 10 - 163 Sterling Rd
                <br />
                Toronto, ON, M6R 2B7
              </address>
              <address>
                Ottawa Office
                <br />
                Unit A - 430 Parkdale Ave
                <br />
                Ottawa, ON, K1Y 1H1
              </address>
              <p>© 2027 Urbantypology Inc. All rights reserved.</p>
            </div>
          </Col>
        </Grid>
      </Container>
    </footer>
  )
}
