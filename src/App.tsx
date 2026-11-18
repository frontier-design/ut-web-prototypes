import { lazy, Suspense } from 'react'
import { GridOverlay } from './shared/components/GridOverlay'
import './VersionIndex.css'

// Each version is loaded on demand so its CSS doesn't leak into the other.
const V1App = lazy(() => import('./v1/App'))
const V2App = lazy(() => import('./v2/App'))

/** Plain list of the prototypes, set like the site nav (15px Helvetica, 40px margins). */
function VersionIndex() {
  return (
    <main className="container version-index">
      <nav aria-label="Prototypes">
        <a href="/v1">Version 1</a>
        <a href="/v2">Version 2</a>
      </nav>
    </main>
  )
}

export default function App() {
  const path = window.location.pathname
  const Version = path.startsWith('/v1') ? V1App : path.startsWith('/v2') ? V2App : null

  return (
    <>
      {Version ? (
        <Suspense fallback={null}>
          <Version />
        </Suspense>
      ) : (
        <VersionIndex />
      )}
      <GridOverlay />
    </>
  )
}
