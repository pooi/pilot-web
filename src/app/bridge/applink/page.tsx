import { Suspense } from 'react'
import Bridge from './bridge'

export default function Page() {
  return (
    <div>
      <Suspense>
        <Bridge />
      </Suspense>
    </div>
  )
}
