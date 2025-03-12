'use client'

import { useEffect, useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import { CustomClientJs } from '../../../components/clientJsComponent'
import { useRouter, useSearchParams } from 'next/navigation'

const ClientJs = dynamic(
  () => import('../../../components/clientJsComponent'),
  {
    ssr: false,
  }
)

export default function Bridge() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [client, setClient] = useState<CustomClientJs>()

  const getDeeplink = (client: CustomClientJs) => {
    const os = client.getOS().toLowerCase()
    if (os.includes('ios') || os.includes('mac')) {
      return process.env.NEXT_PUBLIC_IOS_DEEPLINK ?? 'samsungconnect://launch'
    } else {
      return process.env.NEXT_PUBLIC_ANDROID_DEEPLINK ?? 'scapp://launch'
    }
  }

  const getStoreUrl = (client: CustomClientJs) => {
    let storeUrl = ''
    if (client.isMac() || client.isMobileIOS()) {
      storeUrl = process.env.NEXT_PUBLIC_APPLE_APPSTORE_URL ?? ''
    } else if (client.getOS().toLowerCase().includes('android')) {
      storeUrl = process.env.NEXT_PUBLIC_PLAY_STORE_URL ?? ''
    } else {
      storeUrl = process.env.NEXT_PUBLIC_PLAY_STORE_URL ?? ''
    }
    return storeUrl
  }

  const makeUrl = (baseUrl: string, queryParam: string): string => {
    if (baseUrl.endsWith('?')) {
      return `${baseUrl}${queryParam}`
    } else {
      return `${baseUrl}?${queryParam}`
    }
  }

  const deepLink = useMemo(() => {
    if (client) {
      return makeUrl(getDeeplink(client), searchParams.toString())
    } else {
      return ''
    }
  }, [client, searchParams])

  const storeLink = useMemo(() => {
    if (client) {
      return makeUrl(getStoreUrl(client), searchParams.toString())
    } else {
      return ''
    }
  }, [client, searchParams])

  const openApp = () => {
    window.location.href = deepLink
  }
  const installApp = () => {
    window.location.href = storeLink
  }

  useEffect(() => {
    if (client) {
      setTimeout(() => {
        router.push(deepLink)
      }, 500)
    }
  }, [client])

  return (
    <>
      <ClientJs setClientJs={setClient} />
      <div className="flex flex-col items-center gap-y-6" id="abc">
        <div className="flex flex-col gap-y-1 justify-center items-center">
          <button
            className="w-60 py-2.5 bg-[#006BEA] text-white font-medium text-sm rounded-full cursor-pointer hover:bg-[#008DF7] transition-all"
            onClick={openApp}
          >
            Continue with SmartThings
          </button>
          <p className=" font-light text-xs text-gray-600">
            {"If the app doesn't open automatically"}
          </p>
        </div>
        <div className="flex flex-col gap-y-1 justify-center items-center">
          <button
            className="w-60 py-2.5 bg-black text-white font-medium text-sm rounded-full cursor-pointer hover:bg-black transition-all"
            onClick={installApp}
          >
            App Download
          </button>
          <p className=" font-light text-xs text-gray-600">
            {"If the app isn't installed"}
          </p>
        </div>
      </div>
    </>
  )
}
