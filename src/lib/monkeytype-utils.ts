import * as R from 'remeda'
import { Best, MonkeyTypeUser, PersonalBests } from '@/lib/monkeytype-user'

type Words = `${'words'}-${'10' | '25' | '50' | '100'}`
type Time = `${'time'}-${'15' | '30' | '60' | '120'}`

export function getPersonalBest(best: PersonalBests, type: Words | Time, lang: string): Best | undefined {
  const category = lookupType(type)(best)

  if (!category) return undefined

  return R.find(category, (it) => it.language === lang)
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

export function getUserLangs(user: MonkeyTypeUser): string[] {
  return R.pipe(
    [...R.values(user.personalBests.time), ...R.values(user.personalBests.words)],
    R.flat(),
    R.groupBy((it) => it.language),
    R.entries(),
    R.map(([lang, group]) => [lang, group.length] as const),
    R.sortBy([R.last(), 'desc']),
    R.map(R.first()),
  )
}

export function getLangsByUsage(userLangs: string[][]): string[] {
  return R.pipe(
    userLangs,
    R.flat(),
    R.groupBy((lang) => lang),
    R.entries(),
    R.map(([lang, group]) => [lang, group.length] as const),
    R.sortBy([R.last(), 'desc']),
    R.map(R.first()),
  )
}
