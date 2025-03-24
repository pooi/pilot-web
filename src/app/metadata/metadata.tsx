'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { CustomClientJs } from '../../components/clientJsComponent'
import ClientDetail from '../bridge/(common)/clientDetail'

const ClientJs = dynamic(() => import('../../components/clientJsComponent'), {
  ssr: false,
})

export default function Metadata() {
  const [client, setClient] = useState<CustomClientJs>()

  return (
    <>
      <ClientJs setClientJs={setClient} />
      <div
        className="flex flex-col items-center h-full justify-center gap-y-6"
        id="abc"
      >
        {client && <ClientDetail client={client} />}
      </div>
    </>
  )
}
