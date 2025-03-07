import { ClientJS } from 'clientjs'
import React, { useEffect, Dispatch, SetStateAction } from 'react'

export type CustomClientJs = {
  isMac: () => boolean
  isMobileIOS: () => boolean
  getOS: () => string
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
