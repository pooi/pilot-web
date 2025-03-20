import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { CreateReferrerRequest, CreateReferrerResponse } from '@/common/model'

export async function POST(req: NextRequest) {
  console.log(req.headers)
  const ip = req.headers.get('x-forwarded-for')
  const body: CreateReferrerRequest = await req.json()
  console.log(`create-referrer, ip=${ip} body=${JSON.stringify(body)}`)

  const hash = crypto.createHash('sha256')
  hash
    .update(
      `${body.os}-${body.osVersion}-${body.resolution}-${body.timezone}-${ip}`
    )
    .toString()
  const referrerId = hash.digest('hex')

  const response: CreateReferrerResponse = {
    referrerId,
    deeplinkParameter: 'action=how_to_use',
  }
  return NextResponse.json(response)
}
