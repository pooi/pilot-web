import { Suspense } from 'react'
import Home from './(home)/home'

export default function Page() {
  return (
    <div className="w-full flex flex-col items-center">
      <main className="container items-center min-h-screen">
        <Suspense>
          <Home />
        </Suspense>
      </main>
    </div>
  )
}
