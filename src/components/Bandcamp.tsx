type Props = {
  albumId: string
  url: string
  title: string
  tracklist?: boolean
  artwork?: 'small' | 'none'
}

export default function Bandcamp({
  albumId,
  url,
  title,
  tracklist = true,
  artwork,
}: Props) {
  const parts = [
    `album=${albumId}`,
    'size=large',
    'bgcol=000000',
    'linkcol=e60012',
    `tracklist=${tracklist}`,
    'transparent=true',
  ]
  if (artwork) parts.push(`artwork=${artwork}`)
  const src = `https://bandcamp.com/EmbeddedPlayer/${parts.join('/')}/`
  // Bandcamp's large embed is sized for 350px wide; stretching to 100% blows up the artwork.
  const baseHeight = artwork === 'none' ? 120 : 470
  const height = tracklist ? baseHeight + 320 : baseHeight
  return (
    <iframe
      title="Bandcamp player"
      src={src}
      width="350"
      height={height}
      seamless
      className="block my-6 mx-auto max-w-full border border-white/10"
    >
      <a href={url}>{title}</a>
    </iframe>
  )
}
