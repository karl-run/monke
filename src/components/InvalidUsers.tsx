'use client'

import { InvalidUser } from '@/lib/monkeytype-api'
import { usersParser } from '@/state/url'
import { Cross2Icon, ExclamationTriangleIcon } from '@radix-ui/react-icons'
import { useQueryState } from 'nuqs'

interface InvalidUsersProps {
  invalidUsers: InvalidUser[]
}

export function InvalidUsers({ invalidUsers }: InvalidUsersProps) {
  const [users, setUsers] = useQueryState('u', usersParser.withOptions({ shallow: false }))
  const remove = (index: string) => {
    setUsers(users.filter((u) => u !== index))
  }

  return (
    <div className="p-2">
      <h2 className="text-xl font-bold flex items-center gap-2 text-error-color mb-1">
        <ExclamationTriangleIcon />
        Invalid Users
      </h2>
      <ul className="list-disc pl-6">
        {invalidUsers.map(([user, state], index) => (
          <li key={index} className="flex items-center gap-2">
            <div>
              {user}, {state}
            </div>
            <button
              onClick={() => remove(user)}
              className="border rounded-full p-0.5 -mt-0.5 text-xl hover:bg-error-color hover:border-sub-alt-color hover:text-sub-alt-color transition-all"
            >
              <Cross2Icon />
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
