import { AxiosResponse } from "axios"

export type ResBase<T = any> = () => Promise<T>

export interface ImageListProp {
  images: {
    artist?: {
      artist_id: number
      name: string
      pixiv: string
      twitter: string
    },
    url: string
    width: number
    height: number
    image_id: number
    tags: {
      tag_id: number,
      description: string,
    }[]
  }[]
}