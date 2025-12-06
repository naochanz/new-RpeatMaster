import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'RepeatMaster - 問題集周回記録アプリ',
  description: '資格試験の問題集学習を効率化。周回記録を自動管理し、あなたの合格をサポートします。',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  )
}
