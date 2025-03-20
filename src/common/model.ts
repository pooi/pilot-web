export type CreateReferrerRequest = {
  os: string
  osVersion: string
  resolution: string
  timezone: string
  ip?: string
}

export type CreateReferrerResponse = {
  referrerId: string
  deeplinkParameter?: string
}
