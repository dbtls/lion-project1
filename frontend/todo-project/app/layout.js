import './globals.css'

export const metadata = {
  title: 'Todo 리스트',
  description: '할 일 관리 애플리케이션',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  )
}

