interface LoopVideoProps {
  src: string
  /** Shown until the video loads (and as a fallback if the file is missing). */
  poster: string
  className?: string
}

/** Background-style video: autoplays, loops, muted, inline on iOS. */
export function LoopVideo({ src, poster, className }: LoopVideoProps) {
  return (
    <video
      className={className}
      src={src}
      poster={poster}
      autoPlay
      loop
      muted
      playsInline
      preload="auto"
      aria-hidden="true"
    />
  )
}
