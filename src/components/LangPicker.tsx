'use client'

import React, { ReactElement } from 'react'
import { useQueryState } from 'nuqs'

type Props = {
  userLangs: string[]
}

function LangPicker({ userLangs }: Props): ReactElement {
  const [lang, setLang] = useQueryState('lang', {
    defaultValue: 'english',
    clearOnDefault: true,
    shallow: false,
  })

  return (
    <select
      defaultValue={lang ?? 'english'}
      className="bg-sub-alt-color border border-sub-color p-2 rounded max-w-40"
      onChange={(event) => {
        setLang(event.target.value)
        document.cookie = `lang=${event.target.value}; path=/;`
      }}
    >
      {!userLangs.includes('english') && <option value="english">english</option>}
      {userLangs.map((it) => (
        <option key={it} value={it}>
          {it}
        </option>
      ))}
    </select>
  )
}

export default LangPicker
