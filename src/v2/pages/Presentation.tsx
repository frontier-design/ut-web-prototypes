import { useRef, type CSSProperties } from 'react'
import { LoopVideo } from '../components/LoopVideo'
import { ProjectCursor } from '../components/ProjectCursor'
import { SiteFooter } from '../components/SiteFooter'
import { SiteNav } from '../../shared/components/SiteNav'

import logoWordmark from '../assets/presentation/logo-wordmark.svg'
import poster2697 from '../assets/presentation/video-2697-poster.jpg'
import poster2725 from '../assets/presentation/video-2725-poster.jpg'
import img2713 from '../assets/presentation/img-2713.jpg'
import img6487 from '../assets/presentation/img-6487.jpg'
import img6494 from '../assets/presentation/img-6494.jpg'
import img20250826 from '../assets/presentation/img-20250826.jpg'
import img3634 from '../assets/presentation/img-3634.jpg'
import img2707 from '../assets/presentation/img-2707.jpg'
import img8380 from '../assets/presentation/img-8380.jpg'
import imgCalabogie from '../assets/presentation/img-calabogie.jpg'
import './Presentation.css'
import { useCollageMotion } from './useCollageMotion'

/** Videos live in /public so they can be swapped without a rebuild. */
const VIDEO_2697 = '/videos/presentation/img-2697.mp4'
const VIDEO_2725 = '/videos/presentation/img-2725.mp4'

/** Position on the 1440px-wide Figma frame. Scales with viewport width. */
type Box = { x: number; y: number; w: number; h: number }

/**
 * `layer` decides stacking against the sticky wordmark:
 *   'back'  → wordmark passes in FRONT of this media
 *   'front' → media slides OVER the wordmark
 */
type Layer = 'front' | 'back'

/** Shown in the cursor tooltip on hover (names from the Figma labels). */
type Project = 'Cedarview Community (trail)' | 'Catholic School Board' | 'Calabogie'

type Media =
  | (Box & { kind: 'image'; src: string; layer: Layer; project?: Project; rounded?: boolean; position?: string })
  | (Box & { kind: 'video'; src: string; poster: string; layer: Layer; project?: Project; overlay?: number })


// Coordinates copied from Figma node 573:3051 "image scroll layer".
const MEDIA: Media[] = [
  { kind: 'video', src: VIDEO_2697, poster: poster2697, layer: 'front', project: 'Cedarview Community (trail)', x: -99, y: 0, w: 1638, h: 921 },
  { kind: 'image', src: img2713, layer: 'front', project: 'Cedarview Community (trail)', x: 378, y: 921, w: 670, h: 503 },
  { kind: 'image', src: img6487, layer: 'back', project: 'Cedarview Community (trail)', x: 0, y: 1424, w: 730, h: 547 },
  { kind: 'image', src: img6494, layer: 'front', project: 'Cedarview Community (trail)', x: 730, y: 1668, w: 713, h: 535 },
  { kind: 'video', src: VIDEO_2725, poster: poster2725, layer: 'back', project: 'Catholic School Board', x: -18, y: 2203, w: 1458, h: 820 },
  { kind: 'image', src: img20250826, layer: 'front', project: 'Catholic School Board', x: 208, y: 3023, w: 1026, h: 769, rounded: true },
  { kind: 'image', src: img3634, layer: 'back', project: 'Catholic School Board', x: 346.33, y: 3792, w: 749.33, h: 562, rounded: true },
  { kind: 'image', src: img2707, layer: 'front', project: 'Catholic School Board', x: -22, y: 4354, w: 1524, h: 871, rounded: true, position: 'top' },
  { kind: 'image', src: img8380, layer: 'front', project: 'Calabogie', x: 713, y: 5225, w: 730, h: 974 },
  { kind: 'image', src: imgCalabogie, layer: 'back', project: 'Calabogie', x: 71, y: 5543, w: 553, h: 338 },
]

const box = ({ x, y, w, h }: Box) =>
  ({ '--x': x, '--y': y, '--w': w, '--h': h }) as CSSProperties

/**
 * Presentation — "Option 2 - Landing" (Figma 573:3041).
 * The image collage scrolls over the earth-coloured page background. The cyan wordmark sticks to the bottom of the viewport,
 * weaving between photos (see `layer`), and settles into the footer at the end.
 */
export default function Presentation() {
  const collageRef = useRef<HTMLElement>(null)
  useCollageMotion(collageRef)

  return (
    <div className="presentation">
      <SiteNav homeHref="/v2" />
      <ProjectCursor />

      <main className="presentation__collage" ref={collageRef}>
        <div className="presentation__backdrop" />

        {MEDIA.map((m, i) => (
          <div
            key={m.src}
            className={`presentation__media is-${m.layer} ${i === 0 ? 'is-intro' : ''}${m.kind === 'image' && m.rounded ? ' is-rounded' : ''}${m.kind === 'video' && m.overlay ? ' has-overlay' : ''}`}
            data-project={m.project}
            data-tone-media
            style={{ ...box(m), ...(m.kind === 'video' && m.overlay ? { '--overlay': m.overlay } : {}) } as CSSProperties}
          >
            {m.kind === 'video' ? (
              <LoopVideo src={m.src} poster={m.poster} />
            ) : (
              <img src={m.src} alt="" loading="lazy" style={m.position ? { objectPosition: m.position } : undefined} />
            )}
          </div>
        ))}


        {/* Its natural spot is the footer (Figma y=6338); until then it sticks to the viewport bottom. */}
        <div className="presentation__wordmark-spacer" />
        <div className="container presentation__wordmark">
          <img src={logoWordmark} width={1360} height={199.359} alt="Urbantypology" />
        </div>

        <SiteFooter className="presentation__footer" />
      </main>
    </div>
  )
}
