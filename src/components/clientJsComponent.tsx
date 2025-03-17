import { ClientJS } from 'clientjs'
import React, { useEffect, Dispatch, SetStateAction } from 'react'

export type CustomClientJs = {
  getBrowser(): any // eslint-disable-line @typescript-eslint/no-explicit-any
  getUserAgent(): string
  getBrowser(): string
  getBrowserVersion(): string
  getBrowserMajorVersion(): string
  isIE(): boolean
  isChrome(): boolean
  isFirefox(): boolean
  isSafari(): boolean
  isOpera(): boolean
  getEngine(): string
  getEngineVersion(): string
  isWindows(): boolean
  isLinux(): boolean
  isUbuntu(): boolean
  isSolaris(): boolean
  getDevice(): string
  getDeviceType(): string
  getDeviceVendor(): string
  getCPU(): string
  isMobile(): boolean
  isMobileMajor(): boolean
  isMobileAndroid(): boolean
  isMobileOpera(): boolean
  isMobileWindows(): boolean
  isMobileBlackBerry(): boolean
  isIphone(): boolean
  isIpad(): boolean
  isIpod(): boolean
  getScreenPrint(): string
  getColorDepth(): string
  getCurrentResolution(): string
  getDeviceXDPI(): string
  getDeviceYDPI(): string
  getPlugins(): string
  isSilverlight(): boolean
  getSilverlightVersion(): string
  getMimeTypes(): string
  isMimeTypes(): boolean
  getFonts(): string
  isLocalStorage(): boolean
  isSessionStorage(): boolean
  isCookie(): boolean
  getLanguage(): string
  getSystemLanguage(): string
  isCanvas(): boolean
  getCanvasPrint(): string
  isMac: () => boolean
  isMobileIOS: () => boolean
  getOS: () => string
  getOSVersion: () => string
  getAvailableResolution: () => string
  getTimeZone: () => string
  getFingerprint: () => number
}

interface Props {
  setClientJs: Dispatch<SetStateAction<CustomClientJs | undefined>>
}

const ClientJsComponent: React.FunctionComponent<Props> = ({ setClientJs }) => {
  useEffect(() => {
    const client = new ClientJS()
    setClientJs(client)
  }, [])

  return null
}

export default ClientJsComponent
