'use client'

import Lottie from 'react-lottie-player'
import { useEffect, useState } from 'react'

import dynamic from 'next/dynamic'
import { CustomClientJs } from '../../components/clientJsComponent'
import { useRouter, useSearchParams } from 'next/navigation'
const ClientJs = dynamic(() => import('../../components/clientJsComponent'), {
  ssr: false,
})

export default function Home() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [client, setClient] = useState<CustomClientJs>()

  const createReferrerId = (client: CustomClientJs) => {
    return client.getFingerprint()
  }

  const getPromotion = (promotionId: string) => {
    if (promotionId === '123') {
      return ['action=how_to_use']
    } else if (promotionId === '456') {
      return ['action=service']
    } else {
      return ['foo=bar', 'baz=qux']
    }
  }

  const getDeeplinkParameters = (client: CustomClientJs) => {
    const parameters = []
    if (client.getOS().toLowerCase().includes('android')) {
      parameters.push('package=com.samsung.android.oneconnect')
      parameters.push('id=com.samsung.android.oneconnect')
    }
    return parameters
  }

  const redirectTo = () => {
    if (client) {
      const parameters = []

      const promotionId = searchParams.get('promotionId')
      const promotionDetail = promotionId ? getPromotion(promotionId) : []
      parameters.push(...promotionDetail)

      const referrerId = createReferrerId(client)
      parameters.push(`referrerId=${referrerId}`)

      parameters.push(...getDeeplinkParameters(client))

      router.replace(`/bridge?${parameters.join('&')}`)
    }
  }

  useEffect(() => {
    setTimeout(() => {
      redirectTo()
    }, 1000)
  }, [client])

  return (
    <>
      <ClientJs setClientJs={setClient} />
      <div className="w-full h-screen flex flex-col justify-center items-center gap-y-2 my-[-30px]">
        <div className="flex flex-col items-center">
          <img
            src="/SmartThings_icon.png"
            className="w-[100px]"
            alt="SmartThings"
          />
          <img
            src="/SmartThings_pos.png"
            className="w-[150px]"
            alt="SmartThings"
          />
        </div>
        <div className="flex items-center gap-x-2">
          <Lottie
            play
            loop
            path="/assets/lottie/progress_circle.json"
            style={{
              minWidth: 'auto',
              minHeight: 'auto',
              width: 'min(12vw, 45px)',
              height: 'min(12vw, 45px)',
            }}
          />
        </div>
      </div>
    </>
  )
}
