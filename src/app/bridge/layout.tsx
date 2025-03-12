import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'SmartThings',
  description:
    'SmartThings makes your home smarter. Meet the innovative new SmartThings features that enhance home automation and simplify your daily life.',
  icons: {
    icon: 'favicon-16x16.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="w-full h-[100dvh] flex flex-col justify-between items-center pt-20 pb-16">
      <div className="flex flex-col items-center">
        <img
          src="/SmartThings_logo-01.png"
          className="w-[200px]"
          alt="SmartThings"
        />
      </div>
      {children}
    </div>
  )
}
