'use client'

import { InvalidUser } from '@/lib/monkeytype-api'
import { ExclamationTriangleIcon } from '@radix-ui/react-icons'

interface InvalidUsersProps {
  users: InvalidUser[]
}

export function InvalidUsers({ users }: InvalidUsersProps) {
  return (
    <div className="p-2">
      <h2 className="text-xl font-bold flex items-center gap-2 text-error-color">
        <ExclamationTriangleIcon />
        Invalid Users
      </h2>
      <ul className="list-disc pl-10">
        {users.map(([user, state], index) => (
          <li key={index}>
            {user}, {state}
          </li>
        ))}
      </ul>
    </div>
  )
}
