'use client'

import Lottie from 'react-lottie-player'
import { useEffect, useState } from 'react'

import dynamic from 'next/dynamic'
import { CustomClientJs } from '../../components/clientJsComponent'
import { useRouter, useSearchParams } from 'next/navigation'
import progressData from '@/assets/progress_circle.json'
import axios from 'axios'
import { CreateReferrerRequest, CreateReferrerResponse } from '@/common/model'

const ClientJs = dynamic(() => import('../../components/clientJsComponent'), {
  ssr: false,
})

export default function Home() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [client, setClient] = useState<CustomClientJs>()

  const createReferrerId = async (client: CustomClientJs) => {
    const body: CreateReferrerRequest = {
      os: client.getOS(),
      osVersion: client.getOSVersion(),
      resolution: client.getAvailableResolution(),
      timezone: client.getTimeZone(),
    }
    const { data } = await axios.post<CreateReferrerResponse>(
      `/api/referrer`,
      body,
      {
        headers: {
          'Content-type': 'application/json',
          Accept: 'application/json',
        },
      }
    )
    return data.referrerId
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

  const redirectTo = async () => {
    if (client) {
      const parameters = []

      const promotionId = searchParams.get('promotionId')
      const promotionDetail = promotionId ? getPromotion(promotionId) : []
      parameters.push(...promotionDetail)

      const referrerId = await createReferrerId(client)
      parameters.push(`referrerId=${referrerId}`)

      router.replace(`/bridge/applink?${parameters.join('&')}`)
    }
  }

  useEffect(() => {
    window.addEventListener('unload', () => console.log('unload'))
  }, [])

  useEffect(() => {
    setTimeout(() => {
      redirectTo()
    }, 1000)
  }, [client])

  return (
    <>
      <ClientJs setClientJs={setClient} />
      <div className="flex items-center gap-x-2">
        <Lottie
          play
          loop
          animationData={progressData}
          style={{
            minWidth: 'auto',
            minHeight: 'auto',
            width: 'min(12vw, 45px)',
            height: 'min(12vw, 45px)',
          }}
        />
      </div>
    </>
  )
}
