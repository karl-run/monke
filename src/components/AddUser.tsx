'use client'

import { usersParser } from '@/state/url'
import { useQueryState } from 'nuqs'

export function AddUser() {
  const [users, setUsers] = useQueryState('u', usersParser.withOptions({ shallow: false }))
  const add = (newUser: string) => {
    setUsers([...users, newUser])
  }

  return (
    <div className="flex justify-end mr-4">
      <div className="flex flex-col gap-1 mt-12">
        <label htmlFor="username" className="text-sm">
          Add user
        </label>
        <div className="flex gap-3">
          <input
            type="text"
            id="username"
            name="username"
            className="p-2 bg-sub-alt-color rounded"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const input = e.target as HTMLInputElement
                if (input && input.value) {
                  add(input.value)
                  input.value = ''
                }
              }
            }}
          />
          <button
            onClick={() => {
              const input = document.getElementById('username') as HTMLInputElement
              if (input && input.value) {
                add(input.value)
                input.value = ''
              }
            }}
            className="bg-sub-color text-sub-alt-color rounded min-w-20"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  )
}
