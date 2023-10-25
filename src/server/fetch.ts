import useSWR from 'swr';
import fetch from 'isomorphic-unfetch';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface APIResponse<T> {
  data: T;
  error: Error;
  isLoading?: boolean
}

interface FetchOptions {
  method?: HttpMethod;
  headers?: HeadersInit;
  body?: BodyInit;
}

export interface InputProp {
  method: HttpMethod,
  data: Record<string, any>
}

const API_BASE_URL = 'api/'; // 替换为实际的API基础URL

export const fetcher = async <T>(url: string, input?: InputProp): Promise<T> => {
  let fetchUrl = `${API_BASE_URL}${url}`
  console.log(fetchUrl, 'fetchUrl');

  const { method, data } = input

  const options: FetchOptions = {
    method,
    headers: {
      'Content-Type': 'application/json',
      // 在此处添加任何其他公共请求头
    },
  };

  if (data && !url.includes('?')) {
    if (method === 'GET') {
      const queryParams = new URLSearchParams(data);
      fetchUrl = `${fetchUrl}?${queryParams.toString()}`;
    } else {
      options.body = JSON.stringify(data);
    }
  }


  const res = await fetch(fetchUrl, options);
  const fetchData = await res.json();

  if (!res.ok) {
    throw new Error(fetchData.message || 'An error occurred');
  }

  return fetchData;
};

export const apiRequest = <T>(url: string, method: HttpMethod = 'GET', data?: Record<string, any>): APIResponse<T> => {




  const { data: responseData, error, isLoading } = useSWR<T>(url, (url) => fetcher<T>(url, { method, data }));

  return { data: responseData, error, isLoading };
};

// 示例用法
const getUser = (userId: string) => {
  const { data, error } = apiRequest<User>(`/list/${userId}`);

  if (error) {
    // 处理错误
  }

  return data;
};

interface User {
  id: string;
  name: string;
  // 其他属性
}