import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { CONTENT } from '../data/content'
import type { Kind } from '../data/content'

function generateSiteTree(): string[] {
  const lines: string[] = ['.']
  const kinds = Object.keys(CONTENT) as Kind[]
  
  kinds.forEach((kind, kindIdx) => {
    const isLastKind = kindIdx === kinds.length - 1
    const kindPrefix = isLastKind ? '└── ' : '├── '
    const childPrefix = isLastKind ? '    ' : '│   '
    
    lines.push(`${kindPrefix}${kind}/`)
    
    const categories = CONTENT[kind]
    categories.forEach((cat, catIdx) => {
      const isLastCat = catIdx === categories.length - 1
      const catPrefix = isLastCat ? '└── ' : '├── '
      const postPrefix = isLastCat ? '    ' : '│   '
      
      lines.push(`${childPrefix}${catPrefix}${cat.slug}/`)
      
      cat.posts.forEach((post, postIdx) => {
        const isLastPost = postIdx === cat.posts.length - 1
        const postLine = isLastPost ? '└── ' : '├── '
        lines.push(`${childPrefix}${postPrefix}${postLine}${post.slug}`)
      })
    })
  })
  
  return lines
}

type FSNode = { type: 'dir'; children: Record<string, FSNode> } | { type: 'file'; content: string }

const FILESYSTEM: FSNode = {
  type: 'dir',
  children: {
    bin: { type: 'dir', children: {
      ls: { type: 'file', content: '#!/bin/bash\n# list directory contents' },
      cd: { type: 'file', content: '#!/bin/bash\n# change directory' },
      cat: { type: 'file', content: '#!/bin/bash\n# concatenate files' },
    }},
    etc: { type: 'dir', children: {
      passwd: { type: 'file', content: 'root:x:0:0:root:/root:/bin/bash\nguest:x:1000:1000:guest:/home/guest:/bin/bash' },
      hostname: { type: 'file', content: 'localhost' },
    }},
    home: { type: 'dir', children: {
      guest: { type: 'dir', children: {
        '.bashrc': { type: 'file', content: 'export PS1="\\u@\\h:\\w\\$ "\nalias ll="ls -la"' },
        'notes.txt': { type: 'file', content: 'todo: add content\ntodo: fix the jitter\ntodo: check out the site' },
        'site': { type: 'dir', children: {} }, // special - navigates to real site
      }},
    }},
    tmp: { type: 'dir', children: {} },
    var: { type: 'dir', children: {
      log: { type: 'dir', children: {
        'syslog': { type: 'file', content: '[2026-04-17 03:14:15] system started\n[2026-04-17 03:14:16] network online\n[2026-04-17 03:14:17] ready' },
      }},
    }},
    usr: { type: 'dir', children: {
      share: { type: 'dir', children: {
        doc: { type: 'dir', children: {} },
      }},
    }},
  },
}

function resolvePath(cwd: string[], path: string): string[] | null {
  let result = [...cwd]
  
  if (path.startsWith('/')) {
    result = []
    path = path.slice(1)
  }
  
  if (!path) return result
  
  const parts = path.split('/').filter(Boolean)
  for (const part of parts) {
    if (part === '.') continue
    if (part === '..') {
      result.pop()
    } else {
      result.push(part)
    }
  }
  return result
}

function getNode(path: string[]): FSNode | null {
  let node: FSNode = FILESYSTEM
  for (const part of path) {
    if (node.type !== 'dir' || !(part in node.children)) return null
    node = node.children[part]
  }
  return node
}

function formatPath(path: string[]): string {
  return '/' + path.join('/')
}

function tree(node: FSNode, currentPath: string[] = [], prefix = '', isLast = true, isRoot = true): string[] {
  const lines: string[] = []
  if (node.type !== 'dir') return lines
  
  const entries = Object.entries(node.children).sort(([a], [b]) => a.localeCompare(b))
  entries.forEach(([name, child], idx) => {
    const last = idx === entries.length - 1
    const connector = isRoot ? '' : (isLast ? '└── ' : '├── ')
    const newPrefix = isRoot ? '' : prefix + (isLast ? '    ' : '│   ')
    const childPath = [...currentPath, name]
    
    if (isRoot) {
      lines.push(name + (child.type === 'dir' ? '/' : ''))
    } else {
      lines.push(prefix + connector + name + (child.type === 'dir' ? '/' : ''))
    }
    
    // Special case: site/ shows blog content
    if (child.type === 'dir' && childPath.join('/') === 'home/guest/site') {
      const siteContent = generateSiteTree()
      // Skip '.' root line and add proper prefix to each line
      siteContent.slice(1).forEach(line => {
        lines.push(newPrefix + line)
      })
    } else if (child.type === 'dir') {
      lines.push(...tree(child, childPath, newPrefix, last, false))
    }
  })
  return lines
}

