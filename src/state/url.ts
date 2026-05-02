import { parseAsArrayOf, parseAsString } from "nuqs/server";


export const langParser = parseAsString.withDefault('english')

export const usersParser = parseAsArrayOf(parseAsString, ',').withDefault([])