'use client'

import { useState } from 'react'

type Props = {
  persistedTheme: string | null
  themes: string[]
}

export function ThemeSelect({ persistedTheme, themes }: Props) {
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null)

  return (
    <>
      <select
        className="bg-sub-alt-color border border-sub-color p-2 rounded max-w-40"
        defaultValue={persistedTheme ?? 'serika_dark'}
        onChange={(e) => {
          document.cookie = `theme=${e.target.value}; path=/; max-age=31536000`
          return setSelectedTheme(e.target.value)
        }}
      >
        {themes.map((it) => (
          <option key={it} value={it}>
            {it.replace('_', ' ')}
          </option>
        ))}
      </select>
      {selectedTheme && <link rel="stylesheet" href={`https://monkeytype.com/themes/${selectedTheme}.css`} />}
    </>
  )
}
