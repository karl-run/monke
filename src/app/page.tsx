import { getUser } from '@/lib/monkeytype'
import { createSearchParamsCache, SearchParams } from 'nuqs/server'
import { parseAsArrayOf, parseAsString } from 'nuqs'
import { Best, MonkeyTypeUser } from '@/lib/monkeytype-user'
import { getOtherLangs, getPersonalBest } from '@/lib/monkeytype-utils'

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
  const { u: users } = searchParamsCache.parse(searchParams)

  if (users.length === 0) {
    return <div>No users</div>
  }

  if (users.length > 6) {
    return <div>Too many users</div>
  }

  const usersData: MonkeyTypeUser[] = await Promise.all(users.map((it) => getUser(it)))

  return (
    <div>
      <div className="p-3 flex justify-between">
        <div>
          <h1 className="text-3xl">Leaderboard</h1>
          <div className="">{users.length} users</div>
        </div>
        <div>
          <LangPicker otherLangs={getOtherLangs(usersData)} />
        </div>
      </div>
      <div className="overflow-auto pb-8">
        {usersData.map((user) => (
          <UserRow key={user.name} user={user} />
        ))}
      </div>
    </div>
  )
}

function UserRow({ user }: { user: MonkeyTypeUser }) {
  const lang = searchParamsCache.get('lang')

  return (
    <div className="flex flex-col">
      <div className="m-2">
        <h2 className="text-lg font-semibold">{user.name}</h2>
        <p className="text-gray-500">{user.typingStats.completedTests} tests</p>
      </div>
      <div className={styles.baseGrid + ' gap-3 mx-3 min-h-24'}>
        <div className="grid grid-cols-subgrid col-span-4 rounded bg-sub-alt-color">
          <ScoreItem label="15 Seconds" result={getPersonalBest(user.personalBests, 'time-15', lang)} />
          <ScoreItem label="30 Seconds" result={getPersonalBest(user.personalBests, 'time-30', lang)} />
          <ScoreItem label="60 Seconds" result={getPersonalBest(user.personalBests, 'time-60', lang)} />
          <ScoreItem label="120 Seconds" result={getPersonalBest(user.personalBests, 'time-120', lang)} />
        </div>
        <div className="grid grid-cols-subgrid col-span-4 rounded bg-sub-alt-color">
          <ScoreItem label="10 Words" result={getPersonalBest(user.personalBests, 'words-10', lang)} />
          <ScoreItem label="25 Words" result={getPersonalBest(user.personalBests, 'words-25', lang)} />
          <ScoreItem label="50 Words" result={getPersonalBest(user.personalBests, 'words-50', lang)} />
          <ScoreItem label="100 Words" result={getPersonalBest(user.personalBests, 'words-100', lang)} />
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
