export type CreateReferrerRequest = {
  campaign?: string | null
  queryParams: string
  os: string
  osVersion: string
  resolution: string
  timezone: string
  browserFingerprint: string
}

export type CreateReferrerResponse = {
  referrerId?: string
  deeplinkParameter?: string
}
