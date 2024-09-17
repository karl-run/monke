import * as R from 'remeda'
import { Best, MonkeyTypeUser, PersonalBests } from '@/lib/monkeytype-user'

type Words = `${'words'}-${'10' | '25' | '50' | '100'}`
type Time = `${'time'}-${'15' | '30' | '60' | '120'}`

export function getPersonalBest(best: PersonalBests, type: Words | Time, lang: string): Best | undefined {
  return R.pipe(
    best,
    lookupType(type),
    R.find((it) => it.language === lang),
  )
}

function lookupType(type: Words | Time) {
  return (best: PersonalBests): Best[] => {
    const [time, num] = type.split('-') as [keyof PersonalBests, string]

    switch (time) {
      case 'time':
        return best.time[num as keyof PersonalBests['time']]
      case 'words':
        return best.words[num as keyof PersonalBests['words']]
    }
  }
}

export function getOtherLangs(users: MonkeyTypeUser[]): string[] {
  return R.pipe(
    users,
    R.flatMap((it) => [...R.values(it.personalBests.time), ...R.values(it.personalBests.words)]),
    R.flat(),
    R.groupBy((it) => it.language),
    R.entries(),
    R.map(([lang, group]) => [lang, group.length] as const),
    R.sortBy([R.last(), 'desc']),
    R.map(R.first()),
  )
}
