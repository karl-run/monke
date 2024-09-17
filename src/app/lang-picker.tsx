'use client'

import React, { ReactElement } from 'react'
import { useQueryState } from 'nuqs'

type Props = {
  otherLangs: string[]
}

function LangPicker({ otherLangs }: Props): ReactElement {
  const [lang, setLang] = useQueryState('lang', {
    defaultValue: 'english',
    clearOnDefault: true,
    shallow: false,
  })

  return (
    <select
      defaultValue={lang ?? 'english'}
      className="dark:bg-black dark:border p-2 rounded"
      onChange={(event) => {
        setLang(event.target.value)
      }}
    >
      {!otherLangs.includes('english') && <option value="english">english</option>}
      {otherLangs.map((it) => (
        <option key={it} value={it}>
          {it}
        </option>
      ))}
    </select>
  )
}

export default LangPicker
