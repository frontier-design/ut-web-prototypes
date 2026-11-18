import type { CSSProperties } from 'react'

export interface ProjectImage {
  src: string
  /** Columns of the 7-column project area this image spans. */
  span: number
  /** width / height, from the Figma frame. */
  ratio: number
  /** object-position, when the crop shouldn't be centred. */
  position?: string
}

export interface Project {
  title: string
  year: string
  disciplines: string
  images: ProjectImage[]
}

/** One project: images on the grid (bottom-aligned when paired), then title · year and disciplines. */
export function ProjectCard({ title, year, disciplines, images }: Project) {
  return (
    <article className="v1-project">
      <div className="v1-project__images">
        {images.map((img) => (
          <div
            key={img.src}
            className="v1-project__image"
            style={{ '--cols': img.span, aspectRatio: img.ratio } as CSSProperties}
          >
            <img src={img.src} alt="" loading="lazy" style={img.position ? { objectPosition: img.position } : undefined} />
          </div>
        ))}
      </div>
      <div className="v1-project__caption">
        <p className="v1-project__title">
          {title}, <span className="v1-project__year">{year}</span>
        </p>
        <p className="v1-project__disciplines">{disciplines}</p>
      </div>
    </article>
  )
}
