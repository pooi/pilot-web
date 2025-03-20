export type CreateReferrerRequest = {
  os: string
  osVersion: string
  resolution: string
  timezone: string
}

export type CreateReferrerResponse = {
  referrerId: string
  deeplinkParameter?: string
}
