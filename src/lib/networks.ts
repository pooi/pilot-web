import axios from 'axios'

export const baseClient = axios.create({
  //   withCredentials: true,
  headers: {
    Accept: 'application/json',
  },
  timeout: 10 * 1000,
})

export const fetcher = (url: string) =>
  baseClient.get(url).then((res) => res.data)
