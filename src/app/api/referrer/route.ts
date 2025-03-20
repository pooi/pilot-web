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
  console.log(req.headers)
  const ip = req.headers.get('x-forwarded-for')
  const body: CreateReferrerRequest = await req.json()
  console.log(`create-referrer, ip=${ip} body=${JSON.stringify(body)}`)

  const hash = crypto.createHash('sha256')
  hash
    .update(`${body.os}-${body.osVersion}-${body.resolution}-${body.timezone}`)
    .toString()
  const hashKey = hash.digest('hex')

  let referrerId = undefined
  let deeplinkParameter = undefined
  if (body.campaign) {
    if (db[hashKey]) {
      const referrers = db[hashKey]
      const matchedReferrers = referrers.filter(
        (referrer) => referrer.browserFingerprint === body.browserFingerprint
      )
      if (matchedReferrers.length === 1) {
        referrerId = matchedReferrers[0].referrerId
        matchedReferrers[0].ip = ip
      } else {
        const ipMatchedReferrers = referrers.filter(
          (referrer) => referrer.ip === ip
        )
        if (ipMatchedReferrers.length === 1) {
          referrerId = ipMatchedReferrers[0].referrerId
        }
      }

      if (!referrerId) {
        referrerId = uuidv4()
        db[hashKey].push({
          referrerId,
          campaign: body.campaign,
          queryParams: body.queryParams,
          ip: ip,
          os: body.os,
          osVersion: body.osVersion,
          resolution: body.resolution,
          timezone: body.timezone,
          browserFingerprint: body.browserFingerprint,
        })
      }
    } else {
      referrerId = uuidv4()
      db[hashKey] = [
        {
          referrerId,
          campaign: body.campaign,
          queryParams: body.queryParams,
          ip: ip,
          os: body.os,
          osVersion: body.osVersion,
          resolution: body.resolution,
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
  const ip = req.headers.get('x-forwarded-for')

  const os = req.nextUrl.searchParams.get('os')
  const osVersion = req.nextUrl.searchParams.get('osVersion')
  const resolution = req.nextUrl.searchParams.get('resolution')
  const timezone = req.nextUrl.searchParams.get('timezone')
  console.log(
    `get-referrer, ip=${ip}, os=${os}, osVersion=${osVersion}, resolution=${resolution}, timezone=${timezone}`
  )

  const hash = crypto.createHash('sha256')
  hash.update(`${os}-${osVersion}-${resolution}-${timezone}`).toString()
  const hashKey = hash.digest('hex')

  let referrer: Referrer | undefined
  if (db[hashKey]) {
    const referrers = db[hashKey]
    if (referrers.length === 1) {
      referrer = referrers[0]
    } else {
      const matchedReferrers = referrers.filter(
        (referrer) => referrer.ip === ip
      )
      if (matchedReferrers.length === 1) {
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
