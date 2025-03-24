'use client'

import React, { useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { CustomClientJs } from '@/components/clientJsComponent'

interface Props {
  client: CustomClientJs
}

type Row = {
  key: string
  value: string | null
}

const ClientDetail: React.FunctionComponent<Props> = ({ client }) => {
  const searchParams = useSearchParams()

  const rows: Row[] = useMemo(() => {
    const results: Row[] = [
      { key: 'os', value: client.getOS() },
      { key: 'osVersion', value: client.getOSVersion() },
      { key: 'resolution', value: client.getAvailableResolution() },
      { key: 'colorDepth', value: client.getColorDepth() },
      { key: 'timezone', value: client.getTimeZone() },
      { key: 'browserFingerprint', value: client.getFingerprint().toString() },
    ]

    if (searchParams.toString()) {
      results.push({
        key: 'searchParams',
        value: searchParams.toString(),
      })
    }

    return results
  }, [client, searchParams])

  return (
    <div className="max-w-lg w-full text-center break-words whitespace-break-spaces">
      {rows.map((row) => (
        <p key={row.key}>
          <b>{row.key}</b> : {row.value}
        </p>
      ))}
    </div>
  )
}

export default ClientDetail
