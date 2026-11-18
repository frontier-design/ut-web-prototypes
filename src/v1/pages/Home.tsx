import { Col, Container, Grid } from '../../shared/components/Grid'
import { HeroCarousel, type HeroSlide } from '../components/HeroCarousel'
import { MenuNav } from '../components/MenuNav'
import { ProjectCard, type Project } from '../components/ProjectCard'
import { SiteFooter } from '../components/SiteFooter'
import { SiteNav } from '../../shared/components/SiteNav'

import logoIntro from '../assets/main/logo-intro.svg'
import poster2697 from '../assets/main/poster-img-2697.jpg'
import poster2668 from '../assets/main/poster-img-2668.jpg'
import poster2725 from '../assets/main/poster-img-2725.jpg'
import poster2746 from '../assets/main/poster-img-2746.jpg'
import thumb1 from '../assets/main/thumb-1.jpg'
import thumb2 from '../assets/main/thumb-2.jpg'
import thumb3 from '../assets/main/thumb-3.jpg'
import thumb4 from '../assets/main/thumb-4.jpg'
import img6487 from '../assets/main/img-6487.jpg'
import img6494 from '../assets/main/img-6494.jpg'
import img2675 from '../assets/main/img-2675.jpg'
import imgOcsb1 from '../assets/main/img-ocsb-1.jpg'
import imgOcsb2 from '../assets/main/img-ocsb-2.jpg'
import imgCedarviewAerial from '../assets/main/img-cedarview-aerial.jpg'
import imgStudioTable from '../assets/main/img-studio-table.jpg'
import imgStudioDetails from '../assets/main/img-studio-details.jpg'
import './Home.css'

/** 12-second web loops in /public (originals: src/assets/Vids). Plays and lists in this order —
 *  OCSB (kids on the timber play area) first. */
const SLIDES: HeroSlide[] = [
  { title: 'OCSB', video: '/videos/v1/img-2725.mp4', poster: poster2725, thumb: thumb3 },
  { title: 'Cedarview Community Lookout', video: '/videos/v1/img-2697.mp4', poster: poster2697, thumb: thumb1 },
  { title: '111 Sussex (Diefenbaker)', video: '/videos/v1/img-2668.mp4', poster: poster2668, thumb: thumb2 },
  { title: 'Cedarview Community (trail)', video: '/videos/v1/img-2746.mp4', poster: poster2746, thumb: thumb4 },
]

const NAV_VARIANT = new URLSearchParams(window.location.search).get('nav')

const DISCIPLINES = 'Urban Design · Public Realm · Civic Spaces'

/** Spans are columns of the 7-column project area (Figma widths 323/439/670px ≈ 3/4/6 columns). */
const PROJECTS: Project[] = [
  {
    title: 'Cedarview Community Lookout',
    year: '2025',
    disciplines: DISCIPLINES,
    images: [
      { src: img6487, span: 3, ratio: 323 / 242 },
      { src: img6494, span: 4, ratio: 439 / 329 },
    ],
  },
  {
    title: '111 Sussex (Diefenbaker)',
    year: '2025',
    disciplines: DISCIPLINES,
    images: [{ src: img2675, span: 6, ratio: 4 / 3 }],
  },
  {
    title: 'OCSB',
    year: '2025',
    disciplines: DISCIPLINES,
    images: [
      { src: imgOcsb1, span: 4, ratio: 439 / 500 },
      { src: imgOcsb2, span: 3, ratio: 324 / 247 },
    ],
  },
  {
    title: 'Cedarview',
    year: '2025',
    disciplines: DISCIPLINES,
    images: [{ src: imgCedarviewAerial, span: 6, ratio: 4 / 3 }],
  },
]

const SERVICES = [
  {
    title: 'Master Planning & Urban Design',
    body: 'We turn a site’s potential into a clear vision, shaping communities with purpose, identity and a sense of belonging.',
  },
  {
    title: 'Landscape Architecture',
    body: 'We design outdoor spaces that connect people to place, drawing on each site’s character, culture and natural landscape.',
  },
  {
    title: 'Approvals & Execution',
    body: 'We carry the vision through approvals and construction, staying involved from the first plans to the finished place.',
  },
]

/**
 * V1 — "v1-main" (Figma 574:3320). One continuous page: video hero, intro line,
 * projects (columns 1–7) beside the studio column (10–12), then the cyan footer.
 */
export default function Home() {
  return (
    <>
      {/* Nav: side menu over columns 10–12. Earlier options kept for reference:
          /v1?nav=menu = full-screen menu · /v1?nav=bar = shared inline nav (as on v2) */}
      {NAV_VARIANT === 'bar' ? (
        <SiteNav homeHref="/v1?nav=bar" contactHref="#contact" />
      ) : NAV_VARIANT === 'menu' ? (
        <MenuNav variant="full" homeHref="/v1?nav=menu" />
      ) : (
        <MenuNav variant="half" homeHref="/v1" />
      )}
      <HeroCarousel slides={SLIDES} />

      <main className="v1-main">
        <Container>
          <h1 className="v1-intro">
            <img className="v1-intro__logo" src={logoIntro} width={459} height={67.28} alt="Urbantypology" />
            <span className="v1-intro__text">is a studio dedicated to transforming land into meaningful places.</span>
          </h1>

          <Grid className="v1-main__grid">
            <Col lg={7} className="v1-projects" as="section" id="projects" aria-label="Projects">
              {PROJECTS.map((p) => (
                <ProjectCard key={p.title} {...p} />
              ))}
            </Col>

            <Col lg={3} startLg={10} className="v1-studio" as="aside" id="studio">
              <p className="v1-studio__statement">
                Whether land becomes a place depends on how wisely it’s used. Urbantypology is a boutique
                placemaking studio uniting urban design and landscape architecture. We turn land into authentic,
                beautiful places, and we see them through to completion.
              </p>

              {/* Studio photos stacked, each with its own caption (mockup "Option 1 - Main") */}
              <figure className="v1-studio__figure">
                <img src={imgStudioTable} alt="" loading="lazy" style={{ aspectRatio: 325 / 379 }} />
                <figcaption>Sharing ideas around the studio table.</figcaption>
              </figure>

              <figure className="v1-studio__figure">
                <img
                  src={imgStudioDetails}
                  alt=""
                  loading="lazy"
                  style={{ aspectRatio: 325 / 404, objectPosition: '56% 50%' }}
                />
                <figcaption>Working through the details.</figcaption>
              </figure>

              <section className="v1-services" id="services" aria-labelledby="services-heading">
                <h2 className="v1-services__label" id="services-heading">
                  Our Services
                </h2>
                <ul className="v1-services__list">
                  {SERVICES.map((s) => (
                    <li key={s.title}>
                      <h3>{s.title}</h3>
                      <p>{s.body}</p>
                    </li>
                  ))}
                </ul>
              </section>
            </Col>
          </Grid>
        </Container>
      </main>

      <SiteFooter />
    </>
  )
}
