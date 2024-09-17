import * as R from 'remeda'
import { getUser, UserProfile } from '@/lib/monkeytype'
import { createSearchParamsCache, SearchParams } from 'nuqs/server'
import { parseAsArrayOf, parseAsString } from 'nuqs'
import { Best } from '@/lib/monkeytype-user'
import { getLangsByUsage } from '@/lib/monkeytype-utils'

import styles from './page.module.css'
import LangPicker from '@/app/lang-picker'

type Props = {
  searchParams: SearchParams
}

const searchParamsCache = createSearchParamsCache({
  u: parseAsArrayOf(parseAsString, ',').withDefault([]),
  lang: parseAsString.withDefault('english'),
})

export default async function Home({ searchParams }: Props) {
  const { u: users, lang } = searchParamsCache.parse(searchParams)

  if (users.length === 0) {
    return <div>No users</div>
  }

  if (users.length > 6) {
    return <div>Too many users</div>
  }

  const usersData = await Promise.all(users.map((it) => getUser(it, lang)))

  return (
    <div className="p-4">
      <div className="p-3 flex justify-between">
        <div>
          <h1 className="text-3xl">Leaderboard</h1>
          <div className="text-sub-color">
            {users.length} users, {lang}
          </div>
        </div>
        <div>
          <LangPicker userLangs={getLangsByUsage(usersData.map((it) => it.langs))} />
        </div>
      </div>
      <div className="overflow-auto pb-8">
        {R.sortBy(usersData, [R.prop('arbitraryScore'), 'desc']).map((user) => (
          <UserRow key={user.name} user={user} lang={lang} />
        ))}
      </div>
    </div>
  )
}

function UserRow({ user }: { user: UserProfile; lang: string }) {
  return (
    <div className="flex flex-col">
      <div className="m-2">
        <h2 className="text-lg font-semibold">
          {user.name} <span className="text-sub-color text-sm">({user.arbitraryScore.toFixed(0)} score)</span>
        </h2>
        <p className="text-gray-500">{user.typingStats.completedTests} tests</p>
      </div>
      <div className={styles.baseGrid + ' gap-3 mx-3 min-h-24'}>
        <div className="grid grid-cols-subgrid col-span-4 rounded bg-sub-alt-color">
          <ScoreItem label="15 Seconds" result={user['time-15']} />
          <ScoreItem label="30 Seconds" result={user['time-30']} />
          <ScoreItem label="60 Seconds" result={user['time-60']} />
          <ScoreItem label="120 Seconds" result={user['time-120']} />
        </div>
        <div className="grid grid-cols-subgrid col-span-4 rounded bg-sub-alt-color">
          <ScoreItem label="10 Words" result={user['words-10']} />
          <ScoreItem label="25 Words" result={user['words-25']} />
          <ScoreItem label="50 Words" result={user['words-50']} />
          <ScoreItem label="100 Words" result={user['words-100']} />
        </div>
      </div>
    </div>
  )
}

function ScoreItem({ label, result }: { label: string; result: Best | undefined }) {
  if (!result) {
    return (
      <div className="flex flex-col items-center p-2">
        <h2 className="text-sm text-sub-color">{label}</h2>
        <div className="text-3xl text-gray-500">0</div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center p-2">
      <h2 className="text-sm text-sub-color">{label}</h2>
      <div className="text-3xl">{result.wpm}</div>
      <div className="text-xl">{result.acc}%</div>
    </div>
  )
}
