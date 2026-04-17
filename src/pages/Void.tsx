import { useEffect, useState } from 'react'
import GlitchBurst from '../components/GlitchBurst'
import { setGlobalFxSuspended } from '../components/GlobalFx'
import { setListNavSuspended } from '../hooks/useListNav'

export default function Void() {
  const [trigger, setTrigger] = useState(1)

  useEffect(() => {
    setGlobalFxSuspended(true)
    setListNavSuspended(true)

    const t1 = setTimeout(() => setTrigger((t) => t + 1), 180)
    const t2 = setTimeout(() => setTrigger((t) => t + 1), 360)

    const blockKeys = (e: KeyboardEvent) => {
      e.preventDefault()
      e.stopImmediatePropagation()
    }
    window.addEventListener('keydown', blockKeys, true)

    // No cleanup: once the site has been rm'd, suspension persists until reload.
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [])

  return (
    <main className="fixed inset-0 bg-black cursor-none select-none">
      <GlitchBurst trigger={trigger} />
    </main>
  )
}
