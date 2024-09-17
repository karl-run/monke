import * as R from 'remeda'
import { getGoldStars, getUser, GoldStars, UserProfile } from '@/lib/monkeytype'
import { createSearchParamsCache, SearchParams } from 'nuqs/server'
import { parseAsArrayOf, parseAsString } from 'nuqs'
import { Best } from '@/lib/monkeytype-user'
import { getLangsByUsage } from '@/lib/monkeytype-utils'

import styles from './page.module.css'
import { StarFilledIcon } from '@radix-ui/react-icons'
import { InvalidUsers } from '@/components/InvalidUsers'
import { AddUser } from '@/components/AddUser'
import LangPicker from '@/components/LangPicker'
import { langParser, usersParser } from '@/state/url'

type Props = {
  searchParams: SearchParams
}

const searchParamsCache = createSearchParamsCache({
  u: usersParser,
  lang: langParser,
})

export default async function Home({ searchParams }: Props) {
  const { u: users, lang } = searchParamsCache.parse(searchParams)

  if (users.length > 6) {
    return <div>Too many users</div>
  }

  const allUsers = await Promise.all(users.map((it) => getUser(it, lang)))
  const [usersData, invalidUsers] = R.partition(allUsers, (it): it is UserProfile => !Array.isArray(it))

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
      {invalidUsers.length > 0 && <InvalidUsers invalidUsers={invalidUsers} />}
      <div className="overflow-auto pb-8">
        {R.sortBy(usersData, [R.prop('arbitraryScore'), 'desc']).map((user) => (
          <UserRow
            key={user.name}
            user={user}
            goldStars={getGoldStars(
              user,
              usersData.filter((it) => it.name !== user.name),
            )}
          />
        ))}
        {usersData.length === 0 && (
          <div className="w-full bg-sub-alt-color rounded min-h-32 flex items-center justify-center text-xl">
            No users
          </div>
        )}
      </div>
      <AddUser />
    </div>
  )
}

function UserRow({ user, goldStars }: { user: UserProfile; goldStars: GoldStars }) {
  return (
    <div className="flex flex-col">
      <div className="m-2">
        <h2 className="text-lg font-semibold">
          {user.name} <span className="text-sub-color text-sm">({user.arbitraryScore.toFixed(0)} score)</span>
        </h2>
        <div className="grid grid-cols-2 grid-rows-2 gap-x-2 w-fit text-sm font-semibold">
          <p className="text-gray-500">{user.typingStats.completedTests} completed</p>
          <p className="text-gray-500">{(user.typingStats.timeTyping / 60 / 60).toFixed(1)} hours</p>
          <p className="text-gray-500">{user.typingStats.startedTests} started</p>
          <p className="text-gray-500">
            {((user.typingStats.completedTests / user.typingStats.startedTests) * 100).toFixed(1)}% finished
          </p>
        </div>
      </div>
      <div className={styles.baseGrid + ' gap-3 mx-3 min-h-24'}>
        <div className="grid grid-cols-subgrid col-span-4 rounded bg-sub-alt-color">
          <ScoreItem label="15 Seconds" result={user['time-15']} isGold={goldStars['time-15']} />
          <ScoreItem label="30 Seconds" result={user['time-30']} isGold={goldStars['time-30']} />
          <ScoreItem label="60 Seconds" result={user['time-60']} isGold={goldStars['time-60']} />
          <ScoreItem label="120 Seconds" result={user['time-120']} isGold={goldStars['time-120']} />
        </div>
        <div className="grid grid-cols-subgrid col-span-4 rounded bg-sub-alt-color">
          <ScoreItem label="10 Words" result={user['words-10']} isGold={goldStars['words-10']} />
          <ScoreItem label="25 Words" result={user['words-25']} isGold={goldStars['words-25']} />
          <ScoreItem label="50 Words" result={user['words-50']} isGold={goldStars['words-50']} />
          <ScoreItem label="100 Words" result={user['words-100']} isGold={goldStars['words-100']} />
        </div>
      </div>
    </div>
  )
}

function ScoreItem({ label, result, isGold }: { label: string; result: Best | undefined; isGold: boolean }) {
  if (!result) {
    return (
      <div className="flex flex-col items-center p-2">
        <h2 className="text-sm text-sub-color">{label}</h2>
        <div className="text-3xl text-gray-500">0</div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center p-2 relative">
      <h2 className="text-sm text-sub-color">{label}</h2>
      <div className="text-3xl">{result.wpm}</div>
      <div className="text-xl">{result.acc}%</div>
      {isGold && (
        <div>
          <StarFilledIcon className="absolute top-2.5 left-2.5 text-sub-color" />
          <StarFilledIcon className="absolute top-2.5 left-2.5 text-sub-color animate-ping" />
        </div>
      )}
    </div>
  )
}
