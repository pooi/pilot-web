'use client'

import Lottie from 'react-lottie-player'
import { useEffect, useState } from 'react'
import useSWR from 'swr'
import { SHA1 } from 'crypto-js'

import dynamic from 'next/dynamic'
import { CustomClientJs } from '../../components/clientJsComponent'
import { useRouter, useSearchParams } from 'next/navigation'
import { fetcher } from '@/lib/networks'
import progressData from '@/assets/progress_circle.json'

const ClientJs = dynamic(() => import('../../components/clientJsComponent'), {
  ssr: false,
})

type GeoLocation = {
  IPv4?: string
  city?: string
  latitude?: number
  longitude?: number
  state?: string
}

export default function Home() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [client, setClient] = useState<CustomClientJs>()

  const { data: geoLocation, isLoading: geoLocationLoading } =
    useSWR<GeoLocation>('https://geolocation-db.com/json/', fetcher)

  const createReferrerId = (client: CustomClientJs, ip?: string) => {
    const referrerIds = [
      SHA1(
        `${client.getOS()}-${client.getOSVersion()}-${client.getAvailableResolution()}-${client.getTimeZone()}-${ip}`
      ).toString(),
    ]
    return referrerIds.join('/')
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

  const redirectTo = () => {
    if (client && !geoLocationLoading) {
      const parameters = []

      const promotionId = searchParams.get('promotionId')
      const promotionDetail = promotionId ? getPromotion(promotionId) : []
      parameters.push(...promotionDetail)

      const ip = geoLocation?.IPv4
      const referrerId = createReferrerId(client, ip)
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
  }, [client, geoLocationLoading])

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
