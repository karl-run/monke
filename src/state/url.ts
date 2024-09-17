import { parseAsArrayOf, parseAsString } from "nuqs";


export const langParser = parseAsString.withDefault('english')

export const usersParser = parseAsArrayOf(parseAsString, ',').withDefault([])