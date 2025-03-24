import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { v4 as uuidv4 } from 'uuid'
import { CreateReferrerRequest, CreateReferrerResponse } from '@/common/model'

type Referrer = {
  referrerId: string
  campaign: string
  queryParams: string
  ip: string | null
  os: string
  osVersion: string
  resolution: string
  colorDepth: string
  timezone: string
  browserFingerprint: string
}

type Database = {
  [key: string]: Referrer[]
}

const db: Database = {}

function getCampaignDetails(campaign?: string | null) {
  if (campaign && campaign === '123') {
    return 'action=how_to_use'
  }
  return undefined
}

export async function POST(req: NextRequest) {
  const loggingId = uuidv4()
  console.log(loggingId, req.headers)
  const ip = req.headers.get('x-forwarded-for')
  const body: CreateReferrerRequest = await req.json()
  console.log(
    loggingId,
    `create-referrer, ip=${ip} body=${JSON.stringify(body)}`
  )

  const hash = crypto.createHash('sha256')
  hash
    .update(
      `${body.os}-${body.osVersion}-${body.resolution}-${body.timezone}-${body.colorDepth}`
    )
    .toString()
  const hashKey = hash.digest('hex')

  let referrerId = undefined
  let deeplinkParameter = undefined
  if (body.campaign) {
    if (db[hashKey]) {
      console.log(loggingId, 'found-hash')
      const referrers = db[hashKey]
      const matchedReferrers = referrers.filter(
        (referrer) => referrer.browserFingerprint === body.browserFingerprint
      )
      if (matchedReferrers.length === 1) {
        console.log(loggingId, 'found-referrer-only-one')
        referrerId = matchedReferrers[0].referrerId
        matchedReferrers[0].ip = ip
      } else {
        const ipMatchedReferrers = referrers.filter(
          (referrer) => referrer.ip === ip
        )
        if (ipMatchedReferrers.length === 1) {
          console.log(loggingId, 'found-referrer-ip-only-one')
          referrerId = ipMatchedReferrers[0].referrerId
        } else {
          console.log(loggingId, 'found-multiple-referrer-with-ip')
        }
      }

      if (!referrerId) {
        referrerId = uuidv4()
        console.log(loggingId, `save-new-referrer-2, referrerId=${referrerId}`)
        db[hashKey].push({
          referrerId,
          campaign: body.campaign,
          queryParams: body.queryParams,
          ip: ip,
          os: body.os,
          osVersion: body.osVersion,
          resolution: body.resolution,
          colorDepth: body.colorDepth,
          timezone: body.timezone,
          browserFingerprint: body.browserFingerprint,
        })
      }
    } else {
      referrerId = uuidv4()
      console.log(loggingId, `save-new-referrer, referrerId=${referrerId}`)
      db[hashKey] = [
        {
          referrerId,
          campaign: body.campaign,
          queryParams: body.queryParams,
          ip: ip,
          os: body.os,
          osVersion: body.osVersion,
          resolution: body.resolution,
          colorDepth: body.colorDepth,
          timezone: body.timezone,
          browserFingerprint: body.browserFingerprint,
        },
      ]
    }

    deeplinkParameter = getCampaignDetails(body.campaign)
  }

  const response: CreateReferrerResponse = {
    referrerId,
    deeplinkParameter: deeplinkParameter,
  }
  return NextResponse.json(response)
}

export async function GET(req: NextRequest) {
  const loggingId = uuidv4()
  const ip = req.headers.get('x-forwarded-for')

  const os = req.nextUrl.searchParams.get('os')
  const osVersion = req.nextUrl.searchParams.get('osVersion')
  const resolution = req.nextUrl.searchParams.get('resolution')
  const colorDepth = req.nextUrl.searchParams.get('colorDepth')
  const timezone = req.nextUrl.searchParams.get('timezone')
  console.log(
    loggingId,
    `get-referrer, ip=${ip}, searchParams=${req.nextUrl.searchParams}`
  )

  const hash = crypto.createHash('sha256')
  hash
    .update(`${os}-${osVersion}-${resolution}-${timezone}-${colorDepth}`)
    .toString()
  const hashKey = hash.digest('hex')

  let referrer: Referrer | undefined
  if (db[hashKey]) {
    console.log(loggingId, 'get-referrer-found-hash')
    const referrers = db[hashKey]
    if (referrers.length === 1) {
      console.log(loggingId, 'found-only-one-referrer')
      referrer = referrers[0]
    } else {
      console.log(loggingId, 'found-multiple-referrer')
      const matchedReferrers = referrers.filter(
        (referrer) => referrer.ip === ip
      )
      if (matchedReferrers.length === 1) {
        console.log(loggingId, 'found-only-one-matched-ip')
        referrer = matchedReferrers[0]
      }
    }
  }

  const response: CreateReferrerResponse = {
    referrerId: referrer?.referrerId,
    deeplinkParameter: getCampaignDetails(referrer?.campaign),
  }
  return NextResponse.json(response)
}
