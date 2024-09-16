export interface MonkeyTypeUser {
  name: string
  addedAt: number
  typingStats: TypingStats
  personalBests: PersonalBests
  xp: number
  streak: number
  maxStreak: number
  isPremium: boolean
  allTimeLbs: AllTimeLbs
  uid: string
}

export interface TypingStats {
  completedTests: number
  startedTests: number
  timeTyping: number
}

export interface PersonalBests {
  time: Time
  words: Words
}

export interface Best {
  acc: number
  consistency: number
  difficulty: string
  lazyMode: boolean
  language: string
  punctuation: boolean
  raw: number
  wpm: number
  numbers: boolean
  timestamp: number
}

export interface Time {
  '15': Best[]
  '30': Best[]
  '60': Best[]
  '120': Best[]
}

export interface Words {
  '10': Best[]
  '25': Best[]
  '50': Best[]
  '100': Best[]
}

export interface AllTimeLbs {
  time: Time2
}

export interface Time2 {
  '15': N152
  '60': N602
}

export interface N152 {
  english: English
}

export interface English {
  count: number
}

export interface N602 {
  english: English2
}

export interface English2 {
  count: number
}
