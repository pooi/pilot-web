'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { CustomClientJs } from '../../components/clientJsComponent'
import { DeepLinker } from '@/common/DeepLinker'
const ClientJs = dynamic(() => import('../../components/clientJsComponent'), {
  ssr: false,
})

export default function Bridge() {
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

  const openApp = () => {
    if (client) {
      const deeplink = makeUrl(
        getDeeplink(client),
        window.location.search.substring(1)
      )
      window.location.href = deeplink
    }
  }
  const installApp = () => {
    if (client) {
      const storeUrl = makeUrl(
        getStoreUrl(client),
        window.location.search.substring(1)
      )
      window.location.href = storeUrl
    }
  }

  useEffect(() => {
    if (client) {
      const queryParam = window.location.search.substring(1)

      const storeUrl = makeUrl(getStoreUrl(client), queryParam)
      const deeplink = makeUrl(getDeeplink(client), queryParam)

      const linker = new DeepLinker({
        onIgnored: function () {
          // console.log('onIgnored', storeUrl)
          window.location.href = storeUrl
        },
        onFallback: function () {
          // console.log('onFallback', storeUrl)
          window.location.href = storeUrl
        },
        onReturn: function () {},
      })

      setTimeout(() => {
        // console.log('openURL', deeplink)
        linker.openURL(deeplink)
      }, 1000)
    }
  }, [client])

  return (
    <>
      <ClientJs setClientJs={setClient} />
      <div className="w-full h-screen flex flex-col justify-center items-center gap-y-6 my-[-30px]">
        <div className="flex flex-col items-center">
          <img src="/SmartThings_logo_full.png" className="w-[210px]" />
        </div>
        <div className="flex flex-col items-center gap-y-3">
          <div className="flex flex-col gap-y-1 justify-center items-center">
            <button
              className="w-52 py-2 bg-[#0090fa] text-white font-medium text-sm rounded-lg cursor-pointer hover:bg-[#0075fa] transition-all"
              onClick={openApp}
            >
              Open SmartThings
            </button>
            <p className=" font-light text-xs text-gray-600">
              {"If the app doesn't open automatically"}
            </p>
          </div>
          <div className="flex flex-col gap-y-1 justify-center items-center">
            <button
              className="w-52 py-2 bg-[#0090fa] text-white font-medium text-sm rounded-lg cursor-pointer hover:bg-[#0075fa] transition-all"
              onClick={installApp}
            >
              Install SmartThings
            </button>
            <p className=" font-light text-xs text-gray-600">
              {"If the app isn't installed"}
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
