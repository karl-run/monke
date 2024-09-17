import { Best, MonkeyTypeUser } from '@/lib/monkeytype-user'
import { getMonkeyTypeUser } from './monkeytype-api'
import { getPersonalBest, getUserLangs } from './monkeytype-utils'

export type UserProfile = Pick<MonkeyTypeUser, 'name' | 'typingStats'> &
  PersonalBests &
  EnhancedMonke & { langs: string[] }

export async function getUser(name: string, lang: string): Promise<UserProfile> {
  const monkeyTypeUser = await getMonkeyTypeUser(name)

  const personalBests = getPersonalBests(monkeyTypeUser, lang)
  const extraValues = enhanceMonke(personalBests)

  return {
    name: monkeyTypeUser.name,
    typingStats: monkeyTypeUser.typingStats,
    langs: getUserLangs(monkeyTypeUser),
    ...personalBests,
    ...extraValues,
  }
}

export type PersonalBests = {
  'time-15': Best | undefined
  'time-30': Best | undefined
  'time-60': Best | undefined
  'time-120': Best | undefined
  'words-10': Best | undefined
  'words-25': Best | undefined
  'words-50': Best | undefined
  'words-100': Best | undefined
}

function getPersonalBests({ personalBests }: MonkeyTypeUser, lang: string): PersonalBests {
  return {
    'time-15': getPersonalBest(personalBests, 'time-15', lang),
    'time-30': getPersonalBest(personalBests, 'time-30', lang),
    'time-60': getPersonalBest(personalBests, 'time-60', lang),
    'time-120': getPersonalBest(personalBests, 'time-120', lang),
    'words-10': getPersonalBest(personalBests, 'words-10', lang),
    'words-25': getPersonalBest(personalBests, 'words-25', lang),
    'words-50': getPersonalBest(personalBests, 'words-50', lang),
    'words-100': getPersonalBest(personalBests, 'words-100', lang),
  }
}

type EnhancedMonke = {
  arbitraryScore: number
}

function enhanceMonke(personalBests: PersonalBests): EnhancedMonke {
  return {
    arbitraryScore:
      (personalBests['time-15']?.wpm ?? 0) * 1.0 +
      (personalBests['time-30']?.wpm ?? 0) * 1.02 +
      (personalBests['time-60']?.wpm ?? 0) * 1.04 +
      (personalBests['time-120']?.wpm ?? 0) * 1.06 +
      (personalBests['words-10']?.wpm ?? 0) * 1.01 +
      (personalBests['words-25']?.wpm ?? 0) * 1.03 +
      (personalBests['words-50']?.wpm ?? 0) * 1.05 +
      (personalBests['words-100']?.wpm ?? 0) * 1.07,
  }
}
