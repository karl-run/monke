import React from 'react'
import { ThemeSelect } from './ThemeSelect'

const ThemePicker = async ({ persistedTheme }: { persistedTheme: string | null }) => {
  const list: { name: string }[] = await fetch('https://monkeytype.com/themes/_list.json', {
    next: {
      revalidate: 36000,
    },
  }).then((it) => it.json())

  return (
    <div className="absolute bottom-2 right-2">
      <ThemeSelect persistedTheme={persistedTheme} themes={list.map((it) => it.name)} />
    </div>
  )
}

export default ThemePicker
