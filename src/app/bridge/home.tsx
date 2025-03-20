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

  const createReferrer = async (
    client: CustomClientJs,
    campaign: string | null,
    queryParams: string
  ) => {
    const body: CreateReferrerRequest = {
      campaign: campaign,
      queryParams: queryParams,
      os: client.getOS(),
      osVersion: client.getOSVersion(),
      resolution: client.getAvailableResolution(),
      timezone: client.getTimeZone(),
      browserFingerprint: client.getFingerprint().toString(),
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
    return data
  }

  const redirectTo = async () => {
    if (client) {
      const parameters = []

      const queryParams = searchParams.toString()
      const campaign = searchParams.get('utm_campaign')
      const referrer = await createReferrer(client, campaign, queryParams)

      if (referrer.referrerId) {
        parameters.push(`referrerId=${referrer.referrerId}`)
      }
      if (referrer.deeplinkParameter) {
        parameters.push(referrer.deeplinkParameter)
      }

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
