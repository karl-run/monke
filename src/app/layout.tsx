import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import ThemePicker from '@/components/theme-picker/ThemePicker'
import { Suspense } from 'react'
import { cookies } from 'next/headers'

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
})
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
})

export const metadata: Metadata = {
  title: 'Monkeyboard',
  description: 'Simple custom Monkeytype leaderboards',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const theme = cookies().get('theme')?.value

  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href={`https://monkeytype.com/themes/${theme ?? 'serika_dark'}.css`} />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Suspense>
          <ThemePicker persistedTheme={theme ?? null} />
        </Suspense>
        {children}
      </body>
    </html>
  )
}
