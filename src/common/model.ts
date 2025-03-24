export type CreateReferrerRequest = {
  campaign?: string | null
  queryParams: string
  os: string
  osVersion: string
  resolution: string
  colorDepth: string
  timezone: string
  browserFingerprint: string
}

export type CreateReferrerResponse = {
  referrerId?: string
  deeplinkParameter?: string
}