export default function Terminal() {
  const navigate = useNavigate()
  const [history, setHistory] = useState<Array<{ input: string; output: string[] }>>([])
  const [input, setInput] = useState('')
  const [cwd, setCwd] = useState(['home', 'guest'])
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    containerRef.current?.scrollTo(0, containerRef.current.scrollHeight)
  }, [history])

  const execute = (cmd: string) => {
    const parts = cmd.trim().split(/\s+/)
    const command = parts[0]
    const args = parts.slice(1)
    let output: string[] = []

    switch (command) {
      case '':
        break

      case 'help':
        output = [
          'available commands:',
          '  help     - show this message',
          '  pwd      - print working directory',
          '  ls       - list directory contents',
          '  cd       - change directory',
          '  cat      - display file contents',
          '  tree     - show directory tree',
          '  clear    - clear terminal',
          '  whoami   - print current user',
          '  echo     - print arguments',
          '  date     - print current date',
        ]
        break

      case 'pwd':
        output = [formatPath(cwd)]
        break

      case 'whoami':
        output = ['guest']
        break

      case 'date':
        output = [new Date().toString()]
        break

      case 'echo':
        output = [args.join(' ')]
        break

      case 'clear':
        setHistory([])
        setInput('')
        return

      case 'ls': {
        const targetPath = args[0] ? resolvePath(cwd, args[0]) : cwd
        if (!targetPath) {
          output = [`ls: cannot access '${args[0]}': No such file or directory`]
          break
        }
        const node = getNode(targetPath)
        if (!node) {
          output = [`ls: cannot access '${args[0]}': No such file or directory`]
        } else if (node.type === 'file') {
          output = [args[0] || formatPath(targetPath)]
        } else {
          const entries = Object.entries(node.children)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([name, child]) => child.type === 'dir' ? name + '/' : name)
          output = entries.length ? [entries.join('  ')] : []
        }
        break
      }

      case 'cd': {
        const target = args[0] || '/home/guest'
        const newPath = resolvePath(cwd, target)
        
        if (!newPath) {
          output = [`cd: ${target}: No such file or directory`]
          break
        }
        
        // Special case: navigating to site/ goes to real site
        if (newPath.join('/') === 'home/guest/site') {
          navigate('/')
          return
        }
        
        const node = getNode(newPath)
        if (!node) {
          output = [`cd: ${target}: No such file or directory`]
        } else if (node.type === 'file') {
          output = [`cd: ${target}: Not a directory`]
        } else {
          setCwd(newPath)
        }
        break
      }

      case 'cat': {
        if (!args[0]) {
          output = ['cat: missing operand']
          break
        }
        const targetPath = resolvePath(cwd, args[0])
        if (!targetPath) {
          output = [`cat: ${args[0]}: No such file or directory`]
          break
        }
        const node = getNode(targetPath)
        if (!node) {
          output = [`cat: ${args[0]}: No such file or directory`]
        } else if (node.type === 'dir') {
          output = [`cat: ${args[0]}: Is a directory`]
        } else {
          output = node.content.split('\n')
        }
        break
      }

      case 'tree': {
        const targetPath = args[0] ? resolvePath(cwd, args[0]) : cwd
        if (!targetPath) {
          output = [`tree: '${args[0]}': No such file or directory`]
          break
        }
        // Special case: site/ shows actual blog content
        if (targetPath.join('/') === 'home/guest/site') {
          output = generateSiteTree()
          break
        }
        const node = getNode(targetPath)
        if (!node) {
          output = [`tree: '${args[0]}': No such file or directory`]
        } else if (node.type === 'file') {
          output = [args[0] || formatPath(targetPath)]
        } else {
          output = ['.', ...tree(node, targetPath)]
        }
        break
      }

      default:
        output = [`${command}: command not found`]
    }

    setHistory(h => [...h, { input: cmd, output }])
    setInput('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    e.stopPropagation() // Prevent GlobalFx from capturing keys
    if (e.key === 'Enter') {
      execute(input)
    }
  }

  const displayPath = cwd.length >= 2 && cwd[0] === 'home' && cwd[1] === 'guest'
    ? (cwd.length === 2 ? '~' : '~/' + cwd.slice(2).join('/'))
    : formatPath(cwd)
  const prompt = `[guest@site ${displayPath}]$\u00A0`

  return (
    <div 
      className="min-h-screen bg-black text-white text-sm p-4 cursor-text"
      onClick={() => inputRef.current?.focus()}
    >
      <div ref={containerRef} className="max-w-4xl mx-auto px-3 overflow-auto max-h-[calc(100vh-2rem)]">
        {history.map((entry, i) => (
          <div key={i}>
            {entry.input && (
              <div className="flex">
                <span className="text-[var(--accent)]">{prompt}</span>
                <span>{entry.input}</span>
              </div>
            )}
            {entry.output.map((line, j) => (
              <div key={j} className="text-white/80 whitespace-pre">{line}</div>
            ))}
          </div>
        ))}
        <div>
          <span className="text-[var(--accent)]">{prompt}</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="bg-transparent outline-none border-none text-white w-[60%]"
            style={{ 
              caretColor: 'var(--accent)',
              padding: 0,
              margin: 0,
              font: 'inherit',
            }}
            spellCheck={false}
            autoComplete="off"
          />
        </div>
      </div>
    </div>
  )
}
