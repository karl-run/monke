import { MonkeyTypeUser } from '@/lib/monkeytype-user'

export async function getUser(name: string): Promise<MonkeyTypeUser> {
  console.log(`Getting data for user ${name}`)

  const response = await fetch(`https://api.monkeytype.com/users/${name}/profile`, {
    next: {
      revalidate: 60,
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch user')
  }

  const result = await response.json()

  return result.data
}
