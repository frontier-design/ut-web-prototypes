import { useEffect, useState } from 'react'
import { Col, Container, Grid } from './Grid'

/** Visual 12-column overlay for checking alignment. Toggle with Ctrl + G. */
export function GridOverlay() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key.toLowerCase() === 'g') {
        e.preventDefault()
        setVisible((v) => !v)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  if (!visible) return null

  return (
    <div className="grid-overlay" aria-hidden="true">
      <Container>
        <Grid>
          {Array.from({ length: 12 }, (_, i) => (
            <Col key={i} span={1} />
          ))}
        </Grid>
      </Container>
    </div>
  )
}
