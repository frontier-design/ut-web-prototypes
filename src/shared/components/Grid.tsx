import type { CSSProperties, ElementType, HTMLAttributes, ReactNode } from 'react'

type Span = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
type Start = Span

interface BaseProps extends Omit<HTMLAttributes<HTMLElement>, 'className' | 'style' | 'children'> {
  as?: ElementType
  className?: string
  style?: CSSProperties
  children?: ReactNode
}

const cx = (...classes: (string | undefined | false)[]) =>
  classes.filter(Boolean).join(' ')

/** Max-width wrapper with the 40px side margins. */
export function Container({ as: Tag = 'div', className, ...rest }: BaseProps) {
  return <Tag className={cx('container', className)} {...rest} />
}

interface GridProps extends BaseProps {
  /** Vertical gap between rows. Defaults to the gutter (20px). */
  rowGap?: number | string
}

/** 12-column grid with 20px gutters. */
export function Grid({ as: Tag = 'div', className, rowGap, style, ...rest }: GridProps) {
  const vars = rowGap !== undefined
    ? { '--grid-row-gap': typeof rowGap === 'number' ? `${rowGap}px` : rowGap }
    : {}
  return <Tag className={cx('grid', className)} style={{ ...vars, ...style }} {...rest} />
}

interface ColProps extends BaseProps {
  /** Columns to span on mobile (base). Defaults to 12. */
  span?: Span
  sm?: Span // ≥ 640px
  md?: Span // ≥ 768px
  lg?: Span // ≥ 1024px
  xl?: Span // ≥ 1280px
  /** Column line to start at (1–12). */
  start?: Start
  startSm?: Start
  startMd?: Start
  startLg?: Start
  startXl?: Start
}

/** A grid cell. Breakpoint props cascade upward (mobile-first). */
export function Col({
  as: Tag = 'div',
  className,
  style,
  span, sm, md, lg, xl,
  start, startSm, startMd, startLg, startXl,
  ...rest
}: ColProps) {
  const entries: [string, number | undefined][] = [
    ['--span', span], ['--span-sm', sm], ['--span-md', md], ['--span-lg', lg], ['--span-xl', xl],
    ['--start', start], ['--start-sm', startSm], ['--start-md', startMd],
    ['--start-lg', startLg], ['--start-xl', startXl],
  ]
  const vars = Object.fromEntries(entries.filter(([, v]) => v !== undefined)) as CSSProperties

  return <Tag className={cx('col', className)} style={{ ...vars, ...style }} {...rest} />
}
