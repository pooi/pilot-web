import { Suspense } from 'react'
import Home from './home'

export default function Page() {
  return (
    <div>
      <Suspense>
        <Home />
      </Suspense>
    </div>
  )
}
