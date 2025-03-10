import { Suspense } from 'react'
import Bridge from './bridge'

export default function Page() {
  return (
    <div className="w-full flex flex-col items-center">
      <main className="container items-center min-h-screen">
        <Suspense>
          <Bridge />
        </Suspense>
      </main>
    </div>
  )
}
