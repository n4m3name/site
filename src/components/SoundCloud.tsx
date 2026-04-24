type Props = {
  url: string
  visual?: boolean
  autoPlay?: boolean
}

export default function SoundCloud({ url, visual = false, autoPlay = false }: Props) {
  const params = new URLSearchParams({
    url,
    color: '#E60012',
    inverse: 'true',
    auto_play: String(autoPlay),
    hide_related: 'true',
    show_comments: 'false',
    show_user: 'true',
    show_reposts: 'false',
    show_teaser: 'false',
    visual: String(visual),
  })
  const src = `https://w.soundcloud.com/player/?${params.toString()}`
  return (
    <iframe
      title="SoundCloud player"
      src={src}
      width="100%"
      height={visual ? 300 : 166}
      scrolling="no"
      frameBorder="no"
      allow="autoplay"
      className="block my-6 border border-white/10"
    />
  )
}
