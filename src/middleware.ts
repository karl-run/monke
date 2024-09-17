import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  if (request.nextUrl.searchParams.size !== 0) {
    const response = NextResponse.next()
    const u = request.nextUrl.searchParams.get('u')
    const lang = request.nextUrl.searchParams.get('lang')

    if (u) response.cookies.set('users', u)
    if (lang) response.cookies.set('lang', lang)

    return response
  }

  const lastUsers = request.cookies.get('users')
  if (lastUsers == null) {
    return NextResponse.next()
  }

  const redirectUrl = new URL('/', request.url)
  redirectUrl.searchParams.set('u', lastUsers.value)
  redirectUrl.searchParams.set('lang', request.cookies.get('lang')?.value ?? 'english')
  return NextResponse.redirect(redirectUrl)
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: '/',
}
