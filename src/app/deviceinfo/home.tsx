'use client'

import { useEffect, useState } from 'react'

import dynamic from 'next/dynamic'
import { CustomClientJs } from '../../components/clientJsComponent'

const ClientJs = dynamic(() => import('../../components/clientJsComponent'), {
  ssr: false,
})

export default function Home() {
  const [client, setClient] = useState<CustomClientJs>()
  const [clientjsData, setClientjsData] = useState<any>() // eslint-disable-line @typescript-eslint/no-explicit-any

  useEffect(() => {
    if (client && client.getCanvasPrint()) {
      const canvas = document.getElementById('c') as HTMLCanvasElement
      const ctx = canvas.getContext('2d')
      const img = new Image()
      img.src = client.getCanvasPrint()
      img.onload = () => {
        ctx?.drawImage(img, 0, 0)
      }
    }
  }, [client])

  useEffect(() => {
    if (client) {
      setClientjsData({
        getFingerprint: client.getFingerprint(),
        getBrowserData: client.getBrowser(),
        getUserAgent: client.getUserAgent(),
        getBrowser: client.getBrowser(),
        getBrowserVersion: client.getBrowserVersion(),
        getBrowserMajorVersion: client.getBrowserMajorVersion(),
        isIE: client.isIE(),
        isChrome: client.isChrome(),
        isFirefox: client.isFirefox(),
        isSafari: client.isSafari(),
        isOpera: client.isOpera(),
        getEngine: client.getEngine(),
        getEngineVersion: client.getEngineVersion(),
        getOS: client.getOS(),
        getOSVersion: client.getOSVersion(),
        isWindows: client.isWindows(),
        isMac: client.isMac(),
        isLinux: client.isLinux(),
        isUbuntu: client.isUbuntu(),
        isSolaris: client.isSolaris(),
        getDevice: client.getDevice(),
        getDeviceType: client.getDeviceType(),
        getDeviceVendor: client.getDeviceVendor(),
        getCPU: client.getCPU(),
        isMobile: client.isMobile(),
        isMobileMajor: client.isMobileMajor(),
        isMobileAndroid: client.isMobileAndroid(),
        isMobileOpera: client.isMobileOpera(),
        isMobileWindows: client.isMobileWindows(),
        isMobileBlackBerry: client.isMobileBlackBerry(),
        isMobileIOS: client.isMobileIOS(),
        isIphone: client.isIphone(),
        isIpad: client.isIpad(),
        isIpod: client.isIpod(),
        getScreenPrint: client.getScreenPrint(),
        getColorDepth: client.getColorDepth(),
        getCurrentResolution: client.getCurrentResolution(),
        getAvailableResolution: client.getAvailableResolution(),
        getDeviceXDPI: client.getDeviceXDPI(),
        getDeviceYDPI: client.getDeviceYDPI(),
        getPlugins: client.getPlugins(),
        isSilverlight: client.isSilverlight(),
        getSilverlightVersion: client.getSilverlightVersion(),
        getMimeTypes: client.getMimeTypes(),
        isMimeTypes: client.isMimeTypes(),
        getFonts: client.getFonts(),
        numberOfFonts: (client.getFonts() ?? '').split(',').length,
        isLocalStorage: client.isLocalStorage(),
        isSessionStorage: client.isSessionStorage(),
        isCookie: client.isCookie(),
        getTimeZone: client.getTimeZone(),
        getLanguage: client.getLanguage(),
        getSystemLanguage: client.getSystemLanguage(),
        isCanvas: client.isCanvas(),
        getCanvasPrint: client.getCanvasPrint(),
      })
    }
  }, [client])

  return (
    <>
      <ClientJs setClientJs={setClient} />
      <div className="flex flex-col items-start gap-y-4">
        {clientjsData && (
          <p className=" break-words whitespace-break-spaces max-w-full">
            {JSON.stringify(clientjsData, null, 4)}
          </p>
        )}
        <canvas id="c"></canvas>
      </div>
    </>
  )
}
