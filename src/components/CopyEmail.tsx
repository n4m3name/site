import { useState } from 'react'

export default function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <a
      href={`mailto:${email}`}
      onClick={(e) => {
        e.preventDefault()
        navigator.clipboard.writeText(email).then(() => {
          setCopied(true)
          setTimeout(() => setCopied(false), 1500)
        })
      }}
    >
      {copied ? 'copied!' : email}
    </a>
  )
}
