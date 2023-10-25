import { AxiosResponse } from "axios"

export type ResBase<T = any> = () => Promise<T>

export interface ImageListProp {
  list: {
    url: string
    big_url?: string
    width: number
    height: number
    description?: string
  }[]
}

export interface GirlListProp {
  imageUrl: string;
  imageSize: string;
}

