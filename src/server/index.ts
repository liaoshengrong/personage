import { cache } from 'react'
import axios, { AxiosResponse } from 'axios'
import { IMAGE_LIST } from './graphql'
import api from './axios'
import { ImageListProp, ResBase } from './type'


export const testApi = cache(async () => {
  const res = await api.get('').then(res => res)
  return res
})

export const getImageList: ResBase<ImageListProp> = cache(async () => {
  return api.get<ImageListProp>('/search', {
    params: {
      many: true
    },
  }).then(res => res)

  // return api.post('', {
  //   query: IMAGE_LIST,
  //   variables
  // })
})


export const revalidate = 3600
