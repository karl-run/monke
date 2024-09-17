import { MonkeyTypeUser } from './monkeytype-user'

export type InvalidUser = [string, 'not-found' | 'something-else']

export async function getMonkeyTypeUser(name: string): Promise<MonkeyTypeUser | InvalidUser> {
  console.log(`Getting data for user ${name}`)

  const response = await fetch(`https://api.monkeytype.com/users/${name}/profile`, {
    next: {
      revalidate: 60,
    },
  })

  if (!response.ok) {
    if (response.status === 404) {
      return [name, 'not-found']
    }

    console.log(`Unable to find user with name ${name}`)

    return [name, 'something-else']
  }

  const result = await response.json()

  return result.data
}
