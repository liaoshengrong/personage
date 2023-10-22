import { cache } from 'react'
import axios, { AxiosResponse } from 'axios'
import { IMAGE_LIST } from './graphql'
import api from './axios'
import { GirlListProp, ImageListProp, ResBase } from './type'

export const testApi = cache(async () => {
  const res = await api.get('').then(res => res)
  return res
})

export const getImageList = cache(async () => {
  return api.get<ImageListProp>('/search', {
    params: {
      many: true
    },
  }).then(res => res.data)
})


export const getGirlImageList = cache(async ({ page }) => {
  return api.get<GirlListProp[]>('image/girl/list', {
    params: {
      page
    },
  }).then(res => res.data)
})

export const revalidate = 3600
