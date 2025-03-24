import { Suspense } from 'react'
import Metadata from './metadata'

export default function Page() {
  return (
    <div className="w-full h-[100dvh] flex flex-col justify-between items-center">
      <Suspense>
        <Metadata />
      </Suspense>
    </div>
  )
}
